window.getAllUser();

async function getAllUser(page = 0, size = 10) {
    try {
        let {data: response} = await axios.get(`http://localhost:8080/api/v1/users?page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let users = response.content;
        let result = '';
        users.forEach(item => {
            let genderDisplay = item.gender ? 'Male' : 'Female';
            let activeDisplay = item.active ? 'Active' : 'InActive';
            result += `
                        <tr class="odd">
                            <td class="align-middle">${item.userId}</td>
                            <td class="align-middle">${item.username}</td>
                            <td class="align-middle">${item.fullname}</td>
                            <td class="align-middle">${item.email}</td>
                            <td class="align-middle">${item.phoneNumber}</td>
                            <td class="align-middle">${genderDisplay}</td>
                            <td class="align-middle">${activeDisplay}</td>
                            <td class="align-middle" id="tooltip-container2">
                                <a id="account-table-edit-${item.userId}" class="me-3 text-primary mx-1" data-bs-toggle="modal" data-bs-target="#accountModal"><i class="fa-solid fa-pencil"></i></a>
                            </td>
                        </tr>
                       `;
        })
        document.getElementById('account-table').innerHTML = result;

        let accountPage = '';
        for (let i = 0; i < response.totalPages; i++) {
            accountPage += `
                <li class="page-item ${i === response.number ? 'active' : ''}">
                    <a class="page-link" onclick="getAllUser(${i}, ${size})">${i + 1}</a>
                </li>
            `;
        }

        document.getElementById('account-pageable').innerHTML = `
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-end">
                    ${accountPage}
                </ul>
            </nav>
        `;

        users.forEach(item => {
            // edit account
            let categoryEdit = document.getElementById(`account-table-edit-${item.userId}`);
            categoryEdit.addEventListener('click', async () => {
                try {
                    let {data: response} = await axios.get(`http://localhost:8080/api/v1/users/user-id/${item.userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    document.getElementById('user-id').value = response.userId;
                    document.getElementById('full-name').value = response.fullname;
                    document.getElementById('phone-number').value = response.phoneNumber;
                    document.getElementById('email').value = response.email;
                    document.getElementById('day-of-birth').value = response.dayOfBirth;
                    document.getElementById('password').disabled = true;
                    document.getElementById('user-address').value = response.address;
                    if(response.gender.toLowerCase() === "Male"){
                        document.getElementById('gender-male').checked = true;
                    }else if(response.gender.toLowerCase() === "Female"){
                        document.getElementById('gender-female').checked = true;
                    }
                    if(response.active){
                        document.getElementById('active-yes').checked = true;
                    }else{
                        document.getElementById('active-no').checked = true;
                    }

                    document.getElementById('admin-yes').checked = true;

                } catch (error) {
                    Swal.fire({
                        title: 'Account',
                        text: 'Load account to form failed',
                        icon: 'warning',
                        button: 'Oke'
                    });
                }
            })
        });
    } catch (error) {
    }
}

document.getElementById('save-account').addEventListener('click',
    function (e) {
    saveAccount();
    })

async function saveAccount() {
    try {
        let userRequest = {
            fullname: document.getElementById('full-name').value,
            phoneNumber: document.getElementById('phone-number').value,
            email: document.getElementById('email').value,
            dayOfBirth: document.getElementById('day-of-birth').value,
            password: document.getElementById('password').value,
            address: document.getElementById('user-address').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            active: document.querySelector('input[name="active"]:checked').value
        };

        let role = document.querySelector('input[name="role"]:checked').value;

        let accountRequestWithRole = {
            userRequest: userRequest,
            role: role
        };

        await axios.post('http://localhost:8080/api/v1/users/saveWithRole', accountRequestWithRole, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        Swal.fire({
            title: 'Account',
            text: 'Create account successfully',
            icon: 'success',
            button: 'Oke'
        });
    } catch (error) {
        Swal.fire({
            title: 'Account',
            text: 'Create account not successfully',
            icon: 'error',
            button: 'Oke'
        });
    }
}

document.getElementById('reset-account').addEventListener('click', function(v) {
    v.preventDefault();
    resetFormAccount();
})
function resetFormAccount() {
    document.getElementById('user-id').value = null;
    document.getElementById('full-name').value = null;
    document.getElementById('phone-number').value = null;
    document.getElementById('email').value = null;
    document.getElementById('day-of-birth').value = null;
    document.getElementById('password').value = null;
    document.getElementById('user-address').value = null;
    document.getElementById('gender-male').checked = true;
    document.getElementById('active-yes').checked = true;
    document.getElementById('admin-yes').checked = true;
}

// document.getElementById('create-account').addEventListener('click', () => {
//     document.getElementById('save-account').disabled = true;
// });




