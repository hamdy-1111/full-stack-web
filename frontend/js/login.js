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
