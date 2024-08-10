window.getAllCategories();

async function getAllCategories(page = 0, size = 10) {
    try {
        let {data: response} = await axios.get(`http://localhost:8080/api/v1/categories?page=${page}&size=${size}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        let categories = response.content;
        let result = '';
        categories.forEach(category => {
            result += `
                        <tr class="odd">
                            <td class="align-middle">${category.categoryId}</td>
                            <td class="align-middle">${category.categoryName}</td>
                            <td class="align-middle"><img src="${category.categoryImage}"></td>
                            <td class="align-middle" id="tooltip-container2">
                                <a id="category-table-edit-${category.categoryId}" class="me-3 text-primary mx-1" data-bs-toggle="modal" data-bs-target="#categoryModal"><i class="fa-solid fa-pencil"></i></a>
                                <a id="category-table-delete-${category.categoryId}" class="text-danger" ><i class="fa-solid fa-trash-can"></i></a>
                            </td>
                        </tr>
                       `;
        })
        document.getElementById('category-table').innerHTML = result;

        let categoryPage = '';
        for (let i = 0; i < response.totalPages; i++) {
            categoryPage += `
                <li class="page-item ${i === response.number ? 'active' : ''}">
                    <a class="page-link" onclick="getAllCategories(${i}, ${size})">${i + 1}</a>
                </li>
            `;
        }

        document.getElementById('category-pageable').innerHTML = `
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-end">
                    ${categoryPage}
                </ul>
            </nav>
        `;

        categories.forEach(category => {
            //delete category
            let categoryDelete = document.getElementById(`category-table-delete-${category.categoryId}`);
            categoryDelete.addEventListener('click', async () => {
                try {
                    await axios.delete(`http://localhost:8080/api/v1/categories/${category.categoryId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    Swal.fire({
                        title: 'Delete Category',
                        text: 'Delete successfully',
                        icon: 'success',
                        button: 'Oke'
                    });
                    getAllCategories();
                } catch (error) {
                    Swal.fire({
                        title: 'Category',
                        text: 'Delete category failed',
                        icon: 'warning',
                        button: 'Oke'
                    });
                }
            });
            // edit category
            let categoryEdit = document.getElementById(`category-table-edit-${category.categoryId}`);
            categoryEdit.addEventListener('click', async () => {
                try {
                    let {data: response} = await axios.get(`http://localhost:8080/api/v1/categories/${category.categoryId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    });
                    document.getElementById('category-id').value = response.categoryId;
                    document.getElementById('category-name').value = response.categoryName;
                    document.getElementById('category-image-show').style.display = 'block'
                    document.getElementById('category-label-image').style.display = 'none'
                    document.getElementById('category-image-show').src = `${category.categoryImage}`
                } catch (error) {
                    Swal.fire({
                        title: 'Category',
                        text: 'Load category to form failed',
                        icon: 'warning',
                        button: 'Oke'
                    });
                }
            })
        });
    } catch (error) {
        Swal.fire({
            title: 'Category',
            text: 'Uploading data to table failed',
            icon: 'error',
            button: 'Oke'
        });
    }
}

document.getElementById('reset-category').addEventListener('click', () => {
    resetFormCategory();
})

function resetFormCategory() {
    document.getElementById('category-id').value = null;
    document.getElementById('category-name').value = null;
    document.getElementById('category-image').value = null;
    document.getElementById('category-label-image').style.display = 'block';
    document.getElementById('category-image-show').style.display = 'none';
    document.getElementById('category-image-show').src = null;
}

document.getElementById('add-category').addEventListener('click',
    function (event) {
        event.preventDefault();
        addCategory();
    })

async function addCategory() {
    try {
        let formData = new FormData();
        formData.append('categoryName', document.getElementById('category-name').value);
        formData.append('file', document.getElementById('category-image').files[0]);

        await axios.post('http://localhost:8080/api/v1/categories', formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        });
        Swal.fire({
            title: 'Category',
            text: 'Add category successfully',
            icon: 'success',
            button: 'Oke'
        });
        resetFormCategory();
        getAllCategories();
    } catch (error) {
        Swal.fire({
            title: 'Category',
            text: 'Add category failed',
            icon: 'error',
            button: 'Oke'
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('category-image');
    const imagePreview = document.getElementById('category-image-show');
    const labelPreview = document.getElementById('category-label-image');

    imageInput.addEventListener('change', function (event) {
        const input = event.target;
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
});

document.getElementById('delete-category').addEventListener('click',
    function (event) {
        event.preventDefault();
        deleteCategory();
    })

async function deleteCategory() {
    try {
        let categoryId = document.getElementById('category-id').value;
        await axios.delete(`http://localhost:8080/api/v1/categories/${categoryId}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        Swal.fire({
            title: 'Category',
            text: 'Delete category successfully',
            icon: 'success',
            button: 'Oke'
        });
        resetFormCategory();
        getAllCategories();
    } catch (error) {
        Swal.fire({
            title: 'Category',
            text: 'Delete category failed',
            icon: 'error',
            button: 'Oke'
        });
    }
}

document.getElementById('update-category').addEventListener('click',
    function (event) {
        event.preventDefault();
        updateCategory();
    })

async function updateCategory() {
    try {
        let formData = new FormData();
        formData.append('categoryId', document.getElementById('category-id').value);
        formData.append('categoryName', document.getElementById('category-name').value);
        let fileInput = document.getElementById('category-image');
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }
        let categoryId = document.getElementById('category-id').value;
        await axios.put(`http://localhost:8080/api/v1/categories/${categoryId}`, formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'multipart/form-data'
            }
        });
        Swal.fire({
            title: 'Category',
            text: 'Update category successfully',
            icon: 'success',
            button: 'Oke'
        });
        resetFormCategory();
        getAllCategories();
    } catch (error) {
        Swal.fire({
            title: 'Category',
            text: 'Update category failed',
            icon: 'error',
            button: 'Oke'
        });
    }
}

async function findCategoryByCategoryName(page = 0, size = 10) {
    try {
        let keyword = document.getElementById('find-category-like-name').value;
        const {data : response} = await axios.get(`http://localhost:8080/api/v1/categories/findCategoryLikeCategoryName?keyword=${keyword}&page=${page}&size=${size}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        let categories = response.content;
        console.log(categories);
        let result = '';
        categories.forEach(category => {
            result += `
                        <tr class="odd">
                            <td class="align-middle">${category.categoryId}</td>
                            <td class="align-middle">${category.categoryName}</td>
                            <td class="align-middle"><img src="${category.categoryImage}"></td>
                            <td class="align-middle" id="tooltip-container2">
                                <a id="category-table-edit-${category.categoryId}" class="me-3 text-primary mx-1" data-bs-toggle="modal" data-bs-target="#categoryModal"><i class="fa-solid fa-pencil"></i></a>
                                <a id="category-table-delete-${category.categoryId}" class="text-danger" ><i class="fa-solid fa-trash-can"></i></a>
                            </td>
                        </tr>
                       `;
        })
        document.getElementById('category-table').innerHTML = result;

        let categoryPage = '';
        for (let i = 0; i < response.totalPages; i++) {
            categoryPage += `
                <li class="page-item ${i === response.number ? 'active' : ''}">
                    <a class="page-link" onclick="getAllCategories(${i}, ${size})">${i + 1}</a>
                </li>
            `;
        }

        document.getElementById('category-pageable').innerHTML = `
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-end">
                    ${categoryPage}
                </ul>
            </nav>
        `;
    } catch (error) {
        console.log(error.message);
    }
}
