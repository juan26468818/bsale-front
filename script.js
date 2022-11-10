
const productContainer = document.querySelector("#product-container");

const allProducts = []

const getData = 
    fetch("/api/products")
        .then(res=>res.json())
        .then(data=>{
            return data.map(e =>{
                allProducts.push(e)
            })
        })


console.log(allProducts)