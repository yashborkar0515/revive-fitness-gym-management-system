document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       LOAD DATA FROM LOCAL STORAGE
    ========================================= */

    let members =
        JSON.parse(
            localStorage.getItem("members")
        ) || [];


    let attendance =
        JSON.parse(
            localStorage.getItem("attendance")
        ) || [];


    let payments =
        JSON.parse(
            localStorage.getItem("payments")
        ) || [];



    /* =========================================
       TOTAL MEMBERS
    ========================================= */

    document.getElementById(
        "totalMembers"
    ).textContent = members.length;



    /* =========================================
       ACTIVE MEMBERSHIPS
    ========================================= */

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    let activeMembers = 0;


    members.forEach(function (member) {

        if (!member.expiryDate) {
            return;
        }


        const expiry =
            new Date(member.expiryDate);


        expiry.setHours(0, 0, 0, 0);


        if (expiry >= today) {

            activeMembers++;

        }

    });


    document.getElementById(
        "activeMemberships"
    ).textContent = activeMembers;



    /* =========================================
       TODAY'S ATTENDANCE
    ========================================= */

    const todayString =
        formatDate(today);


    let todayPresent = 0;


    attendance.forEach(function (record) {

        if (
            record.date === todayString &&
            String(record.status).toLowerCase() ===
            "present"
        ) {

            todayPresent++;

        }

    });


    document.getElementById(
        "todayAttendance"
    ).textContent = todayPresent;



    /* =========================================
       ATTENDANCE PERCENTAGE
    ========================================= */

    let attendancePercentage = 0;


    if (members.length > 0) {

        attendancePercentage =
            Math.round(
                (todayPresent / members.length) * 100
            );

    }


    document.getElementById(
        "attendancePercentage"
    ).textContent =
        attendancePercentage +
        "% of members";



    /* =========================================
       MONTHLY REVENUE
    ========================================= */

    const currentMonth =
        today.getMonth();

    const currentYear =
        today.getFullYear();


    let monthlyRevenue = 0;


    payments.forEach(function (payment) {

        if (
            payment.status !== "Paid"
        ) {

            return;

        }


        if (!payment.date) {

            return;

        }


        const paymentDate =
            new Date(payment.date);


        if (
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear
        ) {

            monthlyRevenue +=
                Number(payment.amount) || 0;

        }

    });


    document.getElementById(
        "monthlyRevenue"
    ).textContent =
        "₹" +
        formatIndianNumber(monthlyRevenue);



    /* =========================================
       RECENT MEMBERS
    ========================================= */

    displayRecentMembers();



    /* =========================================
       MEMBERS TABLE
    ========================================= */

    displayMembersTable();



    /* =========================================
       FORMAT DATE
    ========================================= */

    function formatDate(date) {

        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }



    /* =========================================
       FORMAT INDIAN NUMBER
    ========================================= */

    function formatIndianNumber(number) {

        return number.toLocaleString(
            "en-IN"
        );

    }



    /* =========================================
       RECENT MEMBERS
    ========================================= */

    function displayRecentMembers() {

        const container =
            document.getElementById(
                "recentMembers"
            );


        container.innerHTML = "";


        if (members.length === 0) {

            container.innerHTML = `

                <div class="member-row">

                    <div class="member-details">

                        <strong>
                            No members yet
                        </strong>

                        <span>
                            Add a member to see them here.
                        </span>

                    </div>

                </div>

            `;

            return;

        }


        /*
           Show latest 4 members.
        */

        const recent =
            members
                .slice()
                .reverse()
                .slice(0, 4);


        recent.forEach(function (member) {


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "member-row";


            /* Initials */

            const initials =
                getInitials(
                    member.name
                );


            /* Membership status */

            const status =
                getMemberStatus(
                    member
                );


            const statusClass =
                status === "Active"
                    ? "active"
                    : "pending";


            row.innerHTML = `

                <div class="member-avatar">

                    ${initials}

                </div>


                <div class="member-details">

                    <strong>

                        ${member.name || "Unknown"}

                    </strong>


                    <span>

                        ${member.plan || "No Plan"}

                        • Joined

                        ${member.startDate || "N/A"}

                    </span>

                </div>


                <span class="status ${statusClass}">

                    ${status}

                </span>

            `;


            container.appendChild(
                row
            );

        });

    }



    /* =========================================
       MEMBER INITIALS
    ========================================= */

    function getInitials(name) {

        if (!name) {

            return "M";

        }


        const words =
            name.trim().split(" ");


        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();

    }



    /* =========================================
       MEMBER STATUS
    ========================================= */

    function getMemberStatus(member) {

        if (!member.expiryDate) {

            return "Pending";

        }


        const expiry =
            new Date(
                member.expiryDate
            );


        expiry.setHours(0, 0, 0, 0);


        if (expiry >= today) {

            return "Active";

        }


        return "Expired";

    }



    /* =========================================
       GET TRAINER NAME
    ========================================= */

    function getTrainerName(member) {

        /*
         * New members will have trainer
         * information saved directly.
         */

        if (member.trainer) {

            return member.trainer;

        }


        /*
         * If only trainerId is saved,
         * find trainer from trainers list.
         */

        if (member.trainerId) {

            const trainers =
                JSON.parse(
                    localStorage.getItem(
                        "trainers"
                    )
                ) || [];


            const trainer =
                trainers.find(
                    function (item) {

                        return String(item.id) ===
                               String(member.trainerId);

                    }
                );


            if (trainer) {

                return trainer.name;

            }

        }


        return "Not Assigned";

    }



    /* =========================================
       MEMBERS TABLE
    ========================================= */

    function displayMembersTable() {

        const table =
            document.getElementById(
                "membersTableBody"
            );


        table.innerHTML = "";


        if (members.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="8">

                        No members found.

                    </td>

                </tr>

            `;

            return;

        }


        members.forEach(function (member, index) {


            const row =
                document.createElement(
                    "tr"
                );


            const status =
                getMemberStatus(
                    member
                );


            const trainerName =
                getTrainerName(
                    member
                );


            row.innerHTML = `

                <td>

                    ${member.name || "-"}

                </td>


                <td>

                    ${member.phone || "-"}

                </td>


                <td>

                    ${member.plan || "-"}

                </td>


                <td>

                    ${member.startDate || "-"}

                </td>


                <td>

                    ${member.expiryDate || "-"}

                </td>


                <td>

                    ${
                        trainerName === "Not Assigned"
                            ? "Not Assigned"
                            : trainerName
                    }

                </td>


                <td>

                    <span class="status ${
                        status === "Active"
                            ? "active"
                            : "pending"
                    }">

                        ${status}

                    </span>

                </td>


                <td>

                    <button
                        onclick="deleteMember(${index})">

                        Delete

                    </button>

                </td>

            `;


            table.appendChild(
                row
            );

        });

    }



    /* =========================================
       DELETE MEMBER
    ========================================= */

    window.deleteMember =
        function (index) {


            const member =
                members[index];


            if (!member) {

                return;

            }


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete " +
                    member.name +
                    "?"
                );


            if (!confirmDelete) {

                return;

            }


            /*
               Remove member
            */

            members.splice(
                index,
                1
            );


            localStorage.setItem(
                "members",
                JSON.stringify(members)
            );


            /*
               Refresh dashboard
            */

            location.reload();

        };


});