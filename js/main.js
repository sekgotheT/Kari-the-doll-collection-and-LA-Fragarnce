// main.js

// Fetch and display products
async function fetchProducts() {
    try {
        const response = await fetch('/getProducts');
        if (!response.ok) throw new Error("Failed to fetch products");

        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Render products on the page
function renderProducts(products) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productImage = product.image || 'default-image-path.jpg'; // Fallback image if none provided
        const productCard = `
            <div class="product">
                <img src="${productImage}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });

    addCartEventListeners();
    addImageClickListeners();
}

// Cart array to hold items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update the cart count display
function updateCartCount() {
    document.getElementById('cart-count').innerText = cart.length;
}

// Add event listeners to Add to Cart buttons
function addCartEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add item to cart
function addToCart(event) {
    const productElement = event.target.closest('.product');
    const productName = productElement.querySelector('h3').innerText;
    const productPrice = parseFloat(productElement.querySelector('p').innerText.replace('$', ''));
    const productImage = productElement.querySelector('img').src;

    const productInCart = cart.find(item => item.name === productName);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1, image: productImage });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${productName} has been added to your cart!`);
}

// Display cart items in a modal
function showCartItems() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItem = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name} (x${item.quantity})</h3>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    <button onclick="removeFromCart('${item.name}')">Remove</button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItem;
        });
        cartItemsContainer.innerHTML += `<p>Total: $${total.toFixed(2)}</p>`;
    }
    cartModal.style.display = 'block';
}

// Remove item from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCartItems();
}

// Add click event listener to cart button
document.getElementById('cart-button').addEventListener('click', showCartItems);

// Close cart modal on outside click
window.onclick = function (event) {
    const cartModal = document.getElementById('cart-modal');
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
};

// Display image modal on click
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.querySelector('.modal-close');

function addImageClickListeners() {
    document.querySelectorAll('.product img').forEach(image => {
        image.addEventListener('click', () => {
            modalImage.src = image.src;
            modal.style.display = "block";
        });
    });
}

// Close image modal
modalClose.addEventListener('click', () => {
    modal.style.display = "none";
});

// Handle payment form submission
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
    paymentForm.addEventListener('submit', async event => {
        event.preventDefault();
        try {
            const formData = new FormData(paymentForm);
            const paymentDetails = Object.fromEntries(formData);

            const response = await fetch('/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentDetails)
            });

            const data = await response.json();
            if (data.success) {
                alert(data.message);
                window.location.href = 'thankyou.html';
            } else {
                alert('Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Handle product upload form submission
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
    uploadForm.addEventListener('submit', async event => {
        event.preventDefault();

        const formData = new FormData(uploadForm);
        try {
            const response = await fetch('/uploadProduct', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();
            document.getElementById('uploadStatus').textContent = result;

            if (response.ok) {
                alert('Product uploaded successfully!');
                uploadForm.reset();
                fetchProducts(); // Refresh product list after upload
            } else {
                alert('Failed to upload product');
            }
        } catch (error) {
            console.error('Error uploading product:', error);
            alert('Error uploading product');
        }
    });
}

// Initial function calls
fetchProducts();
updateCartCount();
