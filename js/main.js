// Fetch and display products
async function fetchProducts() {
    try {
        const response = await fetch('/getProducts');
        if (!response.ok) throw new Error("Failed to fetch products");

        const products = await response.json();
        const productContainer = document.getElementById('productContainer');
        productContainer.innerHTML = '';

        products.forEach(product => {
            // Ensure the image URL is valid
            const productImage = product.image ? product.image : 'default-image-path.jpg'; // Fallback image if none provided
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

        // Add event listeners to the newly created Add to Cart buttons
        addCartEventListeners();
        // Add click event listeners to all product images after fetching them
        addImageClickListeners();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Cart array to hold items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the cart count display
function updateCartCount() {
    const cartCount = cart.length;
    document.getElementById('cart-count').innerText = cartCount;
}

// Function to add event listeners to Add to Cart buttons
function addCartEventListeners() {
    document.querySelectorAll('button.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const productElement = event.target.closest('.product');
            const productName = productElement.querySelector('h3').innerText;
            const productPrice = parseFloat(productElement.querySelector('p').innerText.replace('$', ''));
            const productImage = productElement.querySelector('img').src;

            // Add product to cart
            const productInCart = cart.find(item => item.name === productName);
            if (productInCart) {
                productInCart.quantity += 1; // Increment quantity if already in cart
            } else {
                cart.push({ name: productName, price: productPrice, quantity: 1, image: productImage });
            }

            localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
            updateCartCount(); // Update cart count
            alert(`${productName} has been added to your cart!`);
        });
    });
}

// Function to display cart items in a modal
function showCartItems() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity; // Calculate total
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
    cartModal.style.display = 'block'; // Show modal
}

// Function to remove items from the cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName); // Remove item from cart
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    updateCartCount(); // Update cart count
    showCartItems(); // Refresh displayed cart items
}

// Event listener for the cart button to show cart modal
document.getElementById('cart-button').addEventListener('click', showCartItems);

// Close modal when clicking outside of it
window.onclick = function (event) {
    const cartModal = document.getElementById('cart-modal');
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
};

// JavaScript to handle image click and display modal
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.querySelector('.modal-close');

// Function to add click event listeners to all product images
function addImageClickListeners() {
    const images = document.querySelectorAll('.product img');
    images.forEach(image => {
        image.addEventListener('click', () => {
            modalImage.src = image.src;
            modal.style.display = "block";
        });
    });
}

// Function to close the modal
function closeModal() {
    modal.style.display = "none";
}

// Event listener to close the modal when clicking the close button
modalClose.addEventListener('click', closeModal);

// Upload product form submission handler
document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('image', document.getElementById('image').files[0]);

    try {
        const response = await fetch('/uploadProduct', {
            method: 'POST',
            body: formData
        });

        const result = await response.text();
        document.getElementById('uploadStatus').textContent = result;

        if (response.ok) {
            alert('Product uploaded successfully!');
            document.getElementById('uploadForm').reset();
            // Refresh the products list after a successful upload
            fetchProducts();
        } else {
            alert('Failed to upload product');
        }
    } catch (error) {
        console.error('Error uploading product:', error);
        alert('Error uploading product');
    }
});

// Initial function calls
fetchProducts();
updateCartCount();
