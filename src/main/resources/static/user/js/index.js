let token = sessionStorage.getItem('token');

async function getFeatureProduct() {
    try {
        // Gọi API để lấy dữ liệu sản phẩm
        let {data: products} = await axios.get(
            'http://localhost:8080/api/v1/products/feature-product');
        products.forEach(product => {
            $('#product-list').append(`
          <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="product__item">
                <div class="product__item__pic set-bg" style="background-image: url(${product.photo})">
                    <ul class="product__item__pic__hover">
                        <li><a id="add-to-cart-${product.productId}"><i class="fa fa-shopping-cart"></i></a></li>
                    </ul>
                </div>
                <div class="product__item__text">
                    <h6><a href="/vegetable-shopping/product/product-detail/${product.productId}">${product.productName}</a></h6>
                    <h5>${product.price}VND</h5>
                </div>
                </div>
        </div>
        `);

            // Add to cart event
            let addToCart = document.getElementById(
                `add-to-cart-${product.productId}`);
            addToCart.addEventListener('click', async () => {
                const newItem = {
                    product: product,
                    quantity: 1,
                    price: product.price
                }
                if (itemList !== null) {
                    const index = itemList.findIndex(
                        item => item.product.productId === newItem.product.productId);
                    if (index !== -1) {
                        const quantityChange = itemList[index].quantity + 1;
                        itemList[index].quantity = quantityChange;
                        itemList[index].price = itemList[index].quantity * newItem.price;
                    } else {
                        itemList.push(newItem);
                    }
                }
                localStorage.setItem("items", JSON.stringify(itemList));
                getAmount();
                getCount();
                swal.fire("Added to cart!");
            });
        });

        let itemList = [];
        if (localStorage.getItem("items")) {
            itemList = JSON.parse(localStorage.getItem("items"));
        }


    } catch (error) {
        console.error('Error fetching data:', error);
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
            $('.categories__slider').owlCarousel('add',
                    `<div class="col-lg-3">
                        <div class="categories__item set-bg" 
                        data-setbg="${category.categoryImage}"
                        style="background-image: url(${category.categoryImage});">
                            <h5><a href="#">${category.categoryName}</a></h5>
                        </div>
                      </div>`).owlCarousel('update');
            });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function checkout_logged() {
    if (sessionStorage.getItem("token") !== null) {
        window.location.href = '/vegetable-shopping/user/update-account';
    } else {
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

async function getThreeBlog() {
    try {
        // Gọi API để lấy dữ liệu sản phẩm
        let {data: blogs} = await axios.get(
            'http://localhost:8080/api/v1/blogs/threeBlogs');
        blogs.forEach(blog => {
            const formattedDate = formatDate(blog.blogDate);
            console.log()
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

function formatDate(dateString){
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${formattedDay}/${formattedMonth}/${year}`;
}

window.getFeatureProduct();
window.loadCategories();
window.getThreeBlog();



