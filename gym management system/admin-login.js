document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("adminLoginForm");

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const message =
        document.getElementById("message");


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        /* =========================
           ADMIN LOGIN DETAILS
        ========================= */

        const adminUsername = "admin";
        const adminPassword = "admin123";


        /* =========================
           CHECK LOGIN
        ========================= */

        if (
            username === adminUsername &&
            password === adminPassword
        ) {

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );


            window.location.href =
                "admin-dashboard.html";

        }

        else {

            message.textContent =
                "Invalid username or password.";

            message.style.color = "red";

        }

    });

});