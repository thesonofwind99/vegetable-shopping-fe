async function getAmount(){
    try {
        let itemList = JSON.parse(localStorage.getItem("items"));
        let sumPrice = 0;
        if(itemList){
            sumPrice = itemList.reduce((accumulator, item) => accumulator + item.price, 0);
        }
        const elements = document.querySelectorAll('.cart-sum-price-span');
        elements.forEach((element) => {
            element.textContent = sumPrice + "VND";
        });
        return Number(sumPrice);
    }catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getCount(){
    try {
        let itemList = JSON.parse(localStorage.getItem("items"));
        let count = 0;
        if(itemList){
            count = itemList.reduce((accumulator, item) => accumulator + item.quantity, 0);
        }
        const elements = document.querySelectorAll('.cart-count-item-span');
        elements.forEach((element) => {
            element.textContent = count;
        });
    }catch (error) {
        console.error('Error fetching data:', error);
    }
}

window.getAmount();
window.getCount();