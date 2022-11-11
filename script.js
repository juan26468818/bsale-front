
const productContainer = document.getElementById("product-container");
const categoriesContainer = document.getElementById("categories-container");
const cartBg = document.getElementById("cart-bg");
const cart = document.getElementById("cart")
const openCart = document.getElementById("open-cart")
const addToCart = document.getElementsByClassName("add-to-cart");
let itemsInCart = 0;

const displayProducts = (products)=>{
    let productsHTML = ""
    products.forEach(element => {
        productsHTML+=
            `<div class="container">
                <picture>
                    
                    <img src=${element.url_image} class="container__img" alt=${element.name} onerror="this.src='./img/no-image-iconpng.png';" aria-hidden="true"/>
                </picture>
                <div class="product">
                    <p class="container__title">${element.name}</p>
                    <div class="product-description">
                    <p class="container__price">$${element.price}</p>
                    <i class="fa-solid fa-cart-shopping add-to-cart" id=${element.id}></i>
                    </div>
                    <p style="color:red">${element.discount ? element.discount+"% de descuento" : ""}</p>
                    </div>
                    </div>
                    `
                    productContainer.innerHTML = productsHTML
                    
                });
                for(let i = 0; i < products.length;i++){
                    addToCart[i].addEventListener("click", (e)=>{
                        itemsInCart += 1
                        let item = localStorage.getItem(e.target.id)
                        if(item === null){
                            localStorage.setItem(e.target.id, 1)
                        }else{
                            localStorage.setItem(e.target.id, +item+1)
                        }
                    })
                }
}

const displayCategories = (categories)=>{
    let categoriesHTML = ""
    categories.forEach(element => {
        categoriesHTML+=
            `
                <label class="categories">
                    <input type="checkbox" class="category-check">
                    ${element.name.charAt(0).toUpperCase() + element.name.slice(1)}
                </label>
        `
        categoriesContainer.innerHTML = categoriesHTML
    });
}

cartBg.addEventListener("click", ()=>{
    cartBg.classList += "hidden"
    cart.classList += "hidden"
})

openCart.addEventListener("click", ()=>{
    cartBg.classList.remove("hidden")
    cart.classList.remove("hidden")
})

window.onload = async () =>{

    const allProducts = await(await fetch("/api/products")).json(); 
    const allCategories = await(await fetch("/api/categories")).json(); 
    displayProducts(allProducts)
    displayCategories(allCategories)
}