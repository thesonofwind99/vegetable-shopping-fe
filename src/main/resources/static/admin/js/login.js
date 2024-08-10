async function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    await axios.post('http://localhost:8080/api/v1/auth/login', {username, password})
        .then(response => {
            let role = response.headers['x-role'];
            console.log(response)
            if (role === 'ROLE_ADMIN' || role === 'ROLE_SYSTEM') {
                sessionStorage.setItem('admin', JSON.stringify(response))
                setTimeout(function () {
                    window.location.href = '/admin/index';
                }, 1000);
            } else {
                Swal.fire({
                    title: 'Login',
                    text: 'you do not have access',
                    icon: 'warning',
                    button: 'OK'
                })
            }

        })
        .catch(err => {
            console.log(err);
        })
}

$('#login').off('click').on('click', function (event) {
    event.preventDefault();
    login();
});