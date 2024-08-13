async function itemUser() {
    try {
        const userInfor = JSON.parse(sessionStorage.getItem('userInfor'));

        // Update UI elements
        document.getElementById('fullname').value = userInfor.fullname || 'N/A'; // Set default if fullName is missing
        document.getElementById('phone_number').value = userInfor.phoneNumber || 'N/A';

        // Return user ID as a string (assuming it's already a string)
        return userInfor.userId; // Explicit conversion if necessary
    } catch (error) {
        console.error('Error fetching user:', error);
        // Handle errors gracefully, e.g., display an error message to the user
    }
}


async function addOrder(){
    const userToken = sessionStorage.getItem('token');
    let shipping_fee = document.getElementById('shipping-fee').textContent;
    let total_amount = document.getElementById('total-amount').textContent;
    const userId = await itemUser();

    let formData = new FormData();
    formData.append('addressShipping', document.getElementById('address_shipping').value);
    formData.append('cartStatus', 'WAIT_FOR_CONFIRMATION');
    formData.append('note', document.getElementById('note').value);
    formData.append('paymentMethod',  getSelectedRadio());
    formData.append('paymentStatus', getSelectedRadio() === 'true' ? 'false' : 'true');
    formData.append('shippingFee', parseFloat(shipping_fee.replace(/[^0-9]/g, '')));
    formData.append('totalAmount', parseFloat(total_amount.replace(/[^0-9]/g, '')));
    formData.append('userId', userId);


    try {
        let order = await axios.post('http://localhost:8080/api/v1/carts', formData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        });
        let itemList = [];
        if(localStorage.getItem("items")){
            itemList = JSON.parse(localStorage.getItem("items"));
        }
        const cartItems = itemList;
        let cartItemRequestList = [];
        for (const cartItem of cartItems) {
            let CartItemRequest = {
                quantity: cartItem.quantity,
                price: cartItem.price,
                productId: cartItem.product.productId,
                cartId: order.data.cartId
            }
            cartItemRequestList.push(CartItemRequest);
        }
        try {
            let theErrorOfItem  = await axios.post('http://localhost:8080/api/v1/cartItems', cartItemRequestList, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                }
            });

            const stringBuilder = theErrorOfItem.data;
            const stringValue = stringBuilder.toString();

            if(stringValue === ''){
                sessionStorage.setItem('orderId', order.data.cartId);
                if(getSelectedRadio() === 'true'){
                    for (const cartItem of cartItemRequestList) {
                        await axios.put(`http://localhost:8080/api/v1/products/quantity/${cartItem.productId}/${cartItem.quantity}`)
                    }
                    localStorage.removeItem("items");
                    Swal.fire({
                        title: 'Success',
                        text: 'You have paid for your order',
                        icon: 'success'
                    })
                    setTimeout(function () {
                        window.location.href = "/vegetable-shopping/home";
                    }, 1000);
                }
                return true;
            }else{
                await axios.delete(`http://localhost:8080/api/v1/carts/${order.data.cartId}`);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: stringValue,
                    showCancelButton: true,
                    confirmButtonText: "Go to cart",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/vegetable-shopping/shoping-cart';
                    }
                });
                console.error("Failed to create some cart items.");
                return false;
            }
        } catch (error) {
            console.error("Failed to create some cart items:", error);
        }

        //Check if all cart items were successfully created before clearing localStorage


    }catch (error){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You were unable to pay, please try again",
        });
        console.error(error);
        return false;
    }

}

async function payWithVNPay(){
    let canAddToCart = await addOrder();
    let total_amount = document.getElementById('total-amount').textContent;
    if(canAddToCart){
        try {
            const baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
            const formData = new URLSearchParams();
            formData.append('amount', Number(total_amount.replace(/[^0-9]/g, '')));
            formData.append('orderInfo', encodeURIComponent('Payment invoice of ' + document.getElementById('fullname').value));
            formData.append('baseUrl', baseUrl);
            const response = await axios.post('http://localhost:8080/api/v1/checkout/vnpay/submitOrder', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const paymentUrl = response.data;
            window.location.href = paymentUrl; // Redirect to VNPay payment gateway
        } catch (error) {
            console.error('Error creating payment:', error);
        }
    }
}


function getSelectedRadio() {

    const radios = document.getElementsByName('payment_method');

    let isRadioChecked = false;

    for (const radio of radios) {
        if (radio.checked) {
            isRadioChecked = true;
            break;
        }
    }
    if(isRadioChecked){
        const selectedRadio = document.querySelector('input[name="payment_method"]:checked');
        if (!selectedRadio.isNull) {
            return selectedRadio.value;
        }
    }else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please choose a payment method",
        });
    }

}

document.getElementById('order_submit').addEventListener('click', function (evt){
    evt.preventDefault();
    let address = document.getElementById('address_shipping').value;
    if(getSelectedRadio() === 'true' && address.length > 0){
        addOrder();
    }else if(getSelectedRadio() === 'false' && address.length > 0){
        payWithVNPay();
    }else if(getSelectedRadio().isNull || address.length === 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter the address",
        });
    }
});

window.itemUser();