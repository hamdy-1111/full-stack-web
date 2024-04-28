// Function to show error message with SweetAlert
// type is either error , info or success
function showDialog(type, message, title) {
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
document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.input-area');
    const inputsArray = Array.from(inputs); // Convert NodeList to Array

    inputsArray.forEach(input => {
        input.addEventListener('input', function () {
            // Move to the next input field when a character is entered
            if (this.value && this.nextElementSibling) {
                this.nextElementSibling.focus();
            }
        });

        input.addEventListener('paste', function (event) {
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

document.addEventListener('DOMContentLoaded', function () {
    const inputElement = document.querySelector('.input-area:nth-child(1)');
    inputElement.focus();
});

document.addEventListener('DOMContentLoaded', function () {
    const countdownElement = document.getElementById('countdown');
    const resendButton = document.getElementById('resendButton');

    let secondsLeft = 45; // 3 minutes in seconds

    function updateCountdown() {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (secondsLeft <= 16) {
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




// Event listener for form submission
document.querySelector('.verification').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission
    const otp = getEnteredOTP(); // Get the entered OTP from input fields
    await verifyOTP(otp); // Call the verifyOTP function with the entered OTP
});

// Function to retrieve entered OTP
function getEnteredOTP() {
    // Retrieve the entered OTP from input fields and concatenate them
    return Array.from(document.querySelectorAll('.inputVerify .input-area'))
        .map(input => input.value)
        .join('');
}

// Function to send OTP for verification
async function verifyOTP(otp) {
    try {
        // Get uuid and key from cookies
        const uuid = getCookie('uuid');
        const key = getCookie('key');

        const requestBody = {
            action: 'verify',
            uuid: uuid,
            key: key,
            "otp-code": otp
        };

        const response = await fetch('/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            handleFetchError(response);
        }

        const data = await response.json(); // Assuming backend returns JSON response
        if (data?.error) {
            let error = data.error;
            switch (error) {
                case "otp-code-wrong":
                    throw "You entered wrong OTP code.";
                case "time-out":
                    throw "You 're too late";
                case "something-wrong":
                    throw "Something went wrong";
                case "too-many-trials":
                    throw "Too many trials resend the code and try again";
                case "user-not-registered":
                    throw "User not register. please register in the sign up page";
            }
        }

        // Handle response from backend
        console.log("response:", data);
        // Redirect user to success page or perform other actions
        window.location.href = 'profile.html';
    } catch (error) {
        console.error("Error:", error);
        // Display error message to the user
        showDialog('error', error, 'verification error');
    }
}

// Function to retrieve a specific cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to handle fetch errors
function handleFetchError(response) {
    // Check for specific HTTP error status
    if (response.status === 404) {
        window.location.href = '404.html'; // Redirect to custom error page
    }
    throw "Network response was not ok";
}


function resendOTPCode() {
    const uuid = getCookie('uuid');
    const key = getCookie('key');

    const requestBody = {
        action: 'resend',
        uuid: uuid,
        key: key
    };

    fetch('/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)

    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw "Check your Internet Connection";
        }
    }).then(data => {
        if (data?.error != "no-error") {
            let error = data.error;
            switch (error) {
                case "user-not-registered":
                    throw "User is not register please register in the sign up page"
                case "wait-time":
                    if (data?.wait) {
                        let wait_time = data.wait
                        throw `You can't resend code now wait for ${wait_time} seconds`;
                    }
            }
        }
        if (data?.done == "code-resent") {
            showDialog('success', "Code resent Successfully", 'resend code');
        }

    }).catch(error => {
        showDialog('error', error);
    })
}