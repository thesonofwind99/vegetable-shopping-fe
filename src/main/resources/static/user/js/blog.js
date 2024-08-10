let currentCategoryId = null;
let searchTitle = null;
const blogsPerPage = 6;
let blogId = null;
let blogsData = [];
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

async function getBlogs(categoryId = null, blogTitle = null, pageNo = 1) {
    try {
        let url = `http://localhost:8080/api/v1/blogs?pageNo=${pageNo}&pageSize=${blogsPerPage}&active=1`;
        if (categoryId) url += `&categoryId=${categoryId}`;
        if (blogTitle) url += `&blogTitle=${blogTitle}`;
        const { data: response } = await axios.get(url);
        let blogs = response.blogs;
        let totalPages = response.totalPages;

        let result = '';
        blogs.forEach(blog => {
            const formattedDate = formatDate(blog.blogDate);
            result += `
                <div class="col-lg-6 col-md-6 col-sm-6">
                    <div class="blog__item">
                        <div class="blog__item__pic">
                            <img src="${blog.blogImage}" alt="">
                        </div>
                        <div class="blog__item__text">
                            <ul>
                                <li><i class="fa fa-calendar-o"></i> ${formattedDate} </li>
                            </ul>
                            <h5><a href="#">${blog.blogTitle}</a></h5>
                            <div class="truncatete">
                            <p>If you find the article title interesting, please click read more to continue reading.</p>
                            </div>
                            <a href="#" class="blog__btn" data-blog-id="${blog.blogId}">READ MORE <span class="arrow_right" style="display: none">${blog.blogId}</span></a>
                        </div>
                    </div>
                </div>
            `;
        });
        document.getElementById('row-blog').innerHTML = result;
        renderPagination(totalPages, pageNo);

        // Thêm sự kiện cho các nút "READ MORE" sau khi cập nhật HTML
        document.querySelectorAll('.blog__btn').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                blogId = this.getAttribute('data-blog-id');
                sessionStorage.setItem('blogDetailId',blogId);
                console.log("ID blog la: " + blogId);
                let linkURL = window.location.href = `/vegetable-shopping/blog-details?blogId=${blogId}`;
                console.log(linkURL);
            });
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        document.getElementById('row-blog').innerHTML = '<p>Error fetching blogs</p>';
    }
}

function renderPagination(totalPages, currentPage) {
    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<a href="#" class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
    }
    document.getElementById('pagination').innerHTML = paginationHTML;
    document.querySelectorAll('.pagination-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const pageNo = parseInt(this.getAttribute('data-page'));
            getBlogs(currentCategoryId, searchTitle, pageNo);
            document.querySelectorAll('.pagination-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

document.getElementById('search-input').addEventListener('input', function(event) {
    searchTitle = this.value.trim();
    getBlogs(currentCategoryId, searchTitle);
});

window.loadCategories()
getBlogs();

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${formattedDay}/${formattedMonth}/${year}`;
}

