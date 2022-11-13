const productContainer = document.getElementById("product-container");
const categoriesContainer = document.getElementById("categories-container");
const cartBg = document.getElementById("cart-bg");
const cart = document.getElementById("cart")
const openCart = document.getElementById("open-cart")
const addToCart = document.getElementsByClassName("add-to-cart");
const productOrder = document.getElementById("order-description");
const totalBuyAmount = document.getElementById("total-buy__amount")
const filterBtn = document.getElementById("filter")
const searchInput = document.querySelector(".header__search")
const searchBtn = document.querySelector(".search-submit")
let filterList = 1
const categoriesForm = document.forms['category-form']
const orderList = [];
const cartItems = [];
let checkDuplicate = [];
let itemsInCart = +localStorage.getItem("Total")
let total = 0
openCart.setAttribute("value", itemsInCart)







/* Buscador */

const search = async()=>{
    const searchedProducts = await(await fetch(`/api/products/name/${searchInput.value}`)).json();
    displayProducts(searchedProducts)
}
searchBtn.addEventListener("click", (e) =>{
    e.preventDefault()
    search()
})


/* DisplayProducts Filtered */
filterBtn.addEventListener("click", async(e)=>{
    e.preventDefault()
    filterList = categoriesForm.categories.value;
    const productsByCategory = await(await fetch(`/api/products/category/${filterList}`)).json();
    displayProducts(productsByCategory)
})

for(let i = 0; i < localStorage.length; i++){
    if(localStorage.key(i) !== "Total")
        orderList.push(localStorage.key(i))
        checkDuplicate.push(localStorage.key(i))
}


const displayProducts = (products)=>{

    /* Añadir los HTML con los productos*/
    let productsHTML = ""
    products.forEach(element => {
        productsHTML+=
            `<div class="container">
                <picture>
                <img src=${element.url_image} class="container__img" alt=${element.name} onerror="this.src='./img/no-image-iconpng.png';" aria-hidden="true"/>
                </picture>
                <p class="product-discount">${element.discount ? element.discount+"% de descuento" : ""}</p>
                <div class="product">
                    <p class="container__title">${element.name}</p>
                    <p class="product__price">$${element.price}</p>
                    <span>Agregar al carrito:</span><i class="fa-solid fa-cart-shopping add-to-cart" id=${element.id}></i>
                </div>
            </div>`
        productContainer.innerHTML = productsHTML  
    });

    /* Sumatoria de la cantidad de productos agregados al carrito */
    for(let i = 0; i < products.length;i++){
        addToCart[i].addEventListener("click", async(e)=>{
            orderList.push(e.target.id)
            await getCartProducts()
            itemsInCart += 1
            let totalValue = localStorage.getItem("Total")


            localStorage.setItem("Total", +totalValue+1)
            openCart.setAttribute("value", itemsInCart)
            let item = localStorage.getItem(e.target.id)
            if(item === null){
                localStorage.setItem(e.target.id, 1)
            }else{
                localStorage.setItem(e.target.id, +item+1)
            }
        })
    }
}


/* Mostrar las categrías */
const displayCategories = (categories)=>{
    let categoriesHTML = ""
    categories.forEach(element => {
        categoriesHTML+=
            `
                <option class="categories" value=${element.id}>
                    ${element.name.charAt(0).toUpperCase() + element.name.slice(1)}
                </option>
        `
        categoriesContainer.innerHTML = categoriesHTML
    });
}


/* Mostrar los productos en la zona del carrito de compras */


const displayCart =  ((products) =>{
    
    let productsHTML = ""
    total = 0
    products.forEach(element => {
        let discount = element.discount/100;
        let discountValue = discount*element.price
        total += (+element.price*+element.quantity) - (discountValue)
        productsHTML+=
        `
        <ul class="order-container">
            <li class="order-product"><button class="change__quantity minus">-</button><span class="product-quantity">${element.quantity}</span><button class="change__quantity plus">+</button>${element.name}<div class="product-price"><span>$</span><span class=" p-price">${element.price}</span></div></li>
            <li class="product-price">${element.discount ? "Descuento: $" :""}<span class="p-discount">${element.discount ? discountValue :""}</span></li>
        </ul>`;
        
        productOrder.innerHTML = productsHTML;
    });
    totalBuyAmount.innerHTML = total
    
})


/* Sumar el total del carrito */

