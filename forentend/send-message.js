


document.addEventListener("DOMContentLoaded", () => {
    const linkInput = document.getElementById("link-input");
    const searchButton = document.getElementById("search-button");
    const recommendationContainer = document.getElementById("recommendation-container");
    const recommendedUsername = document.getElementById("recommended-username");
    const sendMessageContainer = document.getElementById("send-message-container");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

    linkInput.addEventListener('paste', async (e) => {
        setTimeout(() => {
            validateLink();
        }, 100);
    });

    searchButton.addEventListener("click", () => {
        validateLink();
    });

    async function validateLink() {
        const link = linkInput.value.trim();
        const userId = extractUserIdFromLink(link);

        console.log("Extracted User ID:", userId); // Debugging

        if (userId) {
            try {
                const response = await fetch(`https://anoniymous-messages-server.vercel.app/anonymousMessages/username/${userId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch username: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Fetched username data:", data); // Debugging

                if (data.username) {
                    recommendedUsername.textContent = data.username; // Use `data.username`
                    recommendationContainer.style.display = "block";
                    sendMessageContainer.style.display = "block";

                    sendButton.addEventListener("click", async () => {
                        const message = messageInput.value.trim();
                        if (message) {
                            try {
                                const sendMessageResponse = await fetch(`https://anoniymous-messages-server.vercel.app/anonymousMessages/send/${userId}`, {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ reserverId: userId, message })
                                });

                                if (!sendMessageResponse.ok) {
                                    throw new Error('Failed to send the message.');
                                }

                                const sendMessageData = await sendMessageResponse.json();
                                console.log("Send Message Data:", sendMessageData);

                                if (sendMessageData) {
                                    alert('Message sent successfully!');
                                    messageInput.value = "";
                                } else {
                                    console.error(sendMessageData.message);
                                }
                            } catch (error) {
                                console.error('Fetch error:', error);
                            }
                        } else {
                            alert('Please enter a message.');
                        }
                    });
                } else {
                    console.error('No username data found.');
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        } else {
            alert('Please enter a valid link.');
        }
    }

    function extractUserIdFromLink(link) {
        const urlPattern = /https:\/\/anoniymousmessages.vercel.app\/anonymousMessages\/([a-fA-F0-9]{24})/;
        const match = link.match(urlPattern);
        return match ? match[1] : null;
    }
});
