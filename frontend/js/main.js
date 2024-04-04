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









var design_amni = document.getElementById('design_amni'); // or use another appropriate selector
var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
        design_amni.classList.add('animate');
        observer.disconnect();
    }
});
observer.observe(design_amni);



    var land_cont = document.getElementById('land_cont'); // or use another appropriate selector
var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
        land_cont.classList.add('animate');
        observer.disconnect();
    }
});
observer.observe(land_cont);







document.addEventListener('DOMContentLoaded', function () {
    var servicesSection = document.getElementById('servicesSection');

    var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            servicesSection.classList.add('animate');
            observer.disconnect(); // Stop observing once animation is triggered
        }
    });

    observer.observe(servicesSection);
});





    document.addEventListener('DOMContentLoaded', function () {
        var shuffelList = document.querySelector('.shuffel');
        var boxes = document.querySelectorAll('.box');

        function showCategory(targetCategory) {
            // Toggle active class on clicked li
            shuffelList.querySelectorAll('li').forEach(function (li) {
                li.classList.remove('active-3');
            });

            // Show/hide boxes based on the selected category
            boxes.forEach(function (box) {
                var boxCategory = box.getAttribute('data-category');

                if (targetCategory === 'all' || targetCategory === boxCategory) {
                    box.style.display = 'flex';
                } else {
                    box.style.display = 'none';
                }
            });

            // Find the corresponding li and add the active class
            var targetLi = shuffelList.querySelector('li[data-category="' + targetCategory + '"]');
            if (targetLi) {
                targetLi.classList.add('active-3');
            }
        }

        shuffelList.addEventListener('click', function (event) {
            var targetCategory = event.target.getAttribute('data-category');

            // Trigger showCategory with the clicked category
            showCategory(targetCategory);
        });

        // Trigger a click event on the "All" category to show its elements automatically
        showCategory('all');
    });


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




        document.addEventListener('DOMContentLoaded', function () {
            var landing = document.querySelector('.landing');
            var bullets = document.querySelectorAll('.bullets li');
            var backgroundIndex = 0; // Index of the current background image

            var backgrounds = [
                'url(../images/cool-berlin-wallpaper-83635-wallpaper-preview.jpg)',
                'url(../images/wp12400806.webp)',
                'url(../images/nice.jpg)', // Add your additional background images here
                // Add more background images as needed
            ];

            function changeBackground(direction) {
                if (direction === 'left') {
                    backgroundIndex = (backgroundIndex - 1 + backgrounds.length) % backgrounds.length;
                } else {
                    backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
                }

                landing.style.backgroundImage = backgrounds[backgroundIndex];

                // Remove the "active-2" class from all bullets
                bullets.forEach(function (bullet) {
                    bullet.classList.remove('active-2');
                });

                // Add the "active-2" class to the current bullet
                bullets[backgroundIndex].classList.add('active-2');
            }

            document.querySelector('.fa-angle-left').addEventListener('click', function () {
                changeBackground('left');
            });

            document.querySelector('.fa-angle-right').addEventListener('click', function () {
                changeBackground('right');
            });
        });




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