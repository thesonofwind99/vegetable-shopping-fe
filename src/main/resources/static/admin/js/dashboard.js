let token = JSON.parse(sessionStorage.getItem('admin')).data;
console.log(token);

// count users
window.countUsers();

async function countUsers() {
    try {
        let {data: countUsers} = await axios.get('http://localhost:8080/api/v1/users/countUsers', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        document.getElementById('count-users').innerText = countUsers;
    } catch (e) {
        console.log(e.message)
    }
}

// count products

window.countProducts();

async function countProducts() {
    try {
        let {data: countProducts} = await axios.get('http://localhost:8080/api/v1/products/countProducts', {
            headers: {
                'Authorization': `Bearer ` + token
            }
        });
        document.getElementById('count-products').innerText = countProducts;
    } catch (e) {
        console.log(e.message);
    }
}

//count order
window.countOrderInWeek();

async function countOrderInWeek() {
    try {
        let {data: countOrderInWeek} = await axios.get('http://localhost:8080/api/v1/carts/countOrderInWeek', {
            headers: {
                'Authorization': `Bearer ` + token
            }
        });
        document.getElementById('count-order-in-7day').innerText = countOrderInWeek;
    } catch (e) {
        console.log(e.message);
    }
}

// chart js
window.chartJs = chartJs;
async function chartJs() {
    try {
        let {data: yearReport} = await axios.get('http://localhost:8080/api/v1/carts/findYearOrder', {
            headers: {
                'Authorization': `Bearer ` + token
            }
        });
        let result = '';
        yearReport.forEach(year => {
            result += `
                <option value="${year}">${year}</option>
            `;
        });
        document.getElementById('report-year').innerHTML = result;
        if (yearReport.length > 0) {
            updateChart(yearReport[0]);
        }
    } catch (error) {
        console.error('Error fetching year data:', error);
    }
    document.getElementById('report-year').addEventListener('change', (event) => {
        const year = event.target.value;
        updateChart(year);
    });
}

async function updateChart(year) {
    try {
        let reportRevenueByMonth = document.getElementById('report-revenue-by-month').getContext('2d');
        let {data: reportMonth} = await axios.get(`http://localhost:8080/api/v1/reports/reportRevenueByMonth/${year}`, {
            headers: {
                'Authorization': `Bearer ` + token
            }
        });
        const labels = reportMonth.map(item => `M ${item.month}`);
        const data = reportMonth.map(item => item.revenue);

        if (window.myChart) {
            window.myChart.destroy();
        }

        window.myChart = new Chart(reportRevenueByMonth, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue',
                    data: data,
                    backgroundColor: 'rgb(154,2,2)',
                    borderWidth: 1,
                    maxBarThickness: 50
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    chartJs();
});



// top product
window.getTopProducts();

async function getTopProducts() {
    let {data: product} = await axios.get('http://localhost:8080/api/v1/reports/reportTopProducts', {
        headers: {
            'Authorization': `Bearer ` + token
        }
    });
    let count = 0;
    let result = '';
    product.forEach(product => {
        result += `
                <tr>
                    <td>${count += 1}</td>
                    <td>${product.productName}</td>
                    <td>${product.totalSold}</td>
                </tr>
        `
    })
    document.getElementById('top-products').innerHTML = result;
}

window.getTopUsersBuyMost();
async function getTopUsersBuyMost() {
    try {
        let{data : users} = await axios.get('http://localhost:8080/api/v1/reports/reportTopUsersBuyLotOf', {
            headers: {
                'Authorization': `Bearer ` + token
            }
        });
        let resutl = '';
        users.forEach(user => {
            resutl += `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.fullname}</td>
                        <td>${user.email}</td>
                        <td>${user.phoneNumber}</td>
                        <td>$${user.totalAmount}</td>
                        <td>${user.orderCount}</td>
                    </tr>
            `;
        });
        document.getElementById('top-users-buy-lot-of').innerHTML = resutl;
    } catch (e) {
        console.log(e.message);
    }
}
