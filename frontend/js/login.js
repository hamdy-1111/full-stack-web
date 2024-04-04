document.addEventListener("DOMContentLoaded", function () {
    const signinForm = document.getElementById("signin-form");
    const signupForm = document.getElementById("signup-form");
    const signinLink = document.getElementById("signin-link");
    const signupLink = document.getElementById("signup-link");

    signinLink.addEventListener("click", function (event) {
        event.preventDefault();
        showForm(signupForm);
        hideForm(signinForm);
        console.log('clicked')
    });

    signupLink.addEventListener("click", function (event) {
        event.preventDefault();
        showForm(signinForm);
        hideForm(signupForm);
    });

    function showForm(form) {
        form.style.display = "block";
    }

    function hideForm(form) {
        form.style.display = "none";
    }
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