/* Abrir Carrito de compras */
openCart.addEventListener("click", ()=>{
    cartBg.classList.remove("hidden")
    cart.classList.remove("hidden")
    displayCart(cartItems)
    /* Se inicializan las siguientes variables debajo del cartItems para que sus clases sean accesisbles en el DOM */
    const lessQuantity = document.querySelectorAll(".minus")
    const plusQuantity = document.querySelectorAll(".plus")
    const price = document.querySelectorAll(".p-price")
    const discount = document.querySelectorAll(".p-discount")
    const quantity = document.querySelectorAll(".product-quantity")

    /* Aumenta cantidad de objetos y valor total del carrito */
    const changeQuantityPlus = (i) =>{
            let substraction = +price[i].innerText * +quantity[i].innerText
            total = total - substraction
            quantity[i].innerText = +quantity[i].innerText+1
            let newQuantity = +quantity[i].innerText*+price[i].innerText
            let newPrice = newQuantity - +discount[i].innerText
            total = +total + +newPrice
            totalBuyAmount.innerHTML = total
            itemsInCart++
            localStorage.setItem("Total", itemsInCart)
            openCart.setAttribute("value", itemsInCart)
    }

    /* Disminuye cantidad de objetos y valor total del carrito */ 
    const changeQuantityMinus = ((i) =>{
        console.log(i)
        if(quantity[i].innerText != 0){ 
            let substraction = +price[i].innerText * +quantity[i].innerText
            total = total - substraction
            quantity[i].innerText = +quantity[i].innerText-1
            let newQuantity = +quantity[i].innerText*+price[i].innerText
            let newPrice = newQuantity - +discount[i].innerText
            total = +total + +newPrice
            totalBuyAmount.innerHTML = total
            itemsInCart--
            localStorage.setItem("Total", itemsInCart)
            openCart.setAttribute("value", itemsInCart)
        }
        else alert("Ya eliminaste este producto")
    })
    /* Se llama a las funciones para actualizar los valores de cantidad y monto total del carrito */
    plusQuantity.forEach((it, i) => it.addEventListener("click", ()=>changeQuantityPlus(i)))
    lessQuantity.forEach((it, i) => it.addEventListener("click", ()=>changeQuantityMinus(i)))
})



/* Cerrar Carrito de compras */
cartBg.addEventListener("click", ()=>{
    cartBg.classList += "hidden"
    cart.classList += "hidden"
})
// Obtiene los productos del carrito que se encontraban guardados en el localStorage
const getFirstCartProducts = (async()=>{
    for(let i = 0; i < orderList.length; i++){
        const cartProducts = await(await fetch(`/api/products/${orderList[i]}`)).json();
        cartItems.push(cartProducts)
        cartItems[i].quantity = localStorage.getItem(orderList[i])
    }
})
// Compara dos Objetos
function compareObj(a, b) {
    let aKeys = Object.keys(a).sort();
    let bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length) {
        return false;
    }
    if (aKeys.join('') !== bKeys.join('')) {
        return false;
    }
    for (let i = 0; i < aKeys.length; i++) {
        if ( a[aKeys[i]]  !== b[bKeys[i]]) {
            return false;
        }
    }
    return true;
}

// Actualiza los productos en el carrito
const getCartProducts = (async()=>{
    for(let i = orderList.length-1; i < orderList.length; i++){
        const cartProducts = await(await fetch(`/api/products/${orderList[i]}`)).json();
        let cartPID = cartProducts.id
        

        if(checkDuplicate.includes((cartPID).toString())){
            for(let i = 0; i < cartItems.length; i++){
                cartProducts.quantity = cartItems[i].quantity
                if(compareObj(cartProducts, cartItems[i])){
                    cartItems[i].quantity = parseInt(cartItems[i].quantity) + 1
                }
            }
        }else{
            cartProducts.quantity = +1
            cartItems.push(cartProducts)
        }

        checkDuplicate.push((cartPID).toString())
        
    }
})



window.onload = async () =>{
    const allProducts = await(await fetch("/api/products")).json(); 
    const allCategories = await(await fetch("/api/categories")).json();
    allProducts.sort(function (a, b) {
        if (a.category > b.category) {
          return 1;
        }
        if (a.category < b.category) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    displayProducts(allProducts)
    displayCategories(allCategories)
    getFirstCartProducts()
    
}