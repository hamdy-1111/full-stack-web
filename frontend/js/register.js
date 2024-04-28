// Function to show error message with SweetAlert
function showDialog(type ,message, title) {
    Swal.fire({
        icon: type,
        title: title,
        text: message,
        customClass: {
            popup: 'swal2-popup-dark',
            title: 'swal2-title-dark',
            content: 'swal2-content-dark',
            confirmButton: 'swal2-confirm-dark soundButton', // Add the class here
        },
        background: 'rgba(0, 0, 0, 0.53)', // Update background color to match your website
        backdrop: 'rgba(0, 0, 0, 0.5)', // Update backdrop color to match your website
        cancelButtonColor: '#6c757d', // Update cancel button color to match your website
        confirmButtonColor: '#dc3545', // Update confirm button color
        didOpen: () => {
            // Add data-sound attribute after the Swal modal is opened
            const confirmBtn = document.querySelector('.swal2-confirm');
            confirmBtn.setAttribute('data-sound', 'clickSoundGroup1');

            // Set up event listener for the confirm button
            confirmBtn.addEventListener('click', function (event) {
                const soundId = this.getAttribute('data-sound');
                if (soundId) {
                    playSound(soundId);
                }
            });
        }
    });
}

// Function to play sound
function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.play();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const signupLink = document.getElementById("signup-link");
    signupLink.addEventListener("click", function () {
        window.location.href = "login.html";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const photoInput = document.getElementById("photo");
    const previewImg = document.getElementById("photo-preview");

    // Add event listener to the image preview
    previewImg.addEventListener("click", function () {
        photoInput.click(); // Trigger click event on file input field
    });

    // Add event listener to handle file selection
    photoInput.addEventListener("change", function () {
        displayPhoto();
    });
});

function displayPhoto() {
    const fileInput = document.getElementById("photo");
    const previewImg = document.getElementById("photo-preview");

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = "block"; // Show the image preview
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}







/* #### start sounds ###### */
document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with the class 'soundButton' and set up event listeners
    var buttons = document.querySelectorAll('.soundButton');
    buttons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            var soundId = this.getAttribute('data-sound');

            // Check if the element has the 'fileLink' class
            var isFileLink = button.classList.contains('fileLink');

            // Play sound if soundId is defined
            if (soundId) {
                if (isFileLink) {
                    event.preventDefault(); // Prevent the default behavior of the link for file links
                    playSound(soundId);

                    // Continue with the default behavior after a delay (e.g., 500 milliseconds)
                    setTimeout(function () {
                        window.location.href = button.getAttribute('href');
                    }, 500);
                } else {
                    playSound(soundId); // Play sound without preventing the default behavior for regular links
                }
            }
            // Your other functionality here
        });
    });
    function playSound(soundId) {
        var audio = document.getElementById(soundId);
        if (audio) {
            audio.play();
        }
    }
});
/* #### end sounds ###### */

/* start header list */
        document.addEventListener('DOMContentLoaded', function () {
            var toggleButton = document.getElementById('toggle-menu');
            var myList = document.getElementById('myList');

            // Toggle the "active" class to control visibility when the button is clicked
            toggleButton.addEventListener('click', function () {
                myList.classList.toggle('active');
            });

            // Close the list when clicking anywhere outside of it
            document.addEventListener('click', function (event) {
                var isClickInside = myList.contains(event.target) || toggleButton.contains(event.target);

                if (!isClickInside) {
                    myList.classList.remove('active');
                }
            });
        });
/* end header list */


document.addEventListener('DOMContentLoaded', function () {
    var scrollTopBtn = document.getElementById('scrollTopBtn');

    // Show or hide the button based on the scroll position
    window.onscroll = function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    };
});

// Function to scroll to the top of the page
function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}

// Function to encrypt data using CryptoJS AES encryption
function encryptData(data) {
    const key = CryptoJS.enc.Utf8.parse('your_secret_key'); // Replace 'your_secret_key' with your actual secret key
    const encryptedData = CryptoJS.AES.encrypt(data, key, { mode: CryptoJS.mode.ECB }).toString();
    return encryptedData;
}





// Event listener for form submission
document.getElementById("signup-form").addEventListener("submit", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get form data
    const formData = new FormData(this);

    // Check if the checkbox is checked
    if (!document.getElementById("invalidCheck3").checked) {
        // Show the error message
        showDialog("error" ,"You must agree to the terms and conditions.", "Agreement Required");
        // Focus on the checkbox for user attention
        document.getElementById("invalidCheck3").focus();
        return; // Stop further execution
    }

    // Check if passwords match
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");
    if (password !== confirmPassword) {
        showDialog("error" ,"Passwords do not match.", "Password Mismatch");
        // Focus on the password field for user attention
        document.getElementById("signupConfirmPassword").focus();
        return; // Stop further execution
    }

    // Construct the body of the HTTP request
    const body = {
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password'),
        photo: "0"
    };

// Make an HTTP POST request to the backend
fetch('/sign-up', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
})
.then(response => {
    if (response.ok) {
        // Parse the response JSON data
        return response.json();
    } else {
        // Handle error response
        throw 'Failed to sign up';
    }
})
.then(data => {
    if(data?.error && data?.error != "no-error") {
        let error = data.error;
        switch( error ) {
            case "user-exists":
                throw "Username already taken try a diffrent one";
            case "email-exists":
                throw "Email is already taken try a diffrent one";
            case "username-too-long":
                throw `username is too long. maximum username length is ${data.max} characters`;
            case "invalid-parameters":
                throw "Bad request sent from client";
        }
    }
    // Check if the response contains the required data
    if (data && data.uuid && data.key) {
        // Set cookies for uuid and key
        document.cookie = `uuid=${data.uuid}; path=/`;
        document.cookie = `key=${data.key}; path=/`;
        // Redirect user to verification page
        window.location.href = 'verify.html';
    } else {
        throw 'UUID and key not received';
    }
})
.catch(error => {
    showDialog('error' ,error, 'Signup Error');
});
});
