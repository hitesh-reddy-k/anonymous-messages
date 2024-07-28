document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("password");
    const openEyesImage = document.getElementById("icon");
    const closedEyesImage = document.getElementById("closed-eyes");
    const loginForm = document.getElementById("login-form");

    passwordInput.addEventListener("focus", function() {
        openEyesImage.classList.add("hide");
        closedEyesImage.classList.remove("hide");
    });

    passwordInput.addEventListener("blur", function() {
        openEyesImage.classList.remove("hide");
        closedEyesImage.classList.add("hide");
    });

    document.getElementById('password').addEventListener('input', function() {
        var passwordLength = this.value.length;
        var icon = document.getElementById('closed-eyes');

        var blurValue = Math.min(passwordLength * 1, 5);
        icon.style.filter = 'blur(' + blurValue + 'px)';

        if (passwordLength > 20) {
            icon.style.opacity = '0';
        } else {
            icon.style.opacity = '1';
        }
    });

    loginForm.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('#login').value;
        const password = document.querySelector('#password').value;

        try {
            const response = await fetch('http://localhost:5500/anonymousMessages/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                if (response.status === 400) {
                    // If the response status is 400, handle it as a login failure
                    handleLoginFailure();
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Login response:', result);

            if (result.success) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('userId', result.user.id);
                localStorage.setItem('role', result.user.role);
                localStorage.setItem('username',result.user.username)
                console.log('Stored role in local storage:', result.user.role);

                // Double-check the role in the response
                const storedRole = localStorage.getItem('role');
                console.log('Retrieved role from local storage:', storedRole);

                if (storedRole === 'ADMIN') {
                    console.log('Redirecting to admin page');
                    window.location.href = 'adminHome.html';
                } else {
                    console.log('Redirecting to home page');
                    window.location.href = 'home.html';
                }
            } else {
                console.log('Login failed:', result.message);
                handleLoginFailure();
            }
        } catch (error) {
            console.error('Error during login:', error);
            handleLoginFailure();
        }
    });

    function handleLoginFailure() {
        const icon = document.getElementById('icon');
        icon.classList.add('shake', 'incorrect');

        setTimeout(() => {
            icon.classList.remove('shake', 'incorrect');
        }, 800);
    }
});
