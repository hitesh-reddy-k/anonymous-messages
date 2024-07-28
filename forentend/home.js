document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOMContentLoaded event fired");
    try {
        const response = await fetch("https://anoniymous-messages.vercel.app/anonymousMessages/getMessages", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` // Adjust if using a different method for authentication
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch messages");
        }

        const messages = await response.json();
        displayMessages(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
    }

    document.getElementById("screenshotBtn").addEventListener("click", takeScreenshot);
    document.getElementById("logoutBtn").addEventListener("click", logout);
});

function displayMessages(messages) {
    const messagesContainer = document.querySelector(".messages");
    messagesContainer.innerHTML = ""; 
    if (Array.isArray(messages) && messages.length === 0) {
        messagesContainer.innerHTML = "<p>Go to profile > copy the link > send the link to others</p>";
        return;
    }

    // Reverse the order of the messages to show the latest ones first
    const reversedMessages = messages.reverse();

    reversedMessages.forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.className = "message";

        // Format the date and time
        const date = new Date(message.createdAt);
        const formattedDate = date.toLocaleDateString(); // e.g., 7/20/2024
        const formattedTime = date.toLocaleTimeString(); // e.g., 12:34:56 PM

        messageElement.innerHTML = `
            <h3 class="message-text"><p>${message.message}</p></h3>
            <p class="timestamp">${formattedDate} ${formattedTime}</p>
             <button class="btn" id="screenshotBtn">Take Screenshot</button>
        `;
        messagesContainer.appendChild(messageElement);
    });
}

function takeScreenshot() {
    const messagesContainer = document.querySelector(".messages");
    html2canvas(messagesContainer).then(canvas => {
        const link = document.createElement("a");
        link.download = 'messages-screenshot.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

function confirmDeleteAccount() {
    const confirmation = confirm("Are you sure you want to delete your account permanently?");
    if (confirmation) {
        deleteAccount();
    }
}

document.getElementById("deleteAccountLink").addEventListener("click", confirmDeleteAccount);

async function deleteAccount() {
    try {
        console.log("Initiating account deletion");
        const response = await fetch("https://anoniymous-messages.vercel.app/anonymousMessages/deleteAccount", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        console.log("Delete response:", response);

        if (!response.ok) {
            throw new Error("Account deletion failed");
        }

        localStorage.removeItem("token"); // Remove the token from local storage
        alert("Your account has been deleted successfully.");
        window.location.href = "register.html"; // Redirect to the registration page
    } catch (error) {
        console.error("Error deleting account:", error);
    }
}

function shareOnInstagram(message) {
    const encodedMessage = encodeURIComponent(message);
    const instagramUrl = `Https://ig.me/m/{ig_profile_handle}/?text=${encodedMessage}`;

    window.open(instagramUrl, '_blank');
}
