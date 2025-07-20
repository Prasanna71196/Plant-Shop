// Get cart array from localStorage (or empty array)
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

// Save cart array to localStorage and update badge count
function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart badge count on cart icon
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = total;
    countEl.style.display = total > 0 ? "inline-block" : "none";
  }
}

// Render cart popup items and buttons
function initCartPopup() {
  const cartIcon = document.getElementById("cart-icon");
  const cartDropdown = document.getElementById("cart-dropdown");
  const cartClose = document.querySelector(".cart-popup-close");
  const cartContent = document.getElementById("cart-popup-content");
  const cartTitle = document.getElementById("cart-popup-title");

  if (!cartDropdown || !cartIcon || !cartContent || !cartTitle) return;

  function renderCartPopup() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartTitle.textContent = `Shopping Cart (${total})`;

    let html = "";

    if (cart.length > 0) {
      cart.forEach((item) => {
        html += `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
              <p class="cart-item-title">${item.name}</p>
              <p class="cart-item-details">Rs. ${item.price} &nbsp; <span class="cart-item-qty">Qty: ${item.quantity}</span></p>
            </div>
          </div>
        `;
      });
    } else {
      html += `<p class="cart-empty">Your cart is currently empty</p>`;
    }
    // Buttons, recommendations appear always at bottom
    html += `
      <button class="cart-discount-btn"><i class="fa fa-gear"></i>Apply Discount At the Check Out</button>
      <button class="cart-no-savings-btn">No Savings on this order</button>
      <button class="cart-continue-btn">Continue Browsing</button>
      <div class="cart-recommended">
        <h3>Recommended Product</h3>
        <div class="cart-recommended-row" id="cart-reco-row"></div>
      </div>
    `;
    cartContent.innerHTML = html;

    // Recommended products data (adjust or load dynamically as needed)
    const recommendedProducts = [
      { id: "reco01", name: "Aglaonema Ice Plant", price: "280", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80", rating: 4.5 },
      { id: "reco02", name: "Areca Palm", price: "580", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80", rating: 4.5 }
    ];

    const recoRow = document.getElementById("cart-reco-row");
    if (recoRow) {
      recommendedProducts.forEach((p, idx) => {
        recoRow.innerHTML += `
          <div class="cart-reco-card" style="${idx === recommendedProducts.length - 1 ? 'border:none;' : ''}">
            <img src="${p.image}" class="cart-reco-img" alt="${p.name}">
            <div class="cart-reco-rating">★ ${p.rating}</div>
            <div class="cart-reco-title">${p.name}</div>
            <div class="cart-reco-price">Rs. ${p.price}</div>
          </div>
        `;
      });
    }
  }

  cartIcon.addEventListener("click", () => {
    const isShown = cartDropdown.style.display === "block";
    if (!isShown) renderCartPopup();
    cartDropdown.style.display = isShown ? "none" : "block";
  });

  cartClose?.addEventListener("click", () => {
    cartDropdown.style.display = "none";
  });

  document.addEventListener("click", (e) => {
    if (!cartDropdown.contains(e.target) && e.target.id !== "cart-icon") {
      cartDropdown.style.display = "none";
    }
  });
}

// Call updateCartCount on page load to show correct badge count immediately
document.addEventListener("DOMContentLoaded", updateCartCount);
