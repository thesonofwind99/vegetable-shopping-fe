window.getAllCartToTable();

async function getAllCartToTable(page = 0, size = 10) {
    try {
        let {data: response} = await axios.get(`http://localhost:8080/api/v1/carts?page=${page}&size=${size}`);
        let carts = response.content;
        let result = '';
        carts.forEach(cart => {
            let paymentMethodDisplay = cart.paymentMethod ? 'Payment on delivery' : 'Oline payment';
            let paymentStatusDisplay = cart.paymentMethod ? 'Unpaid' : 'Paid';
            result += `
                 <tr class="odd">
                    <td class="align-middle">${cart.cartId}</td>
                    <td class="align-middle">${cart.createdDate}</td>
                    <td class="align-middle">${paymentMethodDisplay}</td>
                    <td class="align-middle">${paymentStatusDisplay}</td>
                    <td class="align-middle">${cart.cartStatus}</td>
                    <td class="align-middle">${cart.addressShipping}</td>
                    <td class="align-middle">${cart.shippingFee}</td>
                    <td class="align-middle">${cart.totalAmount}</td>
                    <td class="align-middle" id="tooltip-container2">
                        <a id="order-table-edit-${cart.cartId}" class="me-3 text-primary mx-1" data-bs-toggle="modal" data-bs-target="#orderModal"><i class="fa-solid fa-pencil"></i></a>
                    </td>
                </tr>
            `;
        })
        document.getElementById('order-table').innerHTML = result;

        let orderPage = '';
        for (let i = 0; i < response.totalPages; i++) {
            orderPage += `
                <li class="page-item ${i === response.number ? 'active' : ''}">
                    <a class="page-link" onclick="getAllCartToTable(${i}, ${size})">${i + 1}</a>
                </li>
            `;
        }

        document.getElementById('order-pageable').innerHTML = `
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-end">
                    ${orderPage}
                </ul>
            </nav>
        `;

        carts.forEach(cart => {
            let cartEdit = document.getElementById(`order-table-edit-${cart.cartId}`);
            cartEdit.addEventListener('click', async () => {
                try {
                    let {data: order} = await axios.get(`http://localhost:8080/api/v1/carts/${cart.cartId}`)
                    let {data: response} = await axios.get(`http://localhost:8080/api/v1/cartItems/${cart.cartId}`);
                    let tableContent = `<table class="table table-bordered table-hover">`;
                    tableContent += `
                                                <thead>
                                                     <tr>
                                                         <th>STT</th>
                                                         <th>Name</th>
                                                         <th>Price</th>
                                                         <th>Quantity</th>
                                                         <th>Total Price</th>
                                                     </tr>
                                                </thead>
                                            `;
                    tableContent += `<tbody>`;
                    response.forEach((item, index = 0) => {
                        tableContent += `
                                                    <tr>
                                                        <td>${index + 1}</td>
                                                        <td>${item.product.productName}</td>
                                                        <td>${item.product.price}</td>
                                                        <td>${item.quantity}</td>
                                                        <td>${item.price}</td>
                                                    </tr>
                                                `;
                    });
                    tableContent += `</tbody></table>`;
                    document.getElementById('order-id').value = order.cartId;
                    document.getElementById('order-status').value = order.cartStatus;
                    document.getElementById('order-date').value = order.createdDate;
                    document.getElementById('shipping-fee').value = order.shippingFee;
                    document.getElementById('order-total').value = order.totalAmount;
                    document.getElementById('order-note').value = order.note;
                    document.getElementById('address-shipping').value = order.addressShipping;
                    document.getElementById('show-order-details').innerHTML = tableContent;
                } catch (e) {
                    Swal.fire({
                        title: 'Cart',
                        text: 'Load cart to form failed',
                        icon: 'warning',
                        button: 'Oke'
                    });
                }
            })
        })
    } catch (e) {
        Swal.fire({
            title: 'Cart',
            text: 'Load cart to table failed',
            icon: 'error',
            button: 'Oke'
        });
    }
}

document.getElementById('order-update').addEventListener('click',
    function (event) {
        event.preventDefault();
        updateOrder();
    })

async function updateOrder() {
    try {
        let formData = new FormData();
        formData.append('cartStatus', document.getElementById('order-status').value);
        let cartId = document.getElementById('order-id').value;
        await axios.put(`http://localhost:8080/api/v1/carts/${cartId}`, formData, {
            headers: {'Content-Type': 'application/json'}
        });
        Swal.fire({
            title: 'Order',
            text: 'Update order successfully',
            icon: 'success',
            button: "OK"
        })
        getAllCartToTable();
    } catch (e) {
        Swal.fire({
            title: 'Order',
            text: 'Update order failed',
            icon: 'error',
            button: 'OK'
        })
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return date.toLocaleDateString('en-GB', options).replace(/,/g, ' -');
}

document.getElementById('order-status-filter').addEventListener('change', function (ev) {
    ev.preventDefault();
    let cartStatus = document.getElementById('order-status-filter').value;
    filterByStatus(cartStatus);
})

async function filterByStatus(cartStatus, page = 0, size = 10) {
    try {
        let {data : response} = await axios.get(`http://localhost:8080/api/v1/carts/getCartsByCartStatus?cartStatus=${cartStatus}&page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        console.log(response)
        let carts = response.content;
        let result = '';
        carts.forEach(cart => {
            let paymentMethodDisplay = cart.paymentMethod ? 'Payment on delivery' : 'Oline payment';
            let paymentStatusDisplay = cart.paymentMethod ? 'Unpaid' : 'Paid';
            result += `
                 <tr class="odd">
                    <td class="align-middle">${cart.cartId}</td>
                    <td class="align-middle">${cart.createdDate}</td>
                    <td class="align-middle">${paymentMethodDisplay}</td>
                    <td class="align-middle">${paymentStatusDisplay}</td>
                    <td class="align-middle">${cart.cartStatus}</td>
                    <td class="align-middle">${cart.addressShipping}</td>
                   <td class="align-middl e">${cart.shippingFee}</td>
                    <td class="align-middle">${cart.totalAmount}</td>
                    <td class="align-middle" id="tooltip-container2">
                        <a id="order-table-edit-${cart.cartId}" class="me-3 text-primary mx-1" data-bs-toggle="modal" data-bs-target="#orderModal"><i class="fa-solid fa-pencil"></i></a>
                    </td>
                </tr>
            `;
        })
        document.getElementById('order-table').innerHTML = result;

        let orderPage = '';
        for (let i = 0; i < response.totalPages; i++) {
            orderPage += `
                <li class="page-item ${i === response.number ? 'active' : ''}">
                    <a class="page-link" onclick="getAllCartToTable(${i}, ${size})">${i + 1}</a>
                </li>
            `;
        }

        document.getElementById('order-pageable').innerHTML = `
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-end">
                    ${orderPage}
                </ul>
            </nav>
        `;

    } catch (error) {
        console.log(error.message);
    }
}
