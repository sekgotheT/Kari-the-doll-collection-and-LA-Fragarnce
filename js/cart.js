// cart.js

// Retrieve the cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity; // Calculate total price
            const cartItem = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)} (x <input type="number" class="quantity" value="${item.quantity}" min="1" data-name="${item.name}"></p>
                    <button class="remove">Remove</button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItem;
        });
        cartItemsContainer.innerHTML += `<p>Total: $${total.toFixed(2)}</p>`;
    }
    addEventListeners(); // Re-add event listeners for buttons and quantity inputs
}

// Function to update cart item quantities
const updateCartQuantity = (itemName, quantity) => {
    const item = cart.find(product => product.name === itemName);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
        renderCartItems(); // Re-render cart items to reflect changes
    }
};

// Function to remove an item from the cart
const removeFromCart = (itemName) => {
    cart = cart.filter(item => item.name !== itemName); // Remove item from cart
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    renderCartItems(); // Re-render cart items
    alert('Item removed from the cart');
};

// Add event listeners to quantity inputs and remove buttons
const addEventListeners = () => {
    document.querySelectorAll('button.remove').forEach(button => {
        button.addEventListener('click', event => {
            const itemName = event.target.closest('.cart-item').querySelector('h3').innerText;
            removeFromCart(itemName);
        });
    });

    document.querySelectorAll('.quantity').forEach(input => {
        input.addEventListener('change', event => {
            const itemName = event.target.getAttribute('data-name');
            const newQuantity = parseInt(event.target.value);
            if (newQuantity < 1) {
                alert('Quantity must be at least 1');
                event.target.value = 1; // Reset to 1 if invalid input
            } else {
                updateCartQuantity(itemName, newQuantity);
            }
        });
    });
};

// Initial rendering of cart items on page load
renderCartItems();
