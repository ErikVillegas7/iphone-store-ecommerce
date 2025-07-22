import React, { useState } from 'react';
import './App.css';

const products = [
  { id: '1', name: 'iPhone 15 Pro Max', price: 1199, img: 'https://maximstore.com/_next/image?url=https%3A%2F%2Fback.maximstore.com%2Fstatic%2Fimages%2F847a1fd7-1396-46fc-88e6-87858142e281.png&w=3840&q=75' },
  { id: '2', name: 'iPhone 15 Pro', price: 999, img: 'https://cdn-ipoint.waugi.com.ar/26709-large_default/iphone-15-pro-128gb.jpg' },
  { id: '3', name: 'iPhone 15', price: 799, img: 'https://exitocol.vtexassets.com/arquivos/ids/22695882/iphone-15-128gb-nuevo-negro.jpg?v=638697002090670000' },
  { id: '4', name: 'iPhone 14 Pro', price: 899, img: 'https://laplatacells.com.ar/img/Public/1169/62057-producto-iphone-14-pro-space-black-pdp-image-position-1a-mxla.jpg' },
  { id: '5', name: 'iPhone 14', price: 699, img: 'https://www.istore.com.tn/6648-medium_default/iphone-14-plus-128-go-couleur-midnight.jpg' },
  { id: '6', name: 'iPhone 13', price: 599, img: 'https://www.sagitariodigital.com.ar/wp-content/uploads/2021/09/IPHONE-13-4.jpg' },
];

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'cart', 'checkout', 'invoice'
  const [showCartModal, setShowCartModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Argentina',
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const categories = ['iPhone 15', 'iPhone 14', 'iPhone 13'];

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (category === 'all') {
        return ['all'];
      }
      
      const withoutAll = prev.filter(cat => cat !== 'all');
      
      if (withoutAll.includes(category)) {
        const newCategories = withoutAll.filter(cat => cat !== category);
        return newCategories.length === 0 ? ['all'] : newCategories;
      } else {
        return [...withoutAll, category];
      }
    });
  };

  // Función para calcular similitud entre strings (fuzzy search)
  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Si hay coincidencia exacta
    if (s1.includes(s2)) return 1;
    
    // Extraer números del search term
    const searchNumbers = s2.match(/\d+/g) || [];
    const productNumbers = s1.match(/\d+/g) || [];
    
    // Si hay números en la búsqueda, deben coincidir exactamente
    if (searchNumbers.length > 0) {
      const hasMatchingNumber = searchNumbers.some(num => 
        productNumbers.includes(num)
      );
      if (!hasMatchingNumber) return 0; // Si no coincide el número, descarta
    }
    
    // Calcular coincidencias de caracteres
    let matches = 0;
    const used = new Array(s1.length).fill(false);
    
    for (let i = 0; i < s2.length; i++) {
      for (let j = 0; j < s1.length; j++) {
        if (!used[j] && s1[j] === s2[i]) {
          matches++;
          used[j] = true;
          break;
        }
      }
    }
    
    // Calcular score basado en coincidencias y longitud
    return matches / Math.max(s1.length, s2.length);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.includes('all') || 
                           selectedCategories.some(cat => product.name.includes(cat));
    
    if (searchTerm === '') return matchesCategory;
    
    // Búsqueda exacta primero
    const exactMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (exactMatch) return matchesCategory;
    
    // Búsqueda fuzzy para errores de tipeo
    const similarity = calculateSimilarity(product.name, searchTerm);
    const fuzzyMatch = similarity > 0.6; // 60% de similitud mínima
    
    return matchesCategory && fuzzyMatch;
  });

  const hasActiveFilters = !selectedCategories.includes('all') || searchTerm !== '';

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const taxRate = 0.21; // IVA 21%
  const taxAmount = cartTotal * taxRate;
  const finalTotal = cartTotal + taxAmount;

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !billingInfo[field]);
    
    if (missingFields.length > 0) {
      alert(`Por favor completa: ${missingFields.join(', ')}`);
      return;
    }
    
    // Generar número de factura
    const invoiceNumber = 'INV-' + Date.now();
    const invoiceDate = new Date().toLocaleDateString('es-AR');
    
    // Crear datos de factura
    const invoice = {
      number: invoiceNumber,
      date: invoiceDate,
      customer: billingInfo,
      items: cartItems,
      subtotal: cartTotal,
      tax: taxAmount,
      total: finalTotal
    };
    
    setInvoiceData(invoice);
    setCurrentPage('invoice');
    setCartItems([]); // Limpiar carrito
  };

  const handleInputChange = (field, value) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // CHECKOUT PAGE
  if (currentPage === 'checkout') {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 onClick={() => setCurrentPage('home')} style={{cursor: 'pointer'}}>iStore</h1>
            <button 
              className="back-btn-header"
              onClick={() => setCurrentPage('home')}
            >
              ← Volver a la tienda
            </button>
          </div>
        </header>
        
        <div className="checkout-page">
          <div className="checkout-container">
            <div className="checkout-left">
              <h2>Información de Facturación</h2>
              <form onSubmit={handleBillingSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input 
                      type="text"
                      value={billingInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido *</label>
                    <input 
                      type="text"
                      value={billingInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input 
                      type="tel"
                      value={billingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Dirección *</label>
                  <input 
                    type="text"
                    value={billingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Ciudad *</label>
                    <input 
                      type="text"
                      value={billingInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Código Postal</label>
                    <input 
                      type="text"
                      value={billingInfo.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Método de Pago</label>
                  <select 
                    value={billingInfo.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  >
                    <option value="credit-card">Tarjeta de Crédito</option>
                    <option value="debit-card">Tarjeta de Débito</option>
                    <option value="transfer">Transferencia Bancaria</option>
                    <option value="cash">Efectivo</option>
                  </select>
                </div>
                
                {(billingInfo.paymentMethod === 'credit-card' || billingInfo.paymentMethod === 'debit-card') && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>Número de Tarjeta</label>
                      <input 
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={billingInfo.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Vencimiento</label>
                        <input 
                          type="text"
                          placeholder="MM/AA"
                          value={billingInfo.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input 
                          type="text"
                          placeholder="123"
                          value={billingInfo.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <button type="submit" className="complete-order-btn">
                  Completar Pedido - ${finalTotal.toFixed(2)}
                </button>
              </form>
            </div>
            
            <div className="checkout-right">
              <h2>Resumen del Pedido</h2>
              <div className="order-summary">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.img} alt={item.name} className="order-item-image" />
                    <div className="order-item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                
                <div className="order-totals">
                  <div className="total-line">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="total-line">
                    <span>IVA (21%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="total-line final-total">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // INVOICE PAGE
  if (currentPage === 'invoice') {
    return (
      <div className="app invoice-page">
        <div className="invoice-actions-top no-print">
          <button 
            className="back-btn"
            onClick={() => setCurrentPage('home')}
          >
            ← Nueva Compra
          </button>
          <button 
            className="print-btn"
            onClick={() => window.print()}
          >
            🖨️ Imprimir Comprobante
          </button>
        </div>
        
        <div className="invoice-container">
          <div className="invoice-header">
            <div className="company-info">
              <h1>iStore</h1>
              <p>Tu tienda de confianza para productos Apple</p>
              <p>Buenos Aires, Argentina</p>
              <p>CUIT: 20-12345678-9</p>
            </div>
            <div className="invoice-details">
              <h2>FACTURA</h2>
              <p><strong>N°:</strong> {invoiceData?.number}</p>
              <p><strong>Fecha:</strong> {invoiceData?.date}</p>
            </div>
          </div>
          
          <div className="customer-info">
            <h3>Datos del Cliente</h3>
            <p><strong>Nombre:</strong> {invoiceData?.customer.firstName} {invoiceData?.customer.lastName}</p>
            <p><strong>Email:</strong> {invoiceData?.customer.email}</p>
            <p><strong>Teléfono:</strong> {invoiceData?.customer.phone}</p>
            <p><strong>Dirección:</strong> {invoiceData?.customer.address}, {invoiceData?.customer.city}</p>
            <p><strong>Método de Pago:</strong> {
              invoiceData?.customer.paymentMethod === 'credit-card' ? 'Tarjeta de Crédito' : 
              invoiceData?.customer.paymentMethod === 'debit-card' ? 'Tarjeta de Débito' :
              invoiceData?.customer.paymentMethod === 'transfer' ? 'Transferencia' : 'Efectivo'
            }</p>
          </div>
          
          <div className="invoice-items">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData?.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="invoice-totals">
            <div className="totals-row">
              <span>Subtotal:</span>
              <span>${invoiceData?.subtotal.toFixed(2)}</span>
            </div>
            <div className="totals-row">
              <span>IVA (21%):</span>
              <span>${invoiceData?.tax.toFixed(2)}</span>
            </div>
            <div className="totals-row final">
              <span><strong>Total:</strong></span>
              <span><strong>${invoiceData?.total.toFixed(2)}</strong></span>
            </div>
          </div>
          
          <div className="invoice-footer">
            <p>Gracias por su compra. Esta factura es válida como comprobante de pago.</p>
            <p>Para consultas: info@istore.com | +54 11 1234-5678</p>
          </div>
        </div>
      </div>
    );
  }

  // HOME PAGE (Default)
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>iStore</h1>
          <div className="header-actions">
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="cart-icon" onClick={() => setShowCartModal(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 10H3m4 3v6a1 1 0 001 1h8a1 1 0 001-1v-6M9 19v2m6-2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </div>
          </div>
        </div>
      </header>

      <div className="hero-section">
        <div className="hero-content">
          <h2>Los mejores iPhones al mejor precio</h2>
          <p>Descubre nuestra selección premium de dispositivos Apple</p>
          <button className="hero-cta">Ver Ofertas</button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-header">
          <button 
            className={`filters-toggle ${hasActiveFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Filtros
          </button>
        </div>
        
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <h4>Categorías</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes('all')}
                    onChange={() => toggleCategory('all')}
                  />
                  <span>Todos</span>
                </label>
                {categories.map(category => (
                  <label key={category} className="filter-option">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="products-section">
        <div className="section-header">
          <h2 className="section-title">Productos ({filteredProducts.length})</h2>
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setSelectedCategories(['all']);
              setSearchTerm('');
            }}
          >
            Limpiar filtros
          </button>
        </div>
        <div className="products-grid">
          {filteredProducts.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-image-container">
                <img src={item.img} alt={item.name} className="product-image" />
              </div>
              <div className="product-content">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-price">${item.price}</p>
                <p className="product-features">• 128GB • Desbloqueado • Garantía 1 año</p>
              </div>
              <div className="product-actions">
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(item)}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cartItemCount > 0 && (
        <div className="cart-summary">
          <div className="cart-summary-content">
            <div className="cart-info">
              <span>{cartItemCount} productos en el carrito</span>
              <span className="cart-total">Total: ${cartTotal}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => setCurrentPage('checkout')}
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="modal-overlay">
          <div className="cart-modal">
            <div className="modal-header">
              <h2>Carrito de Compras</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCartModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Tu carrito está vacío</p>
                  <button 
                    className="continue-shopping-btn"
                    onClick={() => setShowCartModal(false)}
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <img src={item.img} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-details">
                          <h4>{item.name}</h4>
                          <p className="cart-item-price">${item.price}</p>
                        </div>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                          <button 
                            className="remove-btn"
                            onClick={() => removeFromCart(item.id)}
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="cart-item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-summary-modal">
                    <div className="cart-totals">
                      <div className="total-line">
                        <span>Subtotal:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="total-line">
                        <span>IVA (21%):</span>
                        <span>${taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="total-line final-total">
                        <span>Total:</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="cart-actions">
                      <button 
                        className="continue-shopping-btn"
                        onClick={() => setShowCartModal(false)}
                      >
                        Continuar Comprando
                      </button>
                      <button 
                        className="checkout-btn"
                        onClick={() => {
                          setShowCartModal(false);
                          setCurrentPage('checkout');
                        }}
                      >
                        Finalizar Compra
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>iStore</h4>
            <p>Tu tienda de confianza para productos Apple</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Productos</a></li>
              <li><a href="#">Soporte</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>📧 info@istore.com</p>
            <p>📞 +54 11 1234-5678</p>
            <p>📍 Buenos Aires, Argentina</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 iStore. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}