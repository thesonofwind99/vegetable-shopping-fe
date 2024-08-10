async function getUser(){
    const username = sessionStorage.getItem('userName');
    const userResponse = await axios.get(`http://localhost:8080/api/v1/users/${username}`);
    sessionStorage.setItem('userInfor', JSON.stringify(userResponse.data));
}

document.getElementById('login-normal').addEventListener('click',
    function (event) {
        event.preventDefault();
        login();
    })

async function login() {
    const username = document.getElementById('user-username').value;
    const password = document.getElementById('user-password').value;
    await axios.post('http://localhost:8080/api/v1/auth/login', {username, password})
        .then(response => {
            swal.fire({
                title: "Login successful!",
                text: "You login successful!",
                icon: "success",
                button: "OK",
            }).then((value) => {
                if (response.data) {
                    sessionStorage.setItem('token', response.data);
                    sessionStorage.setItem('userName', response.headers.get('X-User-Name'));
                    getUser();
                    setTimeout(function () {
                        window.location.href = "/vegetable-shopping/home";
                    }, 1000);
                }
            });

        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid username or password!",
            });
        });
}




