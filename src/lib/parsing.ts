import Papa from "papaparse";
import { useState, useCallback, useRef, useEffect } from "react";

// =====================================================
// Types
// =====================================================

// Helper function to normalize payer names
const normalizePayer = (s?: string): string => {
    const x = (s || "").trim();
    if (!x) return "";
    const lower = x.toLowerCase();
    if (["tôi", "minh", "mình", "me", "self", "ban than", "bản thân", "toi"].includes(lower)) {
        return "You";
    }
    return x;
};

export type Tx = {
    id: string;
    date: Date;
    rawDate: string;
    categoryParent: string;
    categoryChild: string;
    amount: number; // >0 income, <0 expense
    note?: string;
    wallet?: string;
    payer?: string; // NEW: who paid for this transaction
};

// =====================================================
// Category mapping (parent -> children) + income set
// =====================================================

export const PARENT_TO_CHILDREN: Record<string, string[]> = {
    "Daily Food & Drinks": [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Coffee",
        "Milk tea",
        "Snacks",
        "Smoothie",
        "Fruit",
        "7-Eleven",
        "Grab Food",
    ],
    Entertainment: ["Movies", "Karaoke", "Netflix", "Ice Skating", "Pickleball", "Badminton"],
    Essential: [
        "Rent",
        "Electricity",
        "Internet",
        "Laundry",
        "Dental Care",
        "Fashion",
        "Shoes",
        "Haircut",
        "Phones",
    ],
    Transportation: ["Grab Car", "Grab Shipping", "Motorbike", "Fuel", "Parking", "Parking (fixed)"],
    "Investment & Savings": ["Investments"],
    "Personal Care": ["Personal Care (general)"],
    Services: ["Services (general)"],
    Others: [
        "Momo",
        "Cho vay",
        "Rút tiền",
        "Lost",
        "Occasional",
        "Các chi phí khác",
        "Shopee",
        "Apple Store",
        "Apple Music",
        "AI",
        "Tools (nếu có phát sinh, thấy trong sheet cha)",
        "Credits",
    ],
};

export const CHILD_TO_PARENT: Record<string, string> = Object.entries(PARENT_TO_CHILDREN).reduce(
    (acc, [p, arr]) => {
        for (const c of arr) acc[c] = p;
        acc[p] = p;
        return acc;
    },
    {} as Record<string, string>
);

export const INCOME_CHILDREN = new Set<string>([
    "Salary",
    "Main Income",
    "Thu nợ",
    "Reimbursement",
    "Refund",
    "Other Bonus",
    "Thu nhập khác",
    "Internal Transfers",
    "Momo",
]);

// =====================================================
// Helpers
// =====================================================

export const getMonthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const parseVNDate = (d: string) => {
    const [dd, mm, yyyy] = d.split("/").map((x) => parseInt(x, 10));
    return new Date(yyyy, (mm || 1) - 1, dd || 1);
};

export function parseAmount(raw: string): number {
    let s = String(raw).trim();
    if (!s) return 0;
    s = s.replace(/[\s₫VNĐvnd]/gi, "");
    const negParen = /^\(.*\)$/.test(s);
    if (negParen) s = s.slice(1, -1);
    if (s.includes(".") && s.includes(",")) {
        if (s.lastIndexOf(".") > s.lastIndexOf(",")) s = s.replace(/,/g, "");
        else s = s.replace(/\./g, "").replace(/,/g, ".");
    } else if (/\d,\d{2}$/.test(s)) s = s.replace(/,/g, ".");
    else s = s.replace(/,/g, "");
    const n = parseFloat(s);
    const val = isNaN(n) ? 0 : n;
    return negParen ? -val : val;
}

export function hashRow(d: string, child: string, amt: number, note?: string) {
    return `${d}|${child}|${amt}|${note ?? ""}`;
}

// =====================================================
// CSV Import hook (detailed & summary), idempotent, month-anchored
// =====================================================

