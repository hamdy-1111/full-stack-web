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







// Get the modal element
var modal = document.getElementById('editModal');

// Get the button that opens the modal
var editBtn = document.getElementById("edit");

// Get the close element that closes the modal
var close = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
editBtn.onclick = function() {
    modal.style.display = "block";
};

// close the modal
close.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
// Get the file input element
var input = document.getElementById('input-image');

// Add an event listener to listen for changes in the input
input.addEventListener('change', function() {
    // Get the selected file
    var file = input.files[0];

    // Create a FileReader object
    var reader = new FileReader();

    // Set up a function to be called when the reader finishes loading the file
    reader.onload = function(event) {
        // Get the data URL of the loaded image
        var imageUrl = event.target.result;

        // Update the src attribute of the img element with the uploaded image
        document.getElementById('uploaded-image').src = imageUrl;
    };

    // Read the selected file as a Data URL
    reader.readAsDataURL(file);
});

