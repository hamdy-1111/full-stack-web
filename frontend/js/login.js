document.addEventListener("DOMContentLoaded", function () {
    const signupLink = document.getElementById("signup-link");
    const changePwLink = document.getElementById("changePwLink");
    const forgetForm = document.getElementById("forget-form");
    const signinForm = document.getElementById("signin-form");

    signupLink.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "register.html";
    });

    signinForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const requestBody = {
            action: "login",
            username: formData.get('username'),
            password: formData.get('password')
        };
        fetch("/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw "Check your Network Connection";
            }
        }).then(data => {
            let error = data.error;
            switch (error) {
                case "password-user-no-match":
                    console.log("USER ENTERED WRONG PASSWORD");
                    throw "Username or password wrong. try again";
                default:
                    if (error != "no-error") {
                        console.log("This is not supposed to happend something is wrong");
                        throw "Something went wrong";
                    }
                    break;
            }
            if (data.logged_in) {
                const user_uuid = data.uuid;
                const user_key = data.key;
                console.log("UUID: ", user_uuid);
                console.log("KEY: ", user_key);
            } else {
                console.error("SERVER IS SAYING USER DIDN'T LOG IN BUT NO ERROR OCURRED THIS IS WERID AND SHOULDN'T HAPPEN");
            }
        }).catch(error => {
            
        });
    });
    /* Code to be removed إن شاء الله */
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