document.addEventListener('DOMContentLoaded', function () {
    CKEDITOR.replace('contentBlog');
    getAllBlogs();
    showImageMockup();
    pageBreak();
    resetFormNormal();
    getAllCategory();
    document.getElementById('resetForm').addEventListener('click', resetFormNormal);
    document.getElementById('createBlog').addEventListener('click', addOrUpdateBlog);
});

const blogsPerPage = 5;
let currentBlogId = null;
let currentCategoryId = null;
let currentPage = 1;

async function getAllCategory() {
    try {
        let response = await axios.get('http://localhost:8080/api/v1/categories');
        let categories = response.data.content;
        if (!Array.isArray(categories)) {
            throw new Error('Categories is not an array');
        }
        let result = '';
        categories.forEach(category => {
            result += `
                <option value="${category.categoryId}">${category.categoryName}</option>
            `;
        });
        document.getElementById('selectedBlogs').innerHTML = result;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function getAllBlogs(pageNo = 1) {
    currentPage = pageNo;
    try {
        const { data: response } = await axios.get(`http://localhost:8080/api/v1/blogs?pageNo=${pageNo}&pageSize=${blogsPerPage}`);
        let blogs = response.blogs;
        let totalPages = response.totalPages;
        let result = '';
        blogs.forEach(blog => {
            let blogStatus = blog.blogActive ? 'Original' : 'Draft';
            result += `
                <tr class="table-blog" data-blog-id="${blog.blogId}">
                    <td>${blog.blogId}</td>
                    <td>${blog.blogCategory.categoryId}</td>
                    <td class="fixed-width-title">${blog.blogTitle}</td>
                    <td class="mockup-cell"><img src="${blog.blogImage}"></td>
                    <td>${blogStatus}</td>
                    <td><button class="btn btn-green edit-button" data-blog-id="${blog.blogId}"><i class="fas fa-edit"></i></button></td>
                </tr>     
            `;
        });
        document.getElementById('table-blog-result').innerHTML = result;
        renderPagination(totalPages, pageNo);
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function () {
                const blogId = this.getAttribute('data-blog-id');
                fillFormWithBlogData(blogId);
            });
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('table-blog-result').innerHTML = '<p>Error fetching data</p>';
    }
}

async function fillFormWithBlogData(blogId) {
    currentBlogId = blogId;
    try {
        let { data: blog } = await axios.get(`http://localhost:8080/api/v1/blogs/${blogId}`);
        document.getElementById('titleBlog').value = blog.blogTitle;
        document.getElementById('contentBlog').value = blog.blogContent;
        CKEDITOR.instances['contentBlog'].setData(blog.blogContent);
        document.querySelector(`input[name="statusActive"][value="${blog.blogActive ? 1 : 0}"]`).checked = true;
        document.getElementById('selectedBlogs').value = blog.blogCategory.categoryId;
        if (blog.blogImage) {
            hinhAnh = document.getElementById('imagePreview').src = `${blog.blogImage}`;
            $('#blog-label-image').prop('hidden', true);
            console.log(hinhAnh);
        } else {
            document.getElementById('imagePreview').src = '#';
        }
    } catch (error) {
        console.error('Error fetching blog data:', error);
    }
}

async function resetFormNormal() {
    try {
        let response = await axios.get('http://localhost:8080/api/v1/categories');
        let categories = response.data.content;
        let currentCategoryId = categories[0].categoryId;
        document.getElementById('titleBlog').value = '';
        document.querySelector('input[name="statusActive"][value="1"]').checked = true;
        document.getElementById('mockupID').value = '';
        document.getElementById('contentBlog').value = '';
        CKEDITOR.instances['contentBlog'].setData('');
        document.getElementById('imagePreview').src = '';
        $('#blog-label-image').prop('hidden', false);
        currentBlogId = null;
        document.getElementById('selectedBlogs').value = currentCategoryId;
    } catch (error) {
        console.error('Error resetting form:', error);
    }
}

function pageBreak() {
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.main-content > div').forEach(div => div.style.display = 'none');
            document.querySelector(this.getAttribute('href')).style.display = 'block';
        });
    });
    window.onload = function () {
        document.querySelector('.sidebar a[href="#dashboard"]').click();
    };
}

function showImageMockup() {
    document.getElementById('mockupID').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

async function addOrUpdateBlog() {
    console.log('Save Blog button clicked');
    let formData = new FormData();
    formData.append('blogTitle', document.getElementById('titleBlog').value);
    formData.append('blogActive', document.querySelector('input[name="statusActive"]:checked').value);
    formData.append('blogContent', CKEDITOR.instances['contentBlog'].getData());
    formData.append('file', document.getElementById('mockupID').files[0]);
    formData.append('categoryId', document.getElementById('selectedBlogs').value);
    try {
        if (currentBlogId) {
            console.log(currentBlogId);
            await axios.put(`http://localhost:8080/api/v1/blogs/update/${currentBlogId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Blog updated successfully',
                timer: 2000,
                showConfirmButton: false
            });
            await getAllBlogs(currentPage);
            await resetFormNormal();
        } else {
            await axios.post('http://localhost:8080/api/v1/blogs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Blog added successfully',
                timer: 2000,
                showConfirmButton: false
            });
            await getAllBlogs(currentPage);
            await resetFormNormal();
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function renderPagination(totalPages, currentPage) {
    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<a href="#" class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
    }
    document.getElementById('pagination').innerHTML = paginationHTML;
    document.querySelectorAll('.pagination-btn').forEach(button => {
        console.log(`Button ${button.getAttribute('data-page')} initialized`);
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const pageNo = parseInt(this.getAttribute('data-page'));
            console.log(`Page ${pageNo} clicked`);
            getAllBlogs(pageNo);
            document.querySelectorAll('.pagination-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}


