function checkLogin1() {
    let checkValue = sessionStorage.getItem('token');
    let userMenuContent = document.getElementById('userMenuContent');
    $('#userMenuContent').empty();
    if (checkValue == null) {
        $('#userMenuContent').append(`
                <a href="/vegetable-shopping/login">Login</a>
                <a href="/vegetable-shopping/user/register">Register</a>
        `)
    } else {
        $('#userMenuContent').append(`
                <a href="/vegetable-shopping/user/order">Your orders</a>
                <a href="/vegetable-shopping/user/update-account">Update account</a>
                <a href="/vegetable-shopping/user/change-password">Change password</a>
                <a onclick="logout()">Log out</a>
        `)
    }
}

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    window.location.href = "/vegetable-shopping/home";
}

window.checkLogin1();