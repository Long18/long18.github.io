// Script to update budget caps based on user's current budget plan
// Run this in browser console on the budget page

const budgetData = {
  "2024-01": {
    "Gold": 3000000,
    "Breakfast": 1000000,
    "Lunch": 800000,
    "Dinner": 1000000,
    "Milk tea": 700000,
    "Coffee": 875000,
    "Netflix": 260000,
    "Apple Music": 99000,
    "Rent": 3900000,
    "Electricity": 120000,
    "Water": 50000,
    "Internet": 100000,
    "Grab Car": 400000,
    "Grab Shipping": 200000,
    "Fuel": 500000,
    "Parking (fixed)": 100000,
    "Parking": 50000,
    "Services": 3000000,
    "Shopee": 1000000,
    "Tiktok": 1000000,
    "Laundry": 250000,
    "Apple Store": 500000,
    "Haircut": 100000,
    "Dental Care": 2000000,
    "Fashion": 500000
  }
};

// Function to update budget caps
function updateBudgets() {
  const selectedMonth = "2024-01";

  // Access the Zustand store
  const store = window.useCapsStore?.getState();
  if (!store) {
    console.error("Caps store not found. Make sure you're on the budget page.");
    return;
  }

  const { setCap } = store;

  // Update each budget cap
  Object.entries(budgetData[selectedMonth]).forEach(([category, amount]) => {
    setCap(selectedMonth, category, amount);
    console.log(`Updated ${category}: ${amount.toLocaleString()} VND`);
  });

  console.log("✅ All budgets updated successfully!");
  console.log("Total budget amount:", Object.values(budgetData[selectedMonth]).reduce((sum, amount) => sum + amount, 0).toLocaleString(), "VND");
}

// Run the update
updateBudgets();
