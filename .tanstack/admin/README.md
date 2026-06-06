# 🎨 Astro Services Admin Panel

Welcome to your product management system!

## 🚀 Getting Started

This admin panel allows you to easily manage your products without touching any code.

### Access
Open `admin/index.html` in your browser

### Features
- ➕ Add new products
- ✏️ Edit existing products
- 🗑️ Delete products
- 📦 Manage stock
- 🏷️ Add badges

## 📝 Quick Guide

### Adding a Product

1. **Upload Image First**
   - Go to `/images` folder
   - Upload your product image
   - Note the filename

2. **Fill the Form**
   - Product ID: `product-name` (lowercase-with-hyphens)
   - Name: `Product Name`
   - Description: Brief description
   - Price: Amount in Naira (no commas)
   - Category: Select from dropdown
   - Platform: For smartphones only
   - Badge: Optional (hot/new/pro)
   - Image: `images/your-image.jpg`
   - In Stock: Check if available

3. **Save**
   - Click "Add Product"
   - Download the new `products.json`
   - Replace old file in root folder
   - Commit and push to deploy

## 🎯 Categories

- **Smartphones**: Android or iOS devices
- **Laptops**: All laptop computers
- **Audio**: Headphones, earbuds, speakers
- **Accessories**: Cases, chargers, watches, etc.

## 🏷️ Badges

- **hot** 🔥 - Best sellers (red gradient)
- **new** ✨ - New arrivals (green gradient)
- **pro** 💎 - Premium products (purple gradient)

## 📸 Image Guidelines

- **Size**: 800x800px or larger
- **Format**: JPG or PNG
- **File Size**: Under 500KB
- **Path**: `images/product-name.jpg`

## 🔄 Workflow

```
1. Upload image → /images
2. Open admin panel
3. Fill form
4. Add product
5. Download products.json
6. Replace old file
7. Deploy
```

## 🔒 Security

⚠️ **Important**: This admin panel has no password protection!

For production:
- Add authentication
- Don't link from main site
- Share URL only with trusted people

## 📚 Documentation

- `../SETUP-ADMIN.md` - Complete setup guide
- `../README-ADMIN.md` - Detailed instructions
- `../QUICK-ADMIN-GUIDE.txt` - Quick reference
- `../ADMIN-CHECKLIST.md` - Step-by-step tasks

## 🆘 Troubleshooting

### Products not showing?
- Check `products.json` is in root folder
- Open browser console (F12)
- Verify JSON syntax

### Images not loading?
- Check image path is correct
- Verify image exists in `/images`
- Try different format

## 💡 Tips

1. Always backup `products.json` before major changes
2. Test locally before deploying
3. Use consistent naming for IDs
4. Compress images before uploading
5. Keep descriptions brief and clear

## 🎉 Happy Managing!

Your admin panel is ready to use. Start adding products and watch your store grow!

---

**Version**: 1.0
**Last Updated**: November 19, 2024
