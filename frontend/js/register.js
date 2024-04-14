// Function to show error message with SweetAlert
function showError(message, title) {
    Swal.fire({
        icon: 'info',
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


const inputs = document.querySelectorAll(".input-area");

inputs.forEach((input, index) => {
    input.addEventListener("input", function (e) {
        const val = e.target.value;

        if (isNaN(val)) {
            e.target.value = "";
            return;
        }

        if (val != "") {
            const next = input.nextElementSibling;
            if (next) {
                next.focus();
            }
        }
    });

input.addEventListener("keydown", function (e) {
    const key = e.key.toLowerCase();
    const val = e.target.value;
    if (!isNaN(parseInt(key)) && val !== "" && val != "!") {
        if (val) {
            next = input.nextElementSibling;
            const updatedValue = val.slice(0, -1) + key; // Remove the last character and append the pressed key
            e.target.value = updatedValue; // Update the value of the current input field
            next.focus();
        }
    }
        if ((key == "backspace" || key == "delete") && val == "") {
            const prev = input.previousElementSibling;
            if (prev) {
                prev.focus();
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.input-area');
    const inputsArray = Array.from(inputs); // Convert NodeList to Array

    inputsArray.forEach(input => {
        input.addEventListener('input', function() {
            // Move to the next input field when a character is entered
            if (this.value && this.nextElementSibling) {
                this.nextElementSibling.focus();
            }
        });

        input.addEventListener('paste', function(event) {
            event.preventDefault();
            const pastedText = event.clipboardData.getData('text');
            let currentIndex = inputsArray.indexOf(this); // Use inputsArray instead of inputs

            // Loop through each character of the pasted text
            for (let char of pastedText) {
                if (currentIndex >= inputsArray.length) break; // Break if we reach the end of inputs
                inputsArray[currentIndex].value = char;
                currentIndex++;
            }

            // Clear any remaining inputs
            for (let i = currentIndex; i < inputsArray.length; i++) {
                inputsArray[i].value = '';
            }
        });
    });
});

        document.addEventListener('DOMContentLoaded', function() {
            const inputElement = document.querySelector('.input-area:nth-child(1)');
            inputElement.focus();
        });

document.addEventListener('DOMContentLoaded', function() {
    const countdownElement = document.getElementById('countdown');
    const resendButton = document.getElementById('resendButton');
    
    let secondsLeft = 180; // 3 minutes in seconds
    
    function updateCountdown() {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (secondsLeft <= 59) {
            countdownElement.style.color = 'red'; // Change color to red when 2:30 or less
        }
        
        if (secondsLeft === 0) {
            clearInterval(timerInterval);
            resendButton.disabled = false;//###########
            countdownElement.textContent = '0:00';
            countdownElement.style.color = 'gray'; // Change color to gray when 0:00
        } else {
            secondsLeft--;
        }
    }
    
    updateCountdown(); // Initial update
    const timerInterval = setInterval(updateCountdown, 1000); // Update every second
});



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
        showError("You must agree to the terms and conditions.", "Agreement Required");
        // Focus on the checkbox for user attention
        document.getElementById("invalidCheck3").focus();
        return; // Stop further execution
    }

    // Check if passwords match
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");
    if (password !== confirmPassword) {
        showError("Passwords do not match.", "Password Mismatch");
        // Focus on the password field for user attention
        document.getElementById("signupConfirmPassword").focus();
        return; // Stop further execution
    }

    // Construct the body of the HTTP request
    const body = {
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password'),
        verified: false, // Add the "verified" parameter with the value "false"
        // Add other form fields as needed
    };

    // Append the image file to the FormData object
    const photoFile = document.getElementById('photo').files[0];
    if (photoFile) {
        formData.append('photo', photoFile);
    }

    // Make an HTTP POST request to the backend
    fetch('/sign-up', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            // Handle successful response (e.g., redirect user)
            window.location.href = 'verify.html';
        } else {
            // Handle error response
            throw new Error('Failed to sign up');
        }
    })
    .catch(error => {
        console.error('Error signing up:', error);
        // Show error message to the user
        showError('Failed to sign up. Please try again later.', 'Signup Error');
    });
});
