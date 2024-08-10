async function getAllItem() {
    try {
        let result = '';
        let itemList = [];
        if(localStorage.getItem("items")){
            itemList = JSON.parse(localStorage.getItem("items"));
        }
        const cartItems = itemList;
        cartItems.forEach((cartItem, index) => {
                result += `
                                <tr>
                                    <td class="shoping__cart__item">
                                        <img src="${cartItem.product.photo}" alt="ImgProduct">
                                        <h5>${cartItem.product.productName}</h5>
                                    </td>
                                    <td class="shoping__cart__price">
                                        ${cartItem.product.price}VND
                                    </td>
                                    <td class="shoping__cart__quantity">
                                        <div class="quantity">
                                            <div class="pro-qty">
                                                <span id="minus-${index}" class="qtybtn">-</span>
                                                <input type="text" value="${cartItem.quantity}">
                                                <span id="plus-${index}" class="qtybtn">+</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="shoping__cart__total">
                                        ${cartItem.price}VND
                                    </td>
                                    <td class="shoping__cart__item__close">
                                        <span id="icon_close_${index}" class="icon_close"></span>
                                    </td>
                                </tr>                        
                    `;

            });

        document.getElementById('tbody-cart-items').innerHTML = result;

        cartItems.forEach((cartItem, index) => {
            // Delete
            let productDelete = document.getElementById(`icon_close_${index}`);
            productDelete.addEventListener('click', async () => {
                try {
                    swal.fire({
                        title: "You want to delete this item ?",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                itemList.splice(index, 1);
                                localStorage.setItem("items", JSON.stringify(itemList));
                                getAllItem();
                                getAmount();
                                getCount();
                            }
                        });
                } catch (error) {
                    console.error('Error:', error);
                }
            });
            //Minus
            let productMinus = document.getElementById(`minus-${index}`);
            productMinus.addEventListener('click', async () => {
                try {
                    if (itemList[index].quantity > 1 ) {
                        const quantityChange = itemList[index].quantity - 1;
                        itemList[index].quantity = quantityChange;
                        itemList[index].price = itemList[index].quantity * cartItem.product.price;
                    }
                    localStorage.setItem("items", JSON.stringify(itemList));
                    getAllItem();
                    getAmount();
                    getCount();
                } catch (error) {
                    console.error('Error:', error);
                }
            });

            //Plus
            let productPlus = document.getElementById(`plus-${index}`);
            productPlus.addEventListener('click', async () => {
                try {
                    if (itemList[index].quantity < 100) {
                        const quantityChange = itemList[index].quantity + 1;
                        itemList[index].quantity = quantityChange;
                        itemList[index].price = itemList[index].quantity * cartItem.product.price;
                    }
                    localStorage.setItem("items", JSON.stringify(itemList));
                    getAllItem();
                    getAmount();
                    getCount();
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error: ', error);
    }

}
function checkout_check(){
    if(sessionStorage.getItem("token")){
        if(localStorage.getItem("items")){
            window.location.href = '/vegetable-shopping/checkout-form';
        }else{
            Swal.fire({
                title: "Opp...!",
                text: "Please add product to cart",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Go to home"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/vegetable-shopping/home';
                }
            });
        }
    }else{
        Swal.fire({
            title: "You are not logged in!",
            text: "To be able to pay, please log in first!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Login"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/vegetable-shopping/login';
            }
        });
    }
}
window.getAllItem();
window.getAmount();
window.getCount();