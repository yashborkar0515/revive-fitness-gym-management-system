document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("memberForm");
    const message = document.getElementById("message");

    const plan = document.getElementById("plan");
    const startDate = document.getElementById("startDate");
    const expiryDate = document.getElementById("expiryDate");
    const trainerSelect = document.getElementById("trainer");


    /* ===============================
       MEMBERSHIP PLAN AMOUNTS
    =============================== */

    const planAmounts = {
        "Monthly": 1500,
        "Quarterly": 3000,
        "Half Yearly": 7000,
        "Yearly": 12000
    };


    /* ===============================
       LOAD ACTIVE TRAINERS
    =============================== */

    loadTrainers();


    function loadTrainers() {

        if (!trainerSelect) {
            return;
        }

        const trainers =
            JSON.parse(
                localStorage.getItem("trainers")
            ) || [];


        trainerSelect.innerHTML = `
            <option value="">
                Select Trainer
            </option>
        `;


        const activeTrainers =
            trainers.filter(function (trainer) {

                return trainer.status === "Active";

            });


        if (activeTrainers.length === 0) {

            const option =
                document.createElement("option");

            option.value = "";

            option.textContent =
                "No active trainers available";

            option.disabled = true;

            trainerSelect.appendChild(option);

            return;
        }


        activeTrainers.forEach(function (trainer) {

            const option =
                document.createElement("option");


            option.value =
                trainer.id;


            option.textContent =
                trainer.name +
                " - " +
                trainer.specialization;


            trainerSelect.appendChild(option);

        });

    }


    /* ===============================
       AUTOMATIC EXPIRY DATE
    =============================== */

    plan.addEventListener("change", function () {

        if (startDate.value === "") {
            return;
        }

        calculateExpiry();

    });


    startDate.addEventListener("change", function () {

        if (plan.value !== "") {

            calculateExpiry();

        }

    });


    function calculateExpiry() {

        const start =
            new Date(startDate.value);


        if (isNaN(start.getTime())) {

            return;

        }


        let months = 0;


        if (plan.value === "Monthly") {

            months = 1;

        }

        else if (plan.value === "Quarterly") {

            months = 3;

        }

        else if (plan.value === "Half Yearly") {

            months = 6;

        }

        else if (plan.value === "Yearly") {

            months = 12;

        }


        start.setMonth(
            start.getMonth() + months
        );


        const year =
            start.getFullYear();


        const month =
            String(
                start.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                start.getDate()
            ).padStart(2, "0");


        expiryDate.value =
            `${year}-${month}-${day}`;

    }


    /* ===============================
       ADD MEMBER
    =============================== */

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        /* ===============================
           GET MEMBER VALUES
        =============================== */

        const name =
            document.getElementById("name")
                .value.trim();


        const email =
            document.getElementById("email")
                .value.trim();


        const phone =
            document.getElementById("phone")
                .value.trim();


        const age =
            document.getElementById("age")
                .value;


        const gender =
            document.getElementById("gender")
                .value;


        const selectedPlan =
            document.getElementById("plan")
                .value;


        const start =
            document.getElementById("startDate")
                .value;


        const expiry =
            document.getElementById("expiryDate")
                .value;


        const weight =
            document.getElementById("weight")
                .value;


        const height =
            document.getElementById("height")
                .value;


        const username =
            document.getElementById("username")
                .value.trim();


        const password =
            document.getElementById("password")
                .value;


        /* ===============================
           TRAINER INFORMATION
        =============================== */

        let trainerId = "";

        let trainerName = "";

        let trainerSpecialization = "";


        if (trainerSelect) {

            trainerId =
                trainerSelect.value;


            if (trainerId) {

                const trainers =
                    JSON.parse(
                        localStorage.getItem("trainers")
                    ) || [];


                const selectedTrainer =
                    trainers.find(function (trainer) {

                        return String(trainer.id) ===
                               String(trainerId);

                    });


                if (selectedTrainer) {

                    trainerName =
                        selectedTrainer.name;


                    trainerSpecialization =
                        selectedTrainer.specialization;

                }

            }

        }


        /* ===============================
           REQUIRED FIELD CHECK
        =============================== */

        if (
            !name ||
            !email ||
            !phone ||
            !age ||
            !gender ||
            !selectedPlan ||
            !start ||
            !expiry ||
            !username ||
            !password
        ) {

            showMessage(
                "Please fill all required fields.",
                "red"
            );

            return;
        }


        /* ===============================
           LOAD EXISTING MEMBERS
        =============================== */

        let members =
            JSON.parse(
                localStorage.getItem("members")
            ) || [];


        /* ===============================
           CHECK DUPLICATE USERNAME
        =============================== */

        const usernameExists =
            members.some(function (member) {

                return (
                    String(member.username || "")
                        .toLowerCase() ===
                    username.toLowerCase()
                );

            });


        if (usernameExists) {

            showMessage(
                "Username already exists. Please choose another username.",
                "red"
            );

            return;
        }


        /* ===============================
           MEMBERSHIP AMOUNT
        =============================== */

        const amount =
            planAmounts[selectedPlan] || 0;


        /* ===============================
           CREATE MEMBER
        =============================== */

        const newMember = {

            id: Date.now(),

            name: name,

            email: email,

            phone: phone,

            age: age,

            gender: gender,

            plan: selectedPlan,

            amount: amount,

            startDate: start,

            expiryDate: expiry,

            weight: weight,

            height: height,


            /* =========================
               STARTING MEASUREMENTS
            ========================= */

            startingWeight: weight,

            startingHeight: height,


            /* =========================
               LOGIN
            ========================= */

            username: username,

            password: password,


            /* =========================
               TRAINER
            ========================= */

            trainerId: trainerId,

            trainer: trainerName,

            trainerSpecialization:
                trainerSpecialization

        };


        /* ===============================
           SAVE MEMBER
        =============================== */

        members.push(newMember);


        localStorage.setItem(
            "members",
            JSON.stringify(members)
        );


        /* ===============================
           SUCCESS MESSAGE
        =============================== */

        showMessage(
            "Member added successfully!",
            "green"
        );


        form.reset();


        /* ===============================
           RELOAD TRAINERS
        =============================== */

        loadTrainers();


        /* ===============================
           RETURN TO DASHBOARD
        =============================== */

        setTimeout(function () {

            window.location.href =
                "admin-dashboard.html";

        }, 1000);

    });


    /* ===============================
       MESSAGE FUNCTION
    =============================== */

    function showMessage(text, color) {

        message.textContent =
            text;


        message.style.color =
            color;


        message.style.fontWeight =
            "bold";


        message.style.marginTop =
            "15px";

    }

});