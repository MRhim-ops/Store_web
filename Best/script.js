const menuToggle = document.getElementById('menu-toggle');
const closeNav = document.getElementById('close-nav');
const mainNav = document.getElementById('main-nav');
const cartIcon = document.getElementById('cart-icon');
const closeCart = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const productsGrid = document.getElementById('products-grid');
const loadingSpinner = document.getElementById('loading-spinner');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const productModal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');
const modalProductContent = document.getElementById('modal-product-content');
const categoryCards = document.querySelectorAll('.category-card');
const newsletterForm = document.getElementById('newsletter-form');
const notificationContainer = document.getElementById('notification-container');
const body = document.querySelector('body');

function ondark() {
  body.classList.add('dark-theme');
  localStorage.setItem('theme', 'dark');
  console.log('Dark mode activated');
}

function offdark() {
  body.classList.remove('dark-theme');
  localStorage.setItem('theme', 'light');
  console.log('Light mode activated');
}

function al() {
  const savedata = localStorage.getItem('theme');
  if (savedata === 'dark') {
    console.log('Dark mode is saved');
    ondark();
  } else {
    console.log('Light mode is saved');
    offdark();
  }
}

// Call the al function to check the current theme on page load
al();




let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedCategory = 'all';
let sortBy = 'default';
let searchQuery = '';


document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  updateCartUI();


  menuToggle.addEventListener('click', toggleNav);
  closeNav.addEventListener('click', closeNavMenu);


  cartIcon.addEventListener('click', toggleCart);
  closeCart.addEventListener('click', closeCartSidebar);


  overlay.addEventListener('click', closeAllOverlays);


  closeModal.addEventListener('click', closeProductModal);


  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });


  categoryFilter.addEventListener('change', handleCategoryFilter);
  sortFilter.addEventListener('change', handleSortFilter);


  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      categoryFilter.value = category;
      handleCategoryFilter();


      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });


  checkoutBtn.addEventListener('click', handleCheckout);


  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
});


async function fetchProducts() {
  try {
    showLoading();
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    products = await response.json();
    filterAndRenderProducts();
  } catch (error) {
    showNotification('Error loading products. Please try again.', 'error');
    console.error('Error fetching products:', error);
  } finally {
    hideLoading();
  }
}

function filterAndRenderProducts() {
  let filteredProducts = [...products];


  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }


  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }


  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      filteredProducts.sort((a, b) => a.id - b.id);
  }

  renderProducts(filteredProducts);
}

function renderProducts(productsToRender) {
  if (!productsGrid) return;

  if (productsToRender.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products">
        <p>No products found. Try Search again.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = productsToRender.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-details">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-actions">
          <button class="view-product-btn" data-id="${product.id}"><i class="ri-eye-line"> View Details</i></button>
          <button class="add-to-cart-btn-small" data-id="${product.id}"><i class="ri-shopping-cart-2-fill"> Add to Cart</i></button>
        </div>
      </div>
    </div>
  `).join('');


  document.querySelectorAll('.view-product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.id);
      openProductModal(productId);
    });
  });

  document.querySelectorAll('.add-to-cart-btn-small').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = parseInt(btn.dataset.id);
      addToCart(productId);
    });
  });
}

function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const stars = Array(5).fill('').map((_, i) => {
    return i < Math.round(product.rating.rate)
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
  }).join('');

  modalProductContent.innerHTML = `
    <div class="modal-product-image">
      <img src="${product.image}" alt="${product.title}">
    </div>
    <div class="modal-product-details">
      <h2 class="modal-product-title">${product.title}</h2>
      <span class="modal-product-category">${product.category}</span>
      <div class="modal-product-price">$${product.price.toFixed(2)}</div>
      <p class="modal-product-description">${product.description}</p>
      <div class="modal-product-rating">
        <div class="stars">${stars}</div>
        <span class="rating-count">(${product.rating.count} reviews)</span>
      </div>
      <button class="add-to-cart-btn" data-id="${product.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        Add to Cart
      </button>
    </div>
  `;


  const addToCartBtn = modalProductContent.querySelector('.add-to-cart-btn');
  addToCartBtn.addEventListener('click', () => {
    addToCart(productId);
  });

  productModal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  productModal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  showNotification(`${product.title} added to cart!`, 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateCartQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;


  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <p>Your cart is empty</p>
        <button class="continue-shopping" id="continue-shopping">Continue Shopping</button>
      </div>
    `;

    const continueShoppingBtn = document.getElementById('continue-shopping');
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', closeCartSidebar);
    }
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.title}</h3>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
        </button>
      </div>
    `).join('');


    document.querySelectorAll('.decrease-quantity').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.id);
        updateCartQuantity(productId, -1);
      });
    });

    document.querySelectorAll('.increase-quantity').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.id);
        updateCartQuantity(productId, 1);
      });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.id);
        removeFromCart(productId);
      });
    });
  }


  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function toggleNav() {
  mainNav.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeNavMenu() {
  mainNav.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleCart() {
  cartSidebar.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
  cartSidebar.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function closeAllOverlays() {
  closeNavMenu();
  closeCartSidebar();
  closeProductModal();
}

function handleSearch() {
  searchQuery = searchInput.value.trim();
  filterAndRenderProducts();
}

function handleCategoryFilter() {
  selectedCategory = categoryFilter.value;
  filterAndRenderProducts();
}

function handleSortFilter() {
  sortBy = sortFilter.value;
  filterAndRenderProducts();
}

function handleCheckout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty!', 'error');
    return;
  }


  showNotification('Proceeding to checkout...', 'success');


  setTimeout(() => {
    cart = [];
    saveCart();
    updateCartUI();
    closeCartSidebar();
    showNotification('Thank you for your purchase!', 'success');
  }, 2000);
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const emailInput = e.target.querySelector('input[type="email"]');
  const email = emailInput.value.trim();

  if (email) {
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    emailInput.value = '';
  }
}

function showLoading() {
  if (loadingSpinner) {
    loadingSpinner.style.display = 'flex';
  }
}

function hideLoading() {
  if (loadingSpinner) {
    loadingSpinner.style.display = 'none';
  }
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="message">${message}</div>
    <button class="notification-close">×</button>
  `;

  notificationContainer.appendChild(notification);


  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      notification.remove();
    }, 300);
  });


  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 5000);
}

let localemile = JSON.parse(localStorage.getItem('localemile')) || [];
let account = document.getElementById('account')
account.innerHTML = '';



localemile.forEach(email => {
  let userName = email.split('@')[0];

  account.innerHTML += `${userName}`;

  account.addEventListener('click', function () {
    if (account.innerHTML === `${userName}`) {
      window.open('accinfo.html')
      window.close('index.html')
    }

  })


});

if (!account.innerHTML) {
  window.close('index.html')
  window.open('signinup.html')
}