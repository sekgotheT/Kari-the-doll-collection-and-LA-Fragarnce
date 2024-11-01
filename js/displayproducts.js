document.addEventListener('DOMContentLoaded', async () => {
    const productContainer = document.querySelector('.product-container'); // Ensure a container in HTML

    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
            `;
            productContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
});
