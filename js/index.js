// ==============1.選定各html tag===============

// 1.1選定order panel中的addDrink button
// ※※重要：選取具有某個html tag的屬性之方法
const addDrinkButton = document.querySelector('[data-alpha-pos="add-drink"]')

// 1.2選定order list、order list中的checkout button
// 1.2.1選定orderList
const orderLists = document.querySelector('[data-order-lists]')

// 1.2.2 選定checkout button
const checkoutButton = document.querySelector('[data-alpha-pos="checkout"]')

// ==============2.建立constructor===============

// 2.1建立Drink constructor
// 2.1.1建立Drink constructor的屬性
function Drink(name, ice, sugar) {
  this.name = name;
  this.ice = ice;
  this.sugar = sugar;

  // 「直接」取得price的方法：事先建立價目表priceList(hash),從價目表取得該飲料的價錢
  // this.price = priceList[this.drink]
}

// 「間接」取得price的方法：建立Drink constructor的方法
// 2.1.2 建立Drink constructor的方法
Drink.prototype.price = function () {
  // return priceList[this.name]
  switch (this.name) {
    case 'Black Tea':
    case 'Oolong Tea':
    case 'Baozong Tea':
    case 'Green Tea':
      return 30
    case 'Bubble Milk Tea':
    case 'Lemon Green Tea':
      return 50
    case 'Black Tea Latte':
    case 'Matcha Latte':
      return 55
    default:
      alert('No this drink')
  }
}

// 2.2建立Constructor function for Alpha Pos System
function AlphaPos() { }

// 2.2.1建立AlphaPos的方法getCheckedValue
// 使用時機：按下addOrder button時
AlphaPos.prototype.getCheckedValue = function (inputName) {
  let selectedOption = ''
  document.querySelectorAll(`[name=${inputName}]`).forEach(function (item) {
    if (item.checked) {
      selectedOption = item.value
    }
  })
  return selectedOption
}

// 2.2.2建立AlphaPos的方法addDrink function
// 使用時機：按下addOrder button時
// 2.2.2.1 將物件中的drink, ice , sugar, price放進htmlContent，並於order list中建立card
AlphaPos.prototype.addDrink = function (drink) {

  let orderCardHTML = `
    <div class="card mb-3">
      <div class="card-body pt-3 pr-3">
        <div class="card-text text-right">
          <span data-alpha-pos="delete-drink">x</span>
        </div>
        <h6 class="card-title mb-1">${drink.name}</h6>
        <div class="card-text">${drink.ice}</div>
        <div class="card-text">${drink.sugar}</div>
      </div>
      <div class="card-footer text-muted py-2">
        <div class="card-text text-muted text-right">$ <span data-drink-price>${drink.price()}</span>
      </div>
    </div>
  `
  // 2.2.2.2 order list的最上方加入orderCardHTML
  document.querySelector('[data-order-lists]').insertAdjacentHTML("afterbegin", orderCardHTML)

}

// 2.2.3 建立AlphaPos的方法deleteDrink function：刪除該卡片
// 使用時機：按下deleteDrink button時
AlphaPos.prototype.deleteDrink = function (target) {
  target.remove()
}

// 2.2.4 建立AlphaPos的方法checkout function：計算總價並alert(priceTotal:$ XXX)
// 使用時機：按下checkout button時
AlphaPos.prototype.checkout = function () {
  let priceTotal = 0
  document.querySelectorAll('[data-drink-price]').forEach(function (item) {
    priceTotal += Number(item.textContent)
  })
  return priceTotal
}

AlphaPos.prototype.clearOrder = function (target) {
  target.querySelectorAll('.card').forEach(function (item) {
    item.remove()
  })
}

// =================監聽及執行==================

// 3.監聽add button：取得drink,ice,sugar,price && 加入至orderlist

// 3.1建立AlphaPos的實例
const alphaPos = new AlphaPos()

// 3.2 監聽add button
addDrinkButton.addEventListener('click', function (event) {
  // 3.2.1. 取出店員選擇的飲料品項、甜度、冰塊選項內容
  const drinkName = alphaPos.getCheckedValue('drink')
  const ice = alphaPos.getCheckedValue('ice')
  const sugar = alphaPos.getCheckedValue('sugar')

  // 3.2.2.若drink未被選取，則alert並跳出
  if (!drinkName) {
    alert('Please choose at least one item.')
    return
  }

  // 3.2.3.建立Drink的物件實例
  const drink = new Drink(drinkName, ice, sugar)
  console.log(drink)
  console.log(drink.price())


  // 3.2.4 將drink加至order list panel
  alphaPos.addDrink(drink)

})


// 4.監聽orderList:delete button && checkout 
// 4.1 監聽delete button
orderLists.addEventListener('click', function (event) {
  console.log(event.target)
  let isDeleteButton = event.target.matches('[data-alpha-pos="delete-drink"]')
  if (!isDeleteButton) {
    return
  }
  // delete the card element
  alphaPos.deleteDrink(event.target.parentElement.parentElement.parentElement)

})

// 4.2 監聽checkout button:計算總價、清除order list
checkoutButton.addEventListener('click', function () {
  // 1. calculate total amount
  alert(`Total amount of drinks：$${alphaPos.checkout()}`)

  // 2. reset the order list
  let isOrderConfirm = confirm('Make sure to checkout?')
  if (isOrderConfirm) {
    alphaPos.clearOrder(orderLists)
  }
})






