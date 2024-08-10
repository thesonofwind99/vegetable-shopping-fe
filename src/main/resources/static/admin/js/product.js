async function getAllProductAdmin(page = 0, size = 10) {
    try {
        let {data: response} = await axios.get(`http://localhost:8080/api/v1/products?page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let products = response.content;
        let result = '';
        products.forEach(product => {
            result += `
                        <tr class="odd">
                            <td class="align-middle">${product.productId}</td>
                            <td class="align-middle">${product.productName}</td>
                            <td class="align-middle"><img src="${product.photo}"></td>
                            <td class="align-middle">${product.quantity}</td>
                            <td class="align-middle">${product.price}</td>
                            <td class="align-middle">${product.weight}</td>
                            <td class="align-middle">${product.category.categoryName}</td>
                            <td class="align-middle" id="tooltip-container2">
                                <a id="product-table-edit-${product.productId}" class="me-3 text-primary mx-1" data-bs-toggle="modal" data-bs-target="#productModal"><i class="fa-solid fa-pencil"></i></a>
                                <a id="product-table-delete-${product.productId}" class="text-danger" ><i class="fa-solid fa-trash-can"></i></a>
                            </td>
                        </tr>
                    `;
        });
        document.getElementById('product-table').innerHTML = result;

        let productPage = '';
        for (let i = 0; i < response.totalPages; i++) {
            productPage += `
                <li class="page-item ${i === response.number ? 'active' : ''}">
                    <a class="page-link" onclick="getAllProductAdmin(${i}, ${size})">${i + 1}</a>
                </li>
            `;
        }

        document.getElementById('product-pageable').innerHTML = `
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-end">
                    ${productPage}
                </ul>
            </nav>
        `;
        
        products.forEach(product => {
            // Delete
            let productDelete = document.getElementById(`product-table-delete-${product.productId}`);
            productDelete.addEventListener('click', async () => {
                try {
                    await axios.delete(`http://localhost:8080/api/v1/products/${product.productId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    Swal.fire({
                        title: 'Product',
                        text: 'Delete product successfully',
                        icon: 'success',
                        button: 'Oke'
                    });
                    getAllProductAdmin();
                } catch (error) {
                    Swal.fire({
                        title: 'Product',
                        text: 'Delete product failed',
                        icon: 'error',
                        button: 'Oke'
                    });
                }
            });
            // Edit
            let productEdit = document.getElementById(`product-table-edit-${product.productId}`);
            productEdit.addEventListener('click', async () => {
                try {
                    let {data: response} = await axios.get(`http://localhost:8080/api/v1/products/${product.productId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    document.getElementById('product-id').value = response.productId;
                    document.getElementById('product-name').value = response.productName;
                    document.getElementById('product-quantity').value = response.quantity;
                    document.getElementById('product-price').value = response.price;
                    document.getElementById('product-weight').value = response.weight;
                    document.getElementById('product-description').value = response.description;
                    document.getElementById('product-category-id').value = response.category.categoryId;
                    document.getElementById('product-image-show').style.display = 'block';
                    document.getElementById('product-label-image').style.display = 'none';
                    document.getElementById('product-image-show').src = `${response.photo}`;
                    //img thubmnails
                    document.getElementById('product-image-show2').style.display = 'none';
                    document.getElementById('product-label-image2').style.display = 'none';
                    document.getElementById('product-image-show3').style.display = 'none';
                    document.getElementById('product-label-image3').style.display = 'none';
                    document.getElementById('product-image-show4').style.display = 'none';
                    document.getElementById('product-label-image4').style.display = 'none';
                } catch (error) {
                    Swal.fire({
                        title: 'Product',
                        text: 'Load product to form failed',
                        icon: 'error',
                        button: 'Oke'
                    });
                }
            })
        });
    } catch (error) {
        console.log(error.message);
        Swal.fire({
            title: 'Product',
            text: 'Uploading data to table failed',
            icon: 'error',
            button: 'Oke'
        });
    }
}

// Add Product
document.getElementById('add-product').addEventListener('click',
    function (event) {
        event.preventDefault();
        addProduct();
    })


async function addProduct() {
    let formData = new FormData();
    formData.append('productName', document.getElementById('product-name').value);
    formData.append('quantity', document.getElementById('product-quantity').value);
    formData.append('price', document.getElementById('product-price').value);
    formData.append('weight', document.getElementById('product-weight').value);
    formData.append('description', document.getElementById('product-description').value);
    formData.append('categoryId', document.getElementById('product-category-id').value);
    formData.append('file', document.getElementById('product-image').files[0]);

    try {
        let productResponse = await axios.post('http://localhost:8080/api/v1/products', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        let productId = productResponse.data;

        try {
            if (productId !== null) {
                await addProductPhoto('product-image2', productId);
                await addProductPhoto('product-image3', productId);
                await addProductPhoto('product-image4', productId);
            }
        } catch (error) {
            Swal.fire({
                title: 'Product Photo',
                text: 'Add product photo failed',
                icon: 'error',
                button: 'Oke'
            });
        }
        Swal.fire({
            title: 'Product',
            text: 'Add product successfully',
            icon: 'success',
            button: 'Oke'
        });
        resetFormProduct();
        getAllProductAdmin();
    } catch (error) {
        Swal.fire({
            title: 'Product',
            text: 'Add product failed',
            icon: 'error',
            button: 'Oke'
        });
    }
}

function formDataThumbnail(imageElementId, productId) {
    let formData = new FormData();
    const file = document.getElementById(imageElementId).files[0];
    if (file) {
        formData.append('file', file);
    }
    formData.append('productId', productId);
    return formData;
}

async function addProductPhoto(imageElementId, productId) {
    let formData = formDataThumbnail(imageElementId, productId);
    if (formData.get('file')) {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/product-photos', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    } else {
    }
}

document.getElementById('update-product').addEventListener('click',
    function (event) {
        event.preventDefault();
        updateProduct();
    })

async function updateProduct() {
    try {
        let formData = new FormData();
        formData.append('productId', document.getElementById('product-id').value);
        formData.append('productName', document.getElementById('product-name').value);
        formData.append('quantity', document.getElementById('product-quantity').value);
        formData.append('price', document.getElementById('product-price').value);
        formData.append('weight', document.getElementById('product-weight').value);
        formData.append('description', document.getElementById('product-description').value);
        formData.append('categoryId', document.getElementById('product-category-id').value);
        formData.append('file', document.getElementById('product-image').files[0]);

        let productId = document.getElementById('product-id').value;

        await axios.put(`http://localhost:8080/api/v1/products/${productId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        Swal.fire({
            title: 'Product',
            text: 'Update product successfully',
            icon: 'success',
            button: 'Oke'
        });
        resetFormProduct();
        getAllProductAdmin();
    } catch (error) {
        Swal.fire({
            title: 'Product',
            text: 'Update product failed',
            icon: 'error',
            button: 'Oke'
        });
    }
}

