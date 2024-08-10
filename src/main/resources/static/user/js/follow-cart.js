async function loadOrderToTable() {
    try {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfor'));
        let token = sessionStorage.getItem('token');
        let userId = userInfo.userId;
        let {data: response} = await axios.get(`http://localhost:8080/api/v1/carts/getCartsByUserId/${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        let result = '';
        response.forEach(item => {
            let paymentMethodDisplay = item.paymentMethod ? 'Payment on delivery' : 'Oline payment';
            let paymentStatusDisplay = item.paymentMethod ? 'Unpaid' : 'Paid';
            result += `
                <tr>
                            <td>${item.cartId}</td>
                            <td>${item.cartStatus}</td>
                            <td>${item.addressShipping}</td>
                            <td>${paymentMethodDisplay}</td>
                            <td>${paymentStatusDisplay}</td>
                            <td>${item.totalAmount}<small class="mx-1 font-weight-bold">VNĐ</small></td>
                            <td class="text-red">
                                <i id="order-${item.cartId}" class="fa-regular fa-eye"></i>
                            </td>
                        </tr>
            `;
            document.getElementById('following-cart').innerHTML = result;
        })

        response.forEach(item => {
            document.getElementById(`order-${item.cartId}`).addEventListener('click', async () => {
                try {
                    let {data: response} = await axios.get(`http://localhost:8080/api/v1/cartItems/${item.cartId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    })
                    let tableHtml = `
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Product Name</th>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${response.map(item => `
                                                        <tr>
                                                            <td>${item.product.productName}</td>
                                                            <td>${item.quantity}</td>
                                                            <td>${item.price.toFixed(2)}</td>
                                                        </tr>
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                            `;
                    Swal.fire({
                        title: 'Cart Details',
                        html: tableHtml,
                        icon: 'info',
                        width: '50%',
                        button: 'OK'
                    });
                } catch (e) {
                    console.log(e.message);
                }
            })
        })
    } catch (e) {
        console.log(e.message);
    }
}
async function loadCategories() {
    try {
        // Gọi API để lấy dữ liệu the loai
        let {data: categories} = await axios.get(
            'http://localhost:8080/api/v1/categories');
        categories.content.forEach(category => {
            $('#category-list').append(
                `<li><a href="#">${category.categoryName}</a></li>`
            );
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
window.loadOrderToTable();
window.loadCategories();
