document.addEventListener("DOMContentLoaded", function () {
    const signinLink = document.getElementById("signin-link");
    const changePwLink = document.getElementById("changePwLink");
    const forgetForm = document.getElementById("forget-form");
    const signinForm = document.getElementById("signin-form"); 
    signinLink.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "register.html";
    });
    changePwLink.addEventListener("click", function (event) {
        event.preventDefault();
        showForm(forgetForm);
        hideForm(signinForm);
    });
    function showForm(form) {
        form.style.display = "block";
    }

    function hideForm(form) {
        form.style.display = "none";
    }
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