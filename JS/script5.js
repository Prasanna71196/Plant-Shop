fetch("Components/plant-categories.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("category-placeholder").innerHTML = data;
      });

fetch("Components/menu.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("menu-placeholder").innerHTML = data;
    });

 fetch("Components/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });  
    
    fetch("Components/cart-popup.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("cart-popup-placeholder").innerHTML = data;
    initCartPopup(); // Initialize the cart behavior after inserting
  });

// fetch("Components/header.html")
//     .then(res => res.text())
//     .then(data => {
//       document.getElementById("header-placeholder").innerHTML = data;
//     });  

    // Handle "Add to Basket" clicks
document.body.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-btn")) {
    const btn = e.target;

    const product = {
      id: btn.getAttribute("data-id"),
      name: btn.getAttribute("data-name"),
      price: parseFloat(btn.getAttribute("data-price").replace(/[^\d.]/g, '')),
      image: btn.getAttribute("data-img"),
      quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existsIndex = cart.findIndex(item => item.id === product.id);

    if (existsIndex !== -1) {
      cart[existsIndex].quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count if cart badge is available
    const countEl = document.getElementById("cart-count");
    if (countEl) {
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      countEl.textContent = total;
      countEl.style.display = 'inline-block';
    }

    alert(`${product.name} added to cart!`);
  }
});


let allProducts = [];

// Function to render the products into the given section
function renderProducts(products, sectionId) {
    const section = document.getElementById(sectionId);
    section.innerHTML = ''; // Clear previous content

    if (products.length === 0) {
        section.innerHTML = `<p>No products found.</p>`;
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${product.image}" alt="${product.name}">
                ${product.discount ? `<div class="discount-badge">${product.discount}</div>` : ''}
            </div>
            <div class="star-rating">
                <i class="fas fa-star"></i>
                <span class="rating-number">${product.rating}</span>
            </div>
            <div class="product-info">
                <p class="product-title">${product.name}</p>
                <p class="product-price">${product.price}</p>
            </div>
            <div class="button-wrapper">
                <button  class="add-btn"
          data-id="${product.id}"
          data-name="${product.name}"
          data-price="${product.price}"
          data-img="${product.image}">Add to Basket</button>
            </div>
        `;
        section.appendChild(card);
    });
}

// Filter elements
const priceFilter = document.getElementById("priceFilter");
const sizeFilter = document.getElementById("sizeFilter");
const sunlightFilter = document.getElementById("sunlightFilter");
const waterFilter = document.getElementById("waterFilter");

// Attach filter change events
priceFilter.addEventListener("change", applyFilters);
sizeFilter.addEventListener("change", applyFilters);
sunlightFilter.addEventListener("change", applyFilters);
waterFilter.addEventListener("change", applyFilters);

function applyFilters() {
    const priceValue = priceFilter.value;
    const sizeValue = sizeFilter.value.toLowerCase();
    const sunlightValue = sunlightFilter.value.toLowerCase();
    const waterValue = waterFilter.value.toLowerCase();

    const filtered = allProducts.filter(product => {
        const priceNumber = parseFloat(product.price.replace(/[^\d.]/g, ""));
const matchesPrice = !priceValue || priceNumber <= parseFloat(priceValue);

        const matchesSize = !sizeValue || product.size?.trim().toLowerCase() === sizeValue;
        const matchesSunlight = !sunlightValue || product.sunlight?.trim().toLowerCase() === sunlightValue;
        const matchesWater = !waterValue || product.water?.trim().toLowerCase() === waterValue;
        return matchesPrice && matchesSize && matchesSunlight && matchesWater;
    });

    renderProducts(filtered.slice(0, 8), 'first-section');

if (filtered.length > 8) {
    renderProducts(filtered.slice(8, 16), 'second-section');
    document.getElementById('second-section').style.display = 'grid';
} else {
    document.getElementById('second-section').style.display = 'none';
}

document.querySelector('.banner-section').style.display = 'none';

}



// Fetch and initialize
fetch('JSON/products5.json')
    .then(response => response.json())
    .then(products => {
        allProducts = products;

        // Show first 8 and next 8
        renderProducts(products.slice(0, 8), 'first-section');
        renderProducts(products.slice(8, 16), 'second-section');
    })
    .catch(error => {
        console.error('Error loading products:', error);
    });

// Load header layout
fetch("Components/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header-placeholder").innerHTML = data;
     updateCartCount(); 

    // Now the header is loaded. Attach the search input listener:
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();

        if (query) {
          const filtered = allProducts.filter(product =>
            product.name.toLowerCase().includes(query)
          );

          renderProducts(filtered, 'first-section');
          document.getElementById('second-section').style.display = 'none';
          document.querySelector('.banner-section').style.display = 'none';
        } else {
          renderProducts(allProducts.slice(0, 8), 'first-section');
          renderProducts(allProducts.slice(8, 16), 'second-section');
          document.getElementById('second-section').style.display = 'grid';
          document.querySelector('.banner-section').style.display = 'block';
        }
      });
    }
    // ✅ Now load the cart popup once header is loaded
    fetch("Components/cart-popup.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("cart-popup-placeholder").innerHTML = data;

        // ✅ Now the cart layout is in the DOM → Init popup
        initCartPopup();
      });
  });


  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

