let cartContainer = document.getElementById('cartContainer');
let orderSummary = document.getElementById('orderSummary');
let cartCount = document.getElementById('cartCount');
let emptyCartContainer = document.getElementById('emptyCartContainer');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
    cartContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach((product, index) => {
        let item = document.createElement("div");
        item.className = "cart-item";
        item.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div>
                <h3>${product.title.slice(0, 26)}...</h3>
                <p>Price: $${product.price.toFixed(2)}</p>
            </div>
            <div>
                <button onclick="decrementQuantity(${index})">-</button>
                <span>${product.quantity}</span>
                <button onclick="incrementQuantity(${index})">+</button>
            </div>
            <button onclick="removeItem(${index})">Remove</button>
        `;

        cartContainer.appendChild(item);
        subtotal += product.price * product.quantity;
    });

    cartCount.textContent = cart.length;

    // **Pass subtotal to updateOrderSummary()**
    updateOrderSummary(subtotal);

    clearCartButton = document.createElement("button");
    clearCartButton.textContent = "Clear Cart";
    clearCartButton.style.backgroundColor = "red";
    clearCartButton.style.color = "white";
    clearCartButton.style.padding = "10px 20px";
    clearCartButton.style.border = "none";
    clearCartButton.style.borderRadius = "5px";
    clearCartButton.style.cursor = "pointer";
    clearCartButton.style.marginTop = "20px";
    clearCartButton.onclick = function () {
        clearCart();
    };
    cartContainer.appendChild(clearCartButton);

    localStorage.setItem("cart", JSON.stringify(cart));

    if (cart.length === 0) {
        cartContainer.style.display = "none";
        orderSummary.style.display = "none";
        emptyCartContainer.style.display = "block";
    } else {
        cartContainer.style.display = "block";
        orderSummary.style.display = "block";
        emptyCartContainer.style.display = "none";
    }
}


function incrementQuantity(index) {
    cart[index].quantity += 1;
    updateCart();
}

function decrementQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        updateCart();
    } else {
        removeItem(index);
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    cart = [];
    updateCart();
}
function updateOrderSummary(subtotal) {
    orderSummary.innerHTML = `
        <div style="
            background-color: #fdfdfd;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            text-align: center;
            width: 90%;
        ">
            <h2 style="margin-bottom: 10px;">Order Summary</h2>
            <div style="text-align: left; padding: 10px 15px;">
                ${cart.map(product => `
                    <p style="font-size: 16px;">
                        <strong>${product.title.slice(0, 12)}</strong>  
                        - ${product.quantity} × $${product.price.toFixed(2)}  
                        = <span style="color: #007bff;">$${(product.price * product.quantity).toFixed(2)}</span>
                    </p>
                `).join("")}
            </div>
            <hr>
            <p style="font-size: 18px; font-weight: bold;">Subtotal: $${subtotal.toFixed(2)}</p>
            <p>Taxes (10%): $${(subtotal * 0.1).toFixed(2)}</p>
            <p>Shipping: $5.00</p>
            <p style="font-size: 20px; font-weight: bold;">Grand Total:  
                <span style="color: darkred;">$${(subtotal * 1.1 + 5).toFixed(2)}</span>
            </p>
            <button class="checkout-btn" onclick="alert('Proceeding to checkout...')">Checkout</button>
        </div>
    `;
}
updateCart();
// Initial call to updateOrderSummary with subtotal
let initialSubtotal = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
updateOrderSummary(initialSubtotal);
// Update order summary on page load
updateOrderSummary();