document.getElementById('delete-product').addEventListener('click',
    function (event) {
        event.preventDefault();
        deleteProduct();
    })

async function deleteProduct() {
    try {
        let productId = +document.getElementById('product-id').value;
        await axios.delete(`http://localhost:8080/api/v1/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        Swal.fire({
            title: 'Product',
            text: 'Delete product successfully',
            icon: 'success',
            button: 'Oke'
        });
        resetFormProduct();
        getAllProductAdmin();
    } catch (error) {
        Swal.fire({
            title: 'Product',
            text: 'Delete product failed',
            icon: 'error',
            button: 'Oke'
        });
    }
}

document.getElementById('reset-product').addEventListener('click',
    function (event) {
        event.preventDefault();
        resetFormProduct();
    })

function resetFormProduct() {
    document.getElementById('product-id').value = null;
    document.getElementById('product-name').value = null;
    document.getElementById('product-quantity').value = null;
    document.getElementById('product-price').value = null;
    document.getElementById('product-weight').value = null;
    document.getElementById('product-description').value = null;
    document.getElementById('product-category-id').value = null;
    document.getElementById('product-image').value = null;
    document.getElementById('product-image-show').src = null;
    document.getElementById('product-label-image').style.display = 'block';
    document.getElementById('product-image-show').style.display = 'none';
    //img thumbnails
    document.getElementById('product-label-image2').style.display = 'block';
    document.getElementById('product-image-show2').style.display = 'none';
    document.getElementById('product-label-image3').style.display = 'block';
    document.getElementById('product-image-show3').style.display = 'none';
    document.getElementById('product-label-image4').style.display = 'block';
    document.getElementById('product-image-show4').style.display = 'none';
}

window.getCategoryToInputTableForm();

async function getCategoryToInputTableForm() {
    try {
        let {data: categories} = await axios.get('http://localhost:8080/api/v1/categories', {
            headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ1c2VyMSIsImlhdCI6MTcxOTU3MTUxMiwiZXhwIjoxNzIwMTc2MzEyfQ.CKtKA48ny_RyMFFuxTNSP_qkQgmeONI_AclLEMXyT_t2uf91l4f1WJ7FEMdVZhPQ`,
            }
        });
        console.log(categories)
        let result = '<option>select category type</option>';
        categories.content.forEach(category => {
            result += `
                <option value="${category.categoryId}">${category.categoryName}</option>
            `;
        })
        document.getElementById('product-category-id').innerHTML = result;
    } catch (error) {
        console.log(error.message)
    }
}

