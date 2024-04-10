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