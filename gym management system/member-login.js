document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const inputs = form.querySelectorAll("input");

        const username = inputs[0].value.trim();
        const password = inputs[1].value.trim();

        const members = JSON.parse(localStorage.getItem("members")) || [];

        const member = members.find(function (m) {
            return m.username === username &&
                   m.password === password;
        });

        if (member) {

            localStorage.setItem(
                "loggedInMember",
                JSON.stringify(member)
            );

            // CHANGE THIS ONLY IF YOUR DASHBOARD HAS A DIFFERENT NAME
            window.location.href = "member-dashboard.html";

        } else {

            alert("Invalid username or password");

        }

    });

});