export function useCsvImport() {
    const [transactions, setTransactions] = useState<Tx[]>([]);
    const [notice, setNotice] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Use ref to avoid stale closure
    const transactionsRef = useRef<Tx[]>([]);

    useEffect(() => {
        transactionsRef.current = transactions;
    }, [transactions]);

    const importCsv = useCallback((file: File, selectedMonth: string) => {
        setLoading(true);
        setNotice("");
        const fileName = file.name || "";
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            encoding: "utf-8",
            complete: (res: any) => {
                try {
                    const rows = (res.data as any[]) || [];
                    if (!rows.length) {
                        setNotice("⚠️ File rỗng hoặc không đọc được.");
                        setLoading(false);
                        return;
                    }
                    const hasNgay = Object.prototype.hasOwnProperty.call(rows[0], "Ngày");
                    const hasNhom = Object.prototype.hasOwnProperty.call(rows[0], "Nhóm");
                    const hasSoTien = Object.prototype.hasOwnProperty.call(rows[0], "Số tiền");

                    const next = new Map<string, Tx>();
                    for (const t of transactionsRef.current) next.set(hashRow(t.rawDate, t.categoryChild, t.amount, t.note), t);

                    if (hasNgay && hasSoTien) {
                        for (let i = 0; i < rows.length; i++) {
                            const r = rows[i];
                            if (!r["Số tiền"]) continue;
                            const rawDate = String(r["Ngày"]).trim();
                            const date = parseVNDate(rawDate);
                            const rawAmt = parseAmount(String(r["Số tiền"]));
                            const child = String(r["Nhóm"] ?? "Unknown");
                            const parent = CHILD_TO_PARENT[child] || child;
                            let amt = rawAmt;
                            if (amt > 0 && !INCOME_CHILDREN.has(child)) amt = -amt; // fix sign for expenses
                            if (amt < 0 && INCOME_CHILDREN.has(child)) amt = Math.abs(amt); // normalize income
                            // Parse payer from "Với" or "Thành viên" columns
                            const payerRaw = r["Với"] ?? r["Thành viên"] ?? "";
                            const payer = normalizePayer(String(payerRaw));

                            const tx: Tx = {
                                id: String(r["Id"] ?? `${fileName}-${i}`),
                                rawDate,
                                date,
                                categoryParent: parent,
                                categoryChild: child,
                                amount: amt,
                                note: r["Ghi chú"]?.toString(),
                                wallet: r["Ví"]?.toString(),
                                payer,
                            };
                            const key = hashRow(tx.rawDate, tx.categoryChild, tx.amount, tx.note);
                            if (!next.has(key)) next.set(key, tx);
                        }
                        setTransactions(Array.from(next.values()));
                        setNotice("");
                        setLoading(false);
                        return;
                    }

                    if (hasNhom && hasSoTien) {
                        const isIncome = /thu|income/i.test(fileName);
                        const [y, m] = selectedMonth.split("-").map((n) => parseInt(n, 10));
                        const anchorDate = new Date(y, (m || 1) - 1, 1);
                        for (let i = 0; i < rows.length; i++) {
                            const r = rows[i];
                            const child = String(r["Nhóm"] ?? "Unknown");
                            const parent = CHILD_TO_PARENT[child] || child;
                            const rawAmt = parseAmount(String(r["Số tiền"]));
                            const amt = isIncome ? Math.abs(rawAmt) : -Math.abs(rawAmt);
                            // For summary CSVs, infer payer from note or leave blank
                            const note = r["Ghi chú"]?.toString() || "";
                            const payerHint = /reimbursement|company|hoan tien|hoàn tiền/i.test(note) ? "Company" : "";

                            const tx: Tx = {
                                id: `${fileName}-${i}`,
                                rawDate: `01/${String(anchorDate.getMonth() + 1).padStart(2, "0")}/${anchorDate.getFullYear()}`,
                                date: anchorDate,
                                categoryParent: parent,
                                categoryChild: child,
                                amount: amt,
                                note: note || "Imported summary",
                                wallet: r["Ví"]?.toString(),
                                payer: payerHint,
                            };
                            const key = hashRow(tx.rawDate, tx.categoryChild, tx.amount, tx.note);
                            if (!next.has(key)) next.set(key, tx);
                        }
                        setTransactions(Array.from(next.values()));
                        setNotice("Đã gắn dữ liệu tổng hợp vào tháng đang chọn.");
                        setLoading(false);
                        return;
                    }

                    setNotice("⚠️ File không đúng định dạng. Cần 'Sổ giao dịch.csv' hoặc file tổng hợp 'Khoản thu/chi'.");
                    setLoading(false);
                } catch (e) {
                    setNotice("⚠️ Lỗi xử lý CSV.");
                    setLoading(false);
                }
            },
            error: () => {
                setNotice("⚠️ Lỗi đọc CSV.");
                setLoading(false);
            },
        });
    }, []); // No dependencies to prevent infinite loop

    return { transactions, importCsv, notice, loading };
}
