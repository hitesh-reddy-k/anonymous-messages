

document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth * 100;
    const y = e.clientY / window.innerHeight * 100;
    document.body.style.background = `linear-gradient(${x}deg, #2d3748, #1a202c)`;
});

function getToken() {
    return localStorage.getItem('token') || '';
}

document.addEventListener("DOMContentLoaded", async function() {
    const username = document.getElementById("name");
    const email = document.getElementById("email");
    const anonLink = document.getElementById("anon-link");
    const messagesList = document.getElementById("messages-list");
    const editButton = document.getElementById("edit-button");
    const saveButton = document.getElementById("save-button");
    const copyLinkButton = document.getElementById("copy-link-button");

    if (!username || !email || !anonLink || !messagesList || !editButton || !saveButton || !copyLinkButton) {
        console.error("One or more required elements are missing.");
        return;
    }

    try {
        const response = await fetch("https://anoniymous-messages-server.vercel.app/anonymousMessages/me", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        if (data.success) {
            // Populate the form with user data
            username.value = data.users.Username;
            email.value = data.users.email;
            anonLink.value = `https://anoniymous-messages-server.vercel.app/anonymousMessages/${data.users._id}`;

            const messagesResponse = await fetch("https://anoniymous-messages-server.vercel.app/anonymousMessages/getMessages", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!messagesResponse.ok) {
                throw new Error('Network response was not ok.');
            }

            const messagesData = await messagesResponse.json();
            // messagesData.forEach(message => {
            //     const li = document.createElement('li');
            //     li.textContent = message.message;
            //     messagesList.appendChild(li);
            // });
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
});

document.getElementById("edit-button").addEventListener("click", () => {
    document.getElementById("profile-title").innerText = "Update Your Profile";
    document.getElementById("name").removeAttribute("readonly");
    document.getElementById("email").removeAttribute("readonly");

    document.getElementById("edit-button").style.display = "none";
    document.getElementById("save-button").style.display = "inline";
});

document.getElementById("save-button").addEventListener("click", async () => {
    const username = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const bio = document.getElementById("bio") ? document.getElementById("bio").value : ''; // Check if bio exists

    try {
        const response = await fetch("https://anoniymous-messages-server.vercel.app/anonymousMessages/updateUsername", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ Username: username })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
console.log(data); // Add this line to inspect the response
if (data.success) {
    alert('Profile updated successfully!');
    document.getElementById("edit-button").style.display = "inline";
    document.getElementById("save-button").style.display = "none";

    // Make inputs read-only again
    document.getElementById("name").setAttribute("readonly", true);
    document.getElementById("email").setAttribute("readonly", true);
    if (document.getElementById("bio")) document.getElementById("bio").setAttribute("readonly", true);

    // Change heading back to "Profile"
    document.getElementById("profile-title").innerText = "Your Profile";
} else {
    console.error(data.message);
    alert('Error: ' + data.message);
}

    } catch (error) {
        console.error('Fetch error:', error);
    }
});

document.getElementById("copy-link-button").addEventListener("click", () => {
    const anonLink = document.getElementById("anon-link");
    navigator.clipboard.writeText(anonLink.value).then(() => {
        alert("Link copied to clipboard!");
    }).catch(err => {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        anonLink.select();
        document.execCommand("copy");
        alert("Link copied to clipboard!");
    });
});
