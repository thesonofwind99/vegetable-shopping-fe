
// change password

let userInfo = JSON.parse(sessionStorage.getItem('userInfor'));

async function changePassword() {
   try {
       let userId = userInfo.userId;
       let formData = new FormData();
       let oldPassword = document.getElementById('old-user-password').value;
       let newPassword = document.getElementById('user-password').value;
       formData.append('oldPassword', oldPassword);
       formData.append('newPassword', newPassword);
       await axios.put(`http://localhost:8080/api/v1/auth/${userId}`,formData, {
           headers: {
               "Content-Type": "application/json"
           }
       } )
       validateRegister();
       Swal.fire({
           title: 'Change password',
           text: 'Change password successfully',
           icon: 'success',
           button: 'OK'
       });
       setTimeout(function () {
           window.location.href = "/vegetable-shopping/home";
       }, 1000);
   } catch (err) {
       Swal.fire({
           title: 'Change password Failed',
           text: err.response.data.message,
           icon: 'error',
           button: 'OK'
       });
   }
}

function validateRegister() {
    let oldPassword = document.getElementById('old-user-password').value;
    let password = document.getElementById('user-password').value;
    let confirmPassword = document.getElementById('user-ConfirmPassword').value;
    if (password !== confirmPassword) {
        document.getElementById('password-message').textContent = "Passwords not match!";
    }
    if (oldPassword === "") {
        document.getElementById('old-user-password').placeholder = "Please enter your old password";
    }
    if (password.trim() === "") {
        document.getElementById('user-password').placeholder = "Password must be at least 8 characters";
    }
    if (confirmPassword.trim() === "") {
        document.getElementById('user-ConfirmPassword').placeholder = "Please enter a confirmation password";
        return;
    }
}

document.getElementById('change-password').addEventListener('click', function (e) {
    let inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {

        inputs[i].classList.add('italic-red-input');

        inputs[i].addEventListener('input', function() {
            this.classList.remove('italic-red-input');
        });
    }
    changePassword();
});
