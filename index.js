import { menuArray } from "./data.js"

let isWaiting = false
let isPromo = false
const allProductContainer = document.getElementById("all-products-cointainer")

const modal = document.getElementById("modal")

const paymentDetails = document.getElementById("modal-form")
const customerCardNumber = document.getElementById("modal-card-number")

const promoForm = document.getElementById("promo-form")

const ratingUsDiv = document.getElementById("rating-star")
const ratingUsBtn = document.getElementById("rating-stars-btn")

const thankYouForRatingDiv = document.getElementById("thank-you-for-rating")
let newMenuArray = menuArray

document.addEventListener("click", e=>{

  if (!isWaiting) {
    e.target.dataset.product ? addProduct(e.target.dataset.product) :""
  
    e.target.dataset.remove ? removeProduct(e.target.dataset.remove) :""
  }

  e.target.id==="order-summary-btn" ? showModal() : ""
})

const addProduct = (productId) =>{
  thankYouForRatingDiv.style.display="none"
  
  newMenuArray.forEach(product=>{ 
    
    if(productId == product.id){
      newMenuArray[productId].qtyAdded++
    } 
  })
  render()

}

const removeProduct = (productId) => {
  newMenuArray.forEach(product=>{ 
    
    if(productId == product.id){
      newMenuArray[productId].qtyAdded--
    } 
  })
  render()
   
}

const showModal = () => {
  isWaiting = true
  modal.style.display = "block"
}


paymentDetails.addEventListener("submit", e=>{
  e.preventDefault()
  const consentFormData = new FormData(paymentDetails)
  const fullName = consentFormData.get('customer-name')

  document.getElementById("order-summary").innerHTML = `
  <h2 class="thank-you-message">Thanks, ${fullName}! Your order is on its way!</h2>`
  modal.style.display= "none"
  promoForm.style.display="none"
  isWaiting = false
  newMenuArray.forEach(product=>{
    product.qtyAdded = 0
  })
  ratingUsDiv.style.display="block"
})

customerCardNumber.oninput = e =>{ // auto add - to the card number
  const cardTemplate = "XX-XXXX-XXXX-XXXX-XXXX"
  cardTemplate[e.target.value.length] ==="-" 
  ? e.target.value+="-" :""
}

promoForm.addEventListener("submit", e=>{ //Promotion Form
  e.preventDefault()
  if (!isWaiting) {
    const promoCode = new FormData(promoForm).get("promo-input")
    promoCode === "10 Off" ? isPromo = true : isPromo = false
    render()
  }
})

ratingUsBtn.addEventListener("click",()=>{
  const consentFormData = new FormData(paymentDetails)
  const fullName = consentFormData.get('customer-name')
  const gwiazdki = Array.from(document.getElementsByClassName("star-clicked"))
  ratingUsDiv.style.display = "none"
  thankYouForRatingDiv.style.display="block"
  thankYouForRatingDiv.innerHTML = `
  ${gwiazdki.length>3?`
  <h3 class="rating-title">Thanks, ${fullName} for ${gwiazdki.length/2}</h3>
  <i class="fa-solid fa-star-half star-clicked-end"></i>
  <i class="fa-solid fa-star-half star-right star-clicked-end"></i>`:"" }
  <h3 class="rating-goodbye">Hope to see you soon</h3>
  `
})


const render = () =>{

  const setProductHtml = menuArray.map(product=>{
    const { name, ingredients, id, price, emoji } = product
    let currentIngredients = ""
    ingredients.forEach((ing, id)=>{
          ingredients.length-1 === id ? currentIngredients+= `${ing} ` : currentIngredients+= `${ing}, ` // delete comma on the last ingredient
        })
        
        return `
        <div class="product-container">
        <p class="product-icon">${emoji}</p>
        <div class="product">
        <div class="product-info">
        <h2 class="product-info-name">${name}</h2>
        <p class="product-info-ingredients">${currentIngredients}</p>
        <h4 class="product-info-price">$${price}</h4>
        </div>
        </div>
        <button class="product-add-qty" aria-label="add-${name}" data-product=${id}>+</button>
        </div>
        <hr class="product-underline"></hr>`
      }).join("")
  
      allProductContainer.innerHTML = setProductHtml
  ratingUsDiv.style.display= "none"
  // 
  
  let summaryProducts = ""
  const productTitle = `<h2 class="order-summary-title">Your Order</h2>`
  let grandTotal =``
  let totalPrice = 0
  menuArray.forEach(product=>{
    const { name, price, qtyAdded , id } = product
    if (qtyAdded>0) {
      totalPrice += price*qtyAdded
      summaryProducts += `
      <div class="order-summary-container">
        <h2 class="order-summary-product">${name}<button class="order-summary-remove" data-remove=${id}>remove</button></h2>
        <h3 class="order-summary-qty">${qtyAdded}</h3>
        <h4 class="order-summary-price">$${price*qtyAdded}</h4>
      </div>
  `
}
})
promoForm.style.display="block"

  grandTotal = `
  <hr class="order-summary-underline"></hr>
  <div class="order-summary-container">
      <h2 class="order-summary-total">Total price:</h2>
      <h4 class="order-summary-price">$${isPromo ? totalPrice.toFixed(2) + "- 10% = $" + (totalPrice*0.9).toFixed(2) :totalPrice}</h4>
      ${isPromo? `<h4 class="order-summary-save">You Saved <span class="order-summary-save-value">$${(totalPrice*0.1).toFixed(2)}</span></h4>` :""}
  </div>
  <button class="order-summary-btn" id="order-summary-btn">Complete order</button>
`
  if (totalPrice > 0) {
    document.getElementById("order-summary").innerHTML = productTitle + summaryProducts + grandTotal 
  } else {
    document.getElementById("order-summary").innerHTML = ""
    promoForm.style.display="none"

  }

} 

const allStars = Array.from(document.getElementById("rating-stars-div").children)
allStars.forEach((everyStars,starId) =>{
  let starNumber = starId
  let isStarClicked = false


  everyStars.addEventListener("mouseenter",()=>{
    allStars.forEach((star,id) =>{
      starNumber>=id? star.classList.add("star-hover") :""
    })
  })

  everyStars.addEventListener("mouseleave",()=>{
    allStars.forEach((star,id) =>{
      starNumber>=id? star.classList.remove("star-hover") :""
    })
  })

  everyStars.addEventListener("click",()=>{
    let numbersStarClicked = 0
    allStars.forEach((star, id) =>{
      starNumber>=id? star.classList.add("star-clicked") :""
      if (star.classList.contains("star-clicked")) {
        numbersStarClicked+=1
        if (numbersStarClicked >starNumber+1) {
          isStarClicked = true
        }
      }
    })
  })

  everyStars.addEventListener("click",()=>{
    allStars.forEach((star) =>{
      isStarClicked ? star.classList.remove("star-clicked") : ""
    })
  })

})

render()