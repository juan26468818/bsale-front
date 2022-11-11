
const productContainer = document.getElementById("product-container");
const categoriesContainer = document.getElementById("categories-container");



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
                        <i class="fa-solid fa-cart-shopping add-to-cart"></i>
                    </div>
                </div>
            </div>
        `
        productContainer.innerHTML = productsHTML
    });
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



window.onload = async () =>{

    const allProducts = await(await fetch("/api/products")).json(); 
    const allCategories = await(await fetch("/api/categories")).json(); 
    displayProducts(allProducts)
    displayCategories(allCategories)
}