//show image
document.addEventListener('DOMContentLoaded', function () {
    function setupImagePreview(imageInputId, imagePreviewId, labelPreviewId) {
        const imageInput = document.getElementById(imageInputId);
        const imagePreview = document.getElementById(imagePreviewId);
        const labelPreview = document.getElementById(labelPreviewId);

        imageInput.addEventListener('change', function (evt) {
            const input = evt.target;
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    labelPreview.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    setupImagePreview('product-image', 'product-image-show', 'product-label-image');
    setupImagePreview('product-image2', 'product-image-show2', 'product-label-image2');
    setupImagePreview('product-image3', 'product-image-show3', 'product-label-image3');
    setupImagePreview('product-image4', 'product-image-show4', 'product-label-image4');
});

async function getProductsLikeProductName(page = 0, size = 10) {
    try {
        let productName = document.getElementById('find-product-like-name').value;
        let {data : response} = await axios.get(`http://localhost:8080/api/v1/products/findProductsLikeProductName?productName=${productName}&page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let products = response.content;
        let result = '';
        products.forEach(product => {
            result += `
                        <tr class="odd">
                            <td class="align-middle">${product.productId}</td>
                            <td class="align-middle">${product.productName}</td>
                            <td class="align-middle"><img src="${product.photo}"></td>
                            <td class="align-middle">${product.quantity}</td>
                            <td class="align-middle">${product.price}</td>
                            <td class="align-middle">${product.weight}</td>
                            <td class="align-middle">${product.category.categoryName}</td>
                            <td class="align-middle" id="tooltip-container2">
                                <a id="product-table-edit-${product.productId}" class="me-3 text-primary mx-1" data-bs-toggle="modal" data-bs-target="#productModal"><i class="fa-solid fa-pencil"></i></a>
                                <a id="product-table-delete-${product.productId}" class="text-danger" ><i class="fa-solid fa-trash-can"></i></a>
                            </td>
                        </tr>
                    `;
        });
        document.getElementById('product-table').innerHTML = result;

        let productPage = '';
        for (let i = 0; i < response.totalPages; i++) {
            productPage += `
                <li class="page-item ${i === response.number ? 'active' : ''}">
                    <a class="page-link" onclick="getAllProductAdmin(${i}, ${size})">${i + 1}</a>
                </li>
            `;
        }

        document.getElementById('product-pageable').innerHTML = `
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-end">
                    ${productPage}
                </ul>
            </nav>
        `;
    } catch (e) {
        console.log(e.message)
    }
}

window.getAllProductAdmin();
