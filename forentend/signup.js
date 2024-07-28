document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signup-form");

    signupForm.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const Username = document.querySelector('#signup-username').value;
        const email = document.querySelector('#signup-email').value;
        const password = document.querySelector('#signup-password').value;
        const conformpassword = document.querySelector('#signup-conformpassword').value;

        try {
            const response = await fetch('https://anonymousmessages-alpha.vercel.app/anonymousMessages/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Username, email, password, conformpassword }),
            });

            const result = await response.json();

            console.log('Signup response:', result);
            if (response.ok && result.success) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('userId', result.user.id);
                localStorage.setItem('role', result.user.role);
                window.location.href = 'home.html';
            } else {
                alert('Sign up failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    });
});
