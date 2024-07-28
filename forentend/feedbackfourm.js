document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedback-form');

    feedbackForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userId = document.getElementById('userId').value;
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const comment = document.getElementById('comment').value;

        if (comment.split(' ').length < 10) {
            alert('Feedback must be at least 10 words.');
            return;
        }

        try {
           const response = await fetch('https://anoniymous-messages.vercel.app/anonymousMessages/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
                },
                body: JSON.stringify({ userId, rating, comment })
            });

            const result = await response.json();

            if (result.success) {
                alert('Feedback submitted successfully.');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error during feedback submission:', error);
            alert('An error occurred. Please try again.');
        }
    });
});








