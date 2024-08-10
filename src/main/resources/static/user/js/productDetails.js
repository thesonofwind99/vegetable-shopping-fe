window.loadProductDetail(getProductId());

function getProductId(){
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    const id = parseInt(parts[parts.length - 1]);
    return id;
}
async function loadProductDetail(id){
    try {
        let {data: response} = await axios.get(`http://localhost:8080/api/v1/products/${id}`);
        console.log(response.productName);
        document.getElementById('product_name').innerText = response.productName;
        document.getElementById('product_price').innerText = response.price + ' VND';
        document.getElementById('product_infor').innerText = response.description;
        document.getElementById('product_quantity').innerText = response.quantity === 0 ? 'Out of stock' : response.quantity;
        document.getElementById('product_weight').innerText = response.weight + ' kg';
        document.querySelector('.product__details__pic__item').innerHTML = `
            <img class="product__details__pic__item--large"
                                src="${response.photo}" alt="photo">
        `

        try{
            let imgResult = '';
            let {data: images} = await axios.get(`http://localhost:8080/api/v1/product-photos/${id}`);
            images.forEach(img => {
                imgResult += `
                <img data-imgbigurl="img/product/details/product-details-2.jpg"
                                 src="${img.photoUrl}" alt="img">
            `;
            })
            document.querySelector('.product__details__pic__slider').innerHTML = imgResult;
        }catch (error){
            console.error("Img " + error);
        }
    }catch (error){
        console.error(error);
    }
}

document.getElementById('minus').addEventListener('click', function (evt){
    evt.preventDefault();
    let qty = document.getElementById('pro_qty_text').value;
    if(qty > 1){
        document.getElementById('pro_qty_text').value = qty - 1;
    }
});

document.getElementById('plus').addEventListener('click', function (evt){
    evt.preventDefault();
    let qtyOfProd = Number(document.getElementById('product_quantity').innerText);
    let qty = Number(document.getElementById('pro_qty_text').value);
    if(qty < qtyOfProd){
        document.getElementById('pro_qty_text').value = qty + 1;
    }
});

let itemList = [];
if (localStorage.getItem("items")) {
    itemList = JSON.parse(localStorage.getItem("items"));
}

document.getElementById('add_to_cart').addEventListener('click', async () => {
    let qtyOfInput = document.getElementById('product_quantity').innerText;
    if(qtyOfInput === 'Out of stock'){
        swal.fire({
            title: "You cannot add to cart !",
            text: "The quantity is out of stock",
            icon: "error"
        });
    }else{
        let id = getProductId();
        let {data: response} = await axios.get(`http://localhost:8080/api/v1/products/${id}`);
        let qty = Number(document.getElementById('pro_qty_text').value);
        const newItem = {
            product: response,
            quantity: qty,
            price: response.price * qty
        }

        if (itemList !== null) {
            const index = itemList.findIndex(
                item => item.product.productId === newItem.product.productId);
            if (index !== -1) {
                const quantityChange = itemList[index].quantity + qty;
                itemList[index].quantity = quantityChange;
                itemList[index].price = quantityChange * response.price;
            } else {
                itemList.push(newItem);
            }
        }
        localStorage.setItem("items", JSON.stringify(itemList));
        getAmount();
        getCount();
        swal.fire("Added to cart!");
    }

});


