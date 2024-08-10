const list = JSON.parse(localStorage.getItem("items"));
let result = '';
list.forEach(item =>{
    result += `<li>${item.product.productName} x ${item.quantity} <span>${item.price}VND</span></li>`
});
document.getElementById('product_checkout').innerHTML = result;


async function setAmount(){
    let shopping_fee = 20000;
    document.getElementById('shipping-fee').textContent = shopping_fee + 'VND';
    let totalAmount = await getAmount() + shopping_fee;
    document.getElementById('total-amount').textContent = `${totalAmount}` + 'VND';
}
window.setAmount();