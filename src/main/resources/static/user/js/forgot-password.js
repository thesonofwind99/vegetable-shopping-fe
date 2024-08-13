document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn form gửi yêu cầu HTTP mặc định

    const email = document.getElementById('user-email').value;

    fetch('http://localhost:8080/api/v1/users/forgot-password', { // URL của backend API
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // hoặc 'application/json' nếu bạn gửi JSON
        },
        body: new URLSearchParams({
            'email': email
        })
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // In ra phản hồi từ backend (ví dụ: 'Password reset link sent to your email.')
        })
        .catch(error => console.error('Error:', error));
});
