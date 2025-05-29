#!/bin/bash

# Quick EmailJS Setup Script
echo "🚀 EmailJS Quick Setup for Contact Form"
echo "========================================"
echo ""

echo "Để setup EmailJS, bạn cần:"
echo "1. Service ID (từ EmailJS dashboard)"
echo "2. Template ID (từ EmailJS dashboard)" 
echo "3. Public Key (từ EmailJS account settings)"
echo ""

read -p "Nhập Service ID: " service_id
read -p "Nhập Template ID: " template_id  
read -p "Nhập Public Key: " public_key

echo ""
echo "Đang tạo file .env.local..."

cat > .env.local << EOL
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=$service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=$template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=$public_key
EOL

echo "✅ Đã tạo .env.local với cấu hình EmailJS"
echo ""
echo "🔄 Vui lòng restart development server:"
echo "npm run dev"
echo ""
echo "📖 Hướng dẫn chi tiết: docs/EMAILJS_SETUP.md"
