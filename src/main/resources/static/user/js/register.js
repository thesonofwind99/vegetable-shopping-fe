async function register() {
    try {
        //validateRegister();
        // var form = document.getElementById('registrationForm');
        //     for(var i=0; i < form.elements.length; i++){
        //         if(form.elements[i].value === '' && form.elements[i].hasAttribute('required')){
        //             return false;
        //         }
        //     }
        let formData = new FormData()
        formData.append('username', document.getElementById('user-username').value);
        formData.append('password', document.getElementById('user-password').value);
        formData.append('email', document.getElementById('user-email').value);
        await axios.post('http://localhost:8080/api/v1/users', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        Swal.fire({
            title: 'Register',
            text: 'Create account successfully',
            icon: 'success',
            button: 'Oke'
        });
        setTimeout(function () {
            window.location.href = "/vegetable-shopping/home";
        }, 1000);
    } catch (err) {
        console.log(err);
        Swal.fire({
            title: 'Register',
            text: err.response.data.message,
            icon: 'error',
            button: 'Oke'
        });
    }
}

function validateRegister() {
    let password = document.getElementById('user-password').value;
    let confirmPassword = document.getElementById('user-ConfirmPassword').value;
    let username = document.getElementById('user-username').value;
    let email = document.getElementById('user-email').value;
    if (password !== confirmPassword) {
        document.getElementById('password-message').textContent = "Passwords not match!";
    }
    if (username.trim() === "") {
        document.getElementById('user-username').placeholder = "Username must be between 5 and 30 characters";
    }
    if (email.trim() === "") {
        document.getElementById('user-email').placeholder = "Please enter a email address";
    }
    if (password.trim() === "") {
        document.getElementById('user-password').placeholder = "Password must be at least 8 characters";
    }
    if (confirmPassword.trim() === "") {
        document.getElementById('user-ConfirmPassword').placeholder = "Please enter a confirmation password";
    }
}

document.getElementById('submit-registration').addEventListener('click', function (e) {
    e.preventDefault();
    // let inputs = document.getElementsByTagName('input');
    // for (let i = 0; i < inputs.length; i++) {
    //
    //     inputs[i].classList.add('italic-red-input');
    //
    //     inputs[i].addEventListener('input', function() {
    //         this.classList.remove('italic-red-input');
    //     });
    // }
    register();
});


