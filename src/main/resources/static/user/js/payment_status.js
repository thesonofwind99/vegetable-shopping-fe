function formatDateTime(dateTimeStr) {
    // Kiểm tra đầu vào có đúng định dạng không
    if (dateTimeStr.length !== 14) {
        return "Invalid datetime format";
    }

    // Tách ngày, tháng, năm, giờ, phút, giây từ chuỗi đầu vào
    const year = dateTimeStr.slice(0, 4);
    const month = dateTimeStr.slice(4, 6);
    const day = dateTimeStr.slice(6, 8);
    const hour = dateTimeStr.slice(8, 10);
    const minute = dateTimeStr.slice(10, 12);
    const second = dateTimeStr.slice(12, 14);

    // Định dạng lại theo yêu cầu
    const formattedDateTime = `${year}/${month}/${day} ${hour}h${minute}m${second}s`;

    return formattedDateTime;
}


window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_TransactionStatus = urlParams.get('vnp_TransactionStatus');
    const vnp_OrderInfo = urlParams.get('vnp_OrderInfo');
    const vnp_PayDate = urlParams.get('vnp_PayDate');
    const vnp_TransactionNo = urlParams.get('vnp_TransactionNo');
    const vnp_Amount = urlParams.get('vnp_Amount');
    const formattedDateTime = formatDateTime(vnp_PayDate)
    if (vnp_TransactionStatus) {
        try {
            let result = '';
            if(vnp_TransactionStatus === '00'){
                document.getElementById('title_status').innerText = 'Payment success'
                 result += `
                        <tr>
                            <td>Order information:</td>
                            <td><span>${vnp_OrderInfo}</span></td>
                        </tr>
                        <tr>
                            <td>Total:</td>
                            <td><span>${vnp_Amount / 100}</span></td>
                        </tr>
                        <tr>
                            <td>Time to order:</td>
                            <td><span>${formattedDateTime}</span></td>
                        </tr>
                        <tr>
                            <td>Trading code:</td>
                            <td><span>${vnp_TransactionNo}</span></td>
                        </tr>
                 `
                document.getElementById('t_body').innerHTML = result;
                localStorage.removeItem("items");
                let itemList = [];
                if(localStorage.getItem("items")){
                    itemList = JSON.parse(localStorage.getItem("items"));
                }
                const cartItems = itemList;
                for (const cartItem of cartItems) {
                    await axios.put(`http://localhost:8080/api/v1/products/quantity/${cartItem.productId}/${cartItem.quantity}`)
                }
                document.getElementById('back_result').innerHTML = `<a class="text-body" href="/vegetable-shopping/home"> < Continue shopping</a>`

            }else{
                let orderId = sessionStorage.getItem('orderId');
                await axios.delete(`http://localhost:8080/api/v1/carts/${orderId}`);
                document.getElementById('title_status').innerText = 'Payment fail'
                result += `
                        <tr>
                            <td>Order information:</td>
                            <td><span>${vnp_OrderInfo}</span></td>
                        </tr>
                        <tr>
                            <td>Total:</td>
                            <td><span>${vnp_Amount / 100}</span></td>
                        </tr>
                        <tr>
                            <td>Time to order:</td>
                            <td><span>${formattedDateTime}</span></td>
                        </tr>
                 `
                document.getElementById('back_result').innerHTML = `<a class="text-body" href="/vegetable-shopping/checkout-form"> < Back to checkout form</a>`
            }
            document.getElementById('t_body').innerHTML = result;
        } catch (error) {
            console.error('Error checking payment status:', error);
        }
    }
};