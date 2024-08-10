async function getAllCategoriesVerticalBlogDetail() {
    try {
        let response = await axios.get('http://localhost:8080/api/v1/categories');
        let categories = response.data.content;
        let result = '';
        categories.forEach(category => {
            result += `
                <li>
                    <a href="#" data-category-id="${category.categoryId}">${category.categoryName}</a>
                </li>
            `;
        });
        document.getElementById('blog-sidebar-item').innerHTML = result;
        document.querySelectorAll('#blog-sidebar-item a').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const categoryId = parseInt(this.getAttribute('data-category-id'));
                if (currentCategoryId === categoryId) {
                    currentCategoryId = null;
                    this.classList.remove('active');
                    fillBlogDetail();
                } else {
                    currentCategoryId = categoryId;
                    document.querySelectorAll('#blog-sidebar-item a').forEach(a => a.classList.remove('active'));
                    this.classList.add('active');
                    fillBlogDetail(categoryId);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        document.getElementById('blog-sidebar-item').innerHTML = '<p>Error fetching categories</p>';
    }
}
getAllCategoriesVerticalBlogDetail();

let currentUrl = window.location.href;
sessionStorage.setItem('currentUrl', currentUrl);

async function fillBlogDetail(categoryId = null, blogTitle = null, pageNo = 1) {
    try {
        let sessionBlogDetailId = sessionStorage.getItem('currentUrl');
        let urls = new URL(sessionBlogDetailId);
        let blogId = urls.searchParams.get('blogId');
        let { data: blog } = await axios.get(`http://localhost:8080/api/v1/blogs/${blogId}`);
        const formattedDate = formatDate(blog.blogDate);
        let result = `
        <h2>${blog.blogTitle}</h2>
        `
        let result1 = `
        <p>${blog.blogContent}</p>
        `
        let result2 = `
        <img src="${blog.blogImage}" alt="">
        `
        let result3 = `
        <ul>
           | ${formattedDate} |</li>
        </ul>
        `
        document.getElementById('blog__details__hero__text__title').innerHTML = result;
        document.getElementById('show-blog-details').innerHTML = result1;
        document.getElementById('show-image-details').innerHTML = result2;
        document.getElementById('blog__details__hero__text__time').innerHTML = result3;
    } catch (error) {
        console.error('Error fetching blogs:', error);
        document.getElementById('blog__details__hero__text__title').innerHTML = '<p>Error fetching blogs</p>';
    }
}

async function getThreeBlog() {
    try {
        // Gọi API để lấy dữ liệu sản phẩm
        let {data: blogs} = await axios.get(
            'http://localhost:8080/api/v1/blogs/threeBlogs');
        blogs.forEach(blog => {
            const formattedDate = formatDate(blog.blogDate);
            $('#three-blog-list').append(`
          <div class="col-lg-4 col-md-4 col-sm-6">
                    <div class="blog__item">
                        <div class="blog__item__pic" id="blog__item__pic">
                            <img src="${blog.blogImage}"  alt="">
                        </div>
                        <div class="blog__item__text">
                            <ul>
                                <li><i class="fa fa-calendar-o"></i>${formattedDate}</li>
                            </ul>
                            <h5><a href="http://localhost:8081/vegetable-shopping/blog-details?blogId=${blog.blogId}">${blog.blogTitle}</a></h5>
                            <p>If you find the article title interesting, please click read more to continue reading.</p>
                        </div>
                    </div>
                </div>
            `);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
// Gọi hàm fillBlogDetail để lấy chi tiết blog
fillBlogDetail();

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${formattedDay}/${formattedMonth}/${year}`;
}



