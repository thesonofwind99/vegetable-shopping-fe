window.onload = function () {
    loadDataToForm()
};
async function loadDataToForm(){
    try {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfor'));
        document.getElementById('user-full-name').placeholder = userInfo.fullname;
        document.getElementById('user-email').placeholder = userInfo.email;
        document.getElementById('user-phone-number').placeholder = userInfo.phoneNumber;
        userInfo.gender === 'male' ? document.getElementById('male').checked : document.getElementById('female').checked;
        document.getElementById('user-day-of-birth').placeholder = userInfo.dayOfBirth;
        document.getElementById('user-address').placeholder = userInfo.address
    } catch (e) {
        console.log(e.message);
    }
}
async function updateAccount() {
    try {
        let formData = new FormData();
        let userId = JSON.parse(sessionStorage.getItem('userInfor')).userId;
        let fullNameValue = document.getElementById('user-full-name').value;
        let emailValue = document.getElementById('user-email').value;
        let phoneNumberValue = document.getElementById('user-phone-number').value;
        let dayOfBirthValue = document.getElementById('user-day-of-birth').value;
        let addressValue = document.getElementById('user-address').value;

        if (fullNameValue.trim() !== "") {
            formData.append('fullname', fullNameValue);
        }
        if (emailValue.trim() !== "") {
            formData.append('email', emailValue);
        }
        if (phoneNumberValue.trim() !== "") {
            formData.append('phoneNumber', phoneNumberValue);
        }
        let genderElement = document.querySelector('input[name="gender"]:checked').value;
        if (genderElement) {
            formData.append('gender', genderElement);
        }
        if (dayOfBirthValue.trim() !== "") {
            formData.append('dayOfBirth', dayOfBirthValue);
        }
        if (addressValue.trim() !== "") {
            formData.append('address', addressValue);
        }


        await axios.put(`http://localhost:8080/api/v1/users/${userId}`, formData, {
            headers: {
                 'Content-Type': 'application/json'
            }
        })
        Swal.fire({
            title: 'Update',
            text: 'Update account successfully',
            icon: 'success',
            button: 'OK'
        })
        setTimeout(function () {
            window.location.href = "/vegetable-shopping/home";
        }, 1000);
    } catch (err) {
        Swal.fire({
            title: 'Update Failed',
            text: err.response.data.message,
            icon: 'error',
            button: 'OK'
        });
    }
}

