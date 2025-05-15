let productContainer = document.getElementById("product-container");
        let buttons = document.querySelectorAll(".productsBtn");
        let cartCount = document.getElementById("cartCount");
        let allProducts = []; // Store all products for easy filtering
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length; // Update cart count on page load

        // Fetch data from API
        // and display products
        async function getData() {
            const res = await fetch('https://fakestoreapi.com/products');
            const data = await res.json();
            allProducts = [...data];
            displayProducts(allProducts);

            buttons.forEach(button => {
                button.addEventListener("click", () => {
                    let categoryMap = {
                        "ALL": "all",
                        "Men's Clothing": "men's clothing",
                        "Women's Clothing": "women's clothing",
                        "Jewellery": "jewelery",
                        "Electronics": "electronics"
                    };

                    let selectedCategory = categoryMap[button.textContent];

                    if (selectedCategory === "all") {
                        displayProducts(allProducts);
                    } else {
                        let filteredProducts = allProducts.filter(product => product.category === selectedCategory);
                        displayProducts(filteredProducts);
                    }
                });
            });
        }

        function displayProducts(products) {
            productContainer.innerHTML = "";

            products.forEach((ele) => {
                let itemContainer = document.createElement("div");
                itemContainer.classList.add("product-item");

                let createImgEle = document.createElement("img");
                createImgEle.setAttribute("src", ele.image);
                createImgEle.setAttribute("class", "myImages");

                let createTitleEle = document.createElement("h3");
                createTitleEle.textContent = ele.title.substring(0, 20) + "...";

                let createDescEle = document.createElement("p");
                createDescEle.textContent = ele.description.substring(0, 95) + "...";

                let createPriceEle = document.createElement("span");
                createPriceEle.textContent = `$${ele.price}`;
                createPriceEle.classList.add("price");

                let buttonContainer = document.createElement("div");
                buttonContainer.classList.add("button-container");

                let detailsBtn = document.createElement("button");
                detailsBtn.textContent = "Details";
                detailsBtn.classList.add("details-btn");

                let cartBtn = document.createElement("button");
                cartBtn.textContent = "Add to Cart";
                cartBtn.classList.add("cart-btn");
                cartBtn.addEventListener("click", () => addToCart(ele));

                buttonContainer.appendChild(detailsBtn);
                buttonContainer.appendChild(cartBtn);

                itemContainer.appendChild(createImgEle);
                itemContainer.appendChild(createTitleEle);
                itemContainer.appendChild(createDescEle);
                itemContainer.appendChild(createPriceEle);
                itemContainer.appendChild(buttonContainer);

                productContainer.appendChild(itemContainer);
            });
        }

        function addToCart(product) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let found = cart.find(item => item.id === product.id);
            if (found) {
                found.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0); // Update cart count
        }

        getData();