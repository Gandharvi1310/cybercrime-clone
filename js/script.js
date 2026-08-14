// ======================================================
// CYBER SAHAYAK - MULTI PAGE COMPLAINT FLOW
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------------------
    // PAGE 1 - COMPLAINANT DETAILS
    // --------------------------------------------------

    const complaintForm =
        document.getElementById("complaint-form");

    const step1 =
        document.getElementById("step-1");

    // Only run this section on complaint.html
    if (complaintForm && step1) {

        const nextButton =
            document.querySelector("#step-1 .next-btn");

        if (nextButton) {

            nextButton.addEventListener("click", () => {

                const fullName =
                    document.getElementById("full-name").value.trim();

                const mobile =
                    document.getElementById("mobile").value.trim();

                const email =
                    document.getElementById("email").value.trim();

                const state =
                    document.getElementById("state").value;

                const district =
                    document.getElementById("district").value.trim();


                // -----------------------------
                // VALIDATION
                // -----------------------------

                if (!fullName) {

                    alert("Please enter your full name.");

                    document.getElementById("full-name").focus();

                    return;
                }


                if (!/^[0-9]{10}$/.test(mobile)) {

                    alert(
                        "Please enter a valid 10-digit mobile number."
                    );

                    document.getElementById("mobile").focus();

                    return;
                }


                if (
                    email &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ) {

                    alert(
                        "Please enter a valid email address."
                    );

                    document.getElementById("email").focus();

                    return;
                }


                if (!state) {

                    alert("Please select your state.");

                    document.getElementById("state").focus();

                    return;
                }


                if (!district) {

                    alert("Please enter your district.");

                    document.getElementById("district").focus();

                    return;
                }


                // -----------------------------
                // SAVE COMPLAINANT DATA
                // -----------------------------

                const complainantData = {

                    fullName: fullName,

                    mobile: mobile,

                    email: email,

                    state: state,

                    district: district

                };


                localStorage.setItem(
                    "cyberSahayakComplainant",
                    JSON.stringify(complainantData)
                );


                // -----------------------------
                // GO TO PAGE 2
                // -----------------------------

                window.location.href =
                    "incident.html";

            });

        }

    }


    // --------------------------------------------------
    // PAGE 2 - INCIDENT DETAILS
    // --------------------------------------------------

    const incidentForm =
        document.getElementById("incident-form");

    if (incidentForm) {

        const nextButton =
            document.getElementById("incident-next");

        const backButton =
            document.getElementById("incident-back");


        // -----------------------------
        // LOAD PREVIOUS DATA
        // -----------------------------

        const savedIncident =
            localStorage.getItem(
                "cyberSahayakIncident"
            );


        if (savedIncident) {

            try {

                const data =
                    JSON.parse(savedIncident);


                if (data.crimeType)
                    document.getElementById("crimeType").value =
                        data.crimeType;

                if (data.incidentDate)
                    document.getElementById("incidentDate").value =
                        data.incidentDate;

                if (data.incidentTime)
                    document.getElementById("incidentTime").value =
                        data.incidentTime;

                if (data.platform)
                    document.getElementById("platform").value =
                        data.platform;

                if (data.amount)
                    document.getElementById("amount").value =
                        data.amount;

                if (data.transactionId)
                    document.getElementById("transactionId").value =
                        data.transactionId;

                if (data.bank)
                    document.getElementById("bank").value =
                        data.bank;

                if (data.fraudAccount)
                    document.getElementById("fraudAccount").value =
                        data.fraudAccount;

                if (data.suspectName)
                    document.getElementById("suspectName").value =
                        data.suspectName;

                if (data.suspectPhone)
                    document.getElementById("suspectPhone").value =
                        data.suspectPhone;

                if (data.suspectProfile)
                    document.getElementById("suspectProfile").value =
                        data.suspectProfile;

                if (data.description)
                    document.getElementById("description").value =
                        data.description;

            } catch (error) {

                console.error(
                    "Could not load incident data:",
                    error
                );

            }

        }


        // -----------------------------
        // BACK TO PAGE 1
        // -----------------------------

        if (backButton) {

            backButton.addEventListener("click", () => {

                window.location.href =
                    "complaint.html";

            });

        }


        // -----------------------------
        // SAVE + NEXT
        // -----------------------------

        if (nextButton) {

            nextButton.addEventListener("click", () => {

                const crimeType =
                    document.getElementById("crimeType").value;

                const incidentDate =
                    document.getElementById("incidentDate").value;

                const description =
                    document
                        .getElementById("description")
                        .value
                        .trim();


                // Required fields

                if (!crimeType) {

                    alert(
                        "Please select the type of cybercrime."
                    );

                    return;
                }


                if (!incidentDate) {

                    alert(
                        "Please select the incident date."
                    );

                    return;
                }


                if (!description) {

                    alert(
                        "Please describe what happened."
                    );

                    return;
                }


                // -----------------------------
                // SAVE INCIDENT DATA
                // -----------------------------

                const incidentData = {

                    crimeType:
                        crimeType,

                    incidentDate:
                        incidentDate,

                    incidentTime:
                        document
                            .getElementById("incidentTime")
                            .value,

                    platform:
                        document
                            .getElementById("platform")
                            .value,

                    amount:
                        document
                            .getElementById("amount")
                            .value,

                    transactionId:
                        document
                            .getElementById("transactionId")
                            .value,

                    bank:
                        document
                            .getElementById("bank")
                            .value,

                    fraudAccount:
                        document
                            .getElementById("fraudAccount")
                            .value,

                    suspectName:
                        document
                            .getElementById("suspectName")
                            .value,

                    suspectPhone:
                        document
                            .getElementById("suspectPhone")
                            .value,

                    suspectProfile:
                        document
                            .getElementById("suspectProfile")
                            .value,

                    description:
                        description

                };


                localStorage.setItem(
                    "cyberSahayakIncident",
                    JSON.stringify(incidentData)
                );


                // -----------------------------
                // GO TO PAGE 3
                // -----------------------------

                window.location.href =
                    "evidence.html";

            });

        }

    }


    // --------------------------------------------------
    // PAGE 3 - EVIDENCE & SUBMIT
    // --------------------------------------------------

    const evidencePage =
        document.getElementById("evidence-page");


    if (evidencePage) {

        console.log(
            "Cyber Sahayak Evidence Page Loaded"
        );

    }

});