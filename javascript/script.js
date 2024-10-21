// Function to open modal
function openModal(modal) {
    modal.style.display = 'block';
}

// Function to close modal
function closeModal(modal) {
    modal.style.display = 'none';
}

// Event listeners for modal buttons
document.getElementById('loginButton').addEventListener('click', () => {
    openModal(document.getElementById('loginForm'));
});

document.getElementById('registerButton').addEventListener('click', () => {
    openModal(document.getElementById('registerForm'));
});

// Close modal when clicking on close button
document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', () => {
        closeModal(button.closest('.modal'));
    });
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});

// Function to handle registration
document.getElementById('registerSubmit').addEventListener('click', () => {
    const registrationData = {
        firstName: document.getElementById('registerFirstName').value.trim(),
        lastName: document.getElementById('registerLastName').value.trim(),
        email: document.getElementById('registerEmail').value.trim(),
        phone: document.getElementById('registerPhone').value.trim(),
        username: document.getElementById('registerUsername').value.trim(),
        password: document.getElementById('registerPassword').value,
        confirmPassword: document.getElementById('registerConfirmPassword').value
    };

    // Basic form validation
    if (!isRegistrationValid(registrationData)) return;

    // Send data to the backend for registration
    registerUser(registrationData);
});
document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const formData = {
        firstName: document.getElementById("registerFirstName").value,
        lastName: document.getElementById("registerLastName").value,
        email: document.getElementById("registerEmail").value,
        phone: document.getElementById("registerPhone").value,
        username: document.getElementById("registerUsername").value,
        password: document.getElementById("registerPassword").value,
        confirmPassword: document.getElementById("registerConfirmPassword").value
    };

    // Send the request using fetch
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Set the content type to JSON
        },
        body: JSON.stringify(formData) // Convert form data to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json(); // Assuming your server responds with JSON
    })
    .then(data => {
        console.log("Success:", data);
        // Handle success (e.g., redirect, display success message)
    })
    .catch(error => {
        console.error("Error:", error);
        // Handle error (e.g., display error message)
    });
});

// Validate registration data
function isRegistrationValid(data) {
    const { firstName, lastName, email, phone, username, password, confirmPassword } = data;
    if (!firstName || !lastName || !email || !phone || !username || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return false;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }
    return true;
}

// Function to register user (send data to the backend)
function registerUser({ firstName, lastName, email, phone, username, password }) {
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone, username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
            closeModal(document.getElementById('registerForm'));
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    const { firstName, lastName, email, phone, username, password, confirmPassword } = req.body;

    // Perform your registration logic here

    // Send a response
    res.json({ message: "Registration successful!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Function to handle login
document.getElementById('loginSubmit').addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Basic form validation
    if (!username || !password) {
        alert('Please fill in both username and password.');
        return;
    }

    // Send login data to the backend
    loginUser(username, password);
});

// Function to login user (send data to the backend)
function loginUser(username, password) {
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful!');
            closeModal(document.getElementById('loginForm'));
            window.location.href = '/dashboard'; // Replace with actual page
        } else {
            alert('Invalid username or password.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

// Function to populate memberships on page load
function populateMemberships() {
    fetch('/memberships')
        .then(response => response.json())
        .then(data => {
            const membershipsList = document.getElementById('membershipsList');
            membershipsList.innerHTML = ''; // Clear existing memberships

            data.forEach(membership => {
                const membershipCard = createMembershipCard(membership);
                membershipsList.appendChild(membershipCard);
            });
        })
        .catch(error => {
            console.error('Error loading memberships:', error);
        });
}

// Function to create a membership card
function createMembershipCard(membership) {
    const membershipCard = document.createElement('div');
    membershipCard.className = 'membership-card';

    const membershipTitle = document.createElement('h3');
    membershipTitle.textContent = membership.name;

    const membershipDescription = document.createElement('p');
    membershipDescription.textContent = membership.description;

    const applyButton = document.createElement('button');
    applyButton.className = 'applyButton';
    applyButton.innerHTML = '<i class="fas fa-check"></i> Apply Now';
    applyButton.addEventListener('click', () => applyForMembership(membership.id));

    membershipCard.appendChild(membershipTitle);
    membershipCard.appendChild(membershipDescription);
    membershipCard.appendChild(applyButton);

    return membershipCard;
}

// Function to apply for a membership
function applyForMembership(membershipId) {
    fetch('/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membership_id: membershipId })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.success ? 'You have successfully applied for the membership!' : 'Failed to apply for membership.');
    })
    .catch(error => {
        console.error('Error applying for membership:', error);
    });
}

// Populate memberships on page load
document.addEventListener('DOMContentLoaded', populateMemberships);