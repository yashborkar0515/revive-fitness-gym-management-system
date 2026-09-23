const adminForm = document.getElementById("adminLoginForm");

adminForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username =
        document.getElementById("adminUsername").value.trim();

    const password =
        document.getElementById("adminPassword").value.trim();


    if (username === "admin" && password === "admin123") {

        window.location.href = "admin-dashboard.html";

    } else {

        alert("Invalid username or password.");

    }

});
