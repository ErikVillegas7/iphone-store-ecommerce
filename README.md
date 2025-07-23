# 🛒 iPhone Store E-commerce

> Complete iPhone e-commerce store built with React featuring advanced search, shopping cart, checkout flow, and professional invoice generation.

![React](https://img.shields.io/badge/React-19.1.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![CSS3](https://img.shields.io/badge/CSS3-Grid%20%26%20Flexbox-blue)
![Responsive](https://img.shields.io/badge/Design-Responsive-green)

## ✨ Features

### 🔍 **Smart Search & Filtering**
- **Fuzzy Search Algorithm** - Finds products even with typos (e.g., "ipone 15" finds "iPhone 15")
- **Number Priority Search** - Searching "15" only shows iPhone 15 models
- **Multi-Category Filtering** - Select multiple categories simultaneously
- **Real-time Search** - Results update as you type

### 🛒 **Shopping Cart**
- **Interactive Cart Modal** - View and manage items without leaving the page
- **Quantity Controls** - Increase/decrease quantities with +/- buttons
- **Remove Items** - Delete products from cart with trash icon
- **Real-time Totals** - Automatic calculation of subtotal, tax (21% IVA), and total
- **Persistent Cart** - Cart contents maintained across page navigation

### 💳 **Checkout & Billing**
- **Dedicated Checkout Page** - Clean, professional checkout experience
- **Complete Billing Form** - Customer information, address, and payment details
- **Multiple Payment Methods** - Credit card, debit card, bank transfer, cash
- **Form Validation** - Required field validation with user-friendly messages
- **Order Summary** - Visual review of products with images and totals

### 🧾 **Professional Invoicing**
- **Auto-Generated Invoices** - Unique invoice numbers with timestamp
- **Complete Customer Data** - All billing information included
- **Itemized Product List** - Detailed table with quantities and prices
- **Tax Calculations** - Professional tax breakdown (21% IVA)
- **Print-Ready Format** - Optimized for printing with `@media print` styles
- **Professional Layout** - Company header, customer info, and footer

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Google Fonts Integration** - Modern Inter font family
- **SVG Icons** - Crisp, scalable icons for search, cart, and filters
- **Smooth Animations** - Hover effects, transitions, and micro-interactions
- **Background Images** - Hero section with iPhone imagery
- **Dark Theme Elements** - Professional black and white color scheme

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ErikVillegas7/iphone-store-ecommerce.git
   cd iphone-store-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📱 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm test` | Launches the test runner |
| `npm run build` | Builds the app for production |
| `npm run eject` | Ejects from Create React App (one-way operation) |

## 🏗️ Project Structure

```
iphone-store-ecommerce/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js          # Main application component with page routing
│   ├── App.css         # Complete styling for all components
│   └── index.js        # React entry point
├── package.json        # Project configuration and dependencies
└── README.md          # This file
```

## 🔧 Technical Implementation

### State Management
- **React Hooks** - useState for component state management
- **Cart State** - Persistent shopping cart across page navigation
- **Page Routing** - Simple state-based navigation system
- **Form State** - Controlled components for all user inputs

### Search Algorithm
```javascript
// Fuzzy search with typo tolerance
const calculateSimilarity = (productName, searchTerm) => {
  // Exact match check
  // Number priority matching
  // Character similarity calculation
  // Returns similarity score (0-1)
}
```

### Core Features
- **Product Filtering** - Multi-category selection with checkbox controls
- **Tax Calculations** - Automatic 21% IVA calculation
- **Invoice Generation** - Professional PDF-ready invoice format
- **Responsive Layout** - CSS Grid and Flexbox for all screen sizes

## 📋 Product Data Structure

```javascript
const product = {
  id: '1',
  name: 'iPhone 15 Pro Max',
  price: 1199,
  img: 'https://example.com/image.jpg'
}
```

## 🎯 Key Components

### HomePage
- Product catalog with grid layout
- Search and filter controls
- Hero section with call-to-action
- Shopping cart summary

### CheckoutPage
- Two-column layout (billing form + order summary)
- Payment method selection
- Form validation
- Order review with product images

### InvoicePage
- Professional invoice layout
- Print-optimized styling
- Company and customer information
- Itemized product table

## 🌐 Browser Support

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)

## 📱 Mobile Responsiveness

- **Breakpoint**: 768px
- **Mobile Features**:
  - Single-column checkout layout
  - Stacked cart items
  - Touch-friendly buttons
  - Optimized forms

## 🔮 Future Enhancements

- [ ] User authentication and accounts
- [ ] Real payment gateway integration (Stripe/PayPal)
- [ ] Product inventory management
- [ ] Order tracking system
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Wishlist functionality

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Erik Villegas**
- GitHub: [@ErikVillegas7](https://github.com/ErikVillegas7)

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Icons from custom SVG designs
- Fonts from [Google Fonts](https://fonts.google.com/)
- Created with assistance from [Claude Code](https://claude.ai/code)

---

⭐ **Star this repository if you found it helpful!**