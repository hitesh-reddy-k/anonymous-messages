document.addEventListener('DOMContentLoaded', function () {
    const pathArray = window.location.pathname.split('/');
    const reserverId = pathArray[pathArray.length - 1];
    const recommendedUsername = document.getElementById("recommended-username");
    const recommendationContainer = document.getElementById("recommendation-container");
    const sendMessageContainer = document.getElementById("send-message-container");

    console.log("Reserver ID from URL:", reserverId);

    async function fetchUsername(reserverId) {
        try {
            const usernameResponse = await fetch(`http://localhost:5500/anonymousMessages/username/${reserverId}`);
            
            if (!usernameResponse.ok) {
                throw new Error(`Failed to fetch username: ${usernameResponse.statusText}`);
            }

            const data = await usernameResponse.json();
            console.log("Fetched username data:", data); // Debugging

            if (data.username) {
                recommendedUsername.textContent = data.username; // Use `data.username`
                recommendationContainer.style.display = "block";
                sendMessageContainer.style.display = "block";
            } else {
                console.warn("Username not found in the response data.");
            }
        } catch (error) {
            console.error("Error fetching username:", error);
            alert("Server error while fetching username");
        }
    }

    document.getElementById("messageForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const message = document.getElementById("message").value;

        console.log("Message from form:", message);

        if (!message || !reserverId) {
            alert("All fields are required");
            return;
        }

        try {
            // Sending the message
            const response = await fetch(`http://localhost:5500/anonymousMessages/send/${reserverId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ reserverId, message })
            });

            if (response.ok) {
                alert("Message sent successfully!");
                document.getElementById("messageForm").reset();
            } else {
                alert("Failed to send message");
            }

            // Fetching the username
            if (reserverId) {
                await fetchUsername(reserverId);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error");
        }
    });

    document.getElementById("about-link").onclick = function () {
        location.href = "http://127.0.0.1:5500/forentend/login.html";
    };

    // Correctly calling fetchUsername with reserverId
    if (reserverId) {
        fetchUsername(reserverId);
    }
});