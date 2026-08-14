// ======================================================
// CYBER CHATBOT - MULTI PAGE COMPLAINT FLOW
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // PAGE 1 - COMPLAINANT DETAILS
    // ==================================================

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

                // -----------------------------
                // GET FORM VALUES
                // -----------------------------

                const fullName =
                    document
                        .getElementById("full-name")
                        .value
                        .trim();

                const mobile =
                    document
                        .getElementById("mobile")
                        .value
                        .trim();

                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();

                const state =
                    document
                        .getElementById("state")
                        .value;

                const district =
                    document
                        .getElementById("district")
                        .value
                        .trim();


                // -----------------------------
                // VALIDATION
                // -----------------------------

                if (!fullName) {

                    alert(
                        "Please enter your full name."
                    );

                    document
                        .getElementById("full-name")
                        .focus();

                    return;
                }


                if (!/^[0-9]{10}$/.test(mobile)) {

                    alert(
                        "Please enter a valid 10-digit mobile number."
                    );

                    document
                        .getElementById("mobile")
                        .focus();

                    return;
                }


                if (
                    email &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ) {

                    alert(
                        "Please enter a valid email address."
                    );

                    document
                        .getElementById("email")
                        .focus();

                    return;
                }


                if (!state) {

                    alert(
                        "Please select your state."
                    );

                    document
                        .getElementById("state")
                        .focus();

                    return;
                }


                if (!district) {

                    alert(
                        "Please enter your district."
                    );

                    document
                        .getElementById("district")
                        .focus();

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
                    "cyberChatbotComplainant",
                    JSON.stringify(complainantData)
                );


                console.log(
                    "Complainant data saved:",
                    complainantData
                );


                // -----------------------------
                // GO TO PAGE 2
                // -----------------------------

                window.location.href =
                    "incident.html";

            });

        }

    }


    // ==================================================
    // PAGE 2 - INCIDENT DETAILS
    // ==================================================

    const incidentForm =
        document.getElementById("incident-form");


    if (incidentForm) {

        const nextButton =
            document.getElementById("incident-next");

        const backButton =
            document.getElementById("incident-back");


        // -----------------------------
        // LOAD PREVIOUS INCIDENT DATA
        // -----------------------------

        const savedIncident =
            localStorage.getItem(
                "cyberChatbotIncident"
            );


        if (savedIncident) {

            try {

                const data =
                    JSON.parse(savedIncident);


                // Crime type

                const crimeTypeElement =
                    document.getElementById("crimeType");

                if (
                    crimeTypeElement &&
                    data.crimeType
                ) {

                    crimeTypeElement.value =
                        data.crimeType;

                }


                // Incident date

                const incidentDateElement =
                    document.getElementById("incidentDate");

                if (
                    incidentDateElement &&
                    data.incidentDate
                ) {

                    incidentDateElement.value =
                        data.incidentDate;

                }


                // Incident time

                const incidentTimeElement =
                    document.getElementById("incidentTime");

                if (
                    incidentTimeElement &&
                    data.incidentTime
                ) {

                    incidentTimeElement.value =
                        data.incidentTime;

                }


                // Platform

                const platformElement =
                    document.getElementById("platform");

                if (
                    platformElement &&
                    data.platform
                ) {

                    platformElement.value =
                        data.platform;

                }


                // Amount

                const amountElement =
                    document.getElementById("amount");

                if (
                    amountElement &&
                    data.amount
                ) {

                    amountElement.value =
                        data.amount;

                }


                // Transaction ID

                const transactionIdElement =
                    document.getElementById("transactionId");

                if (
                    transactionIdElement &&
                    data.transactionId
                ) {

                    transactionIdElement.value =
                        data.transactionId;

                }


                // Bank

                const bankElement =
                    document.getElementById("bank");

                if (
                    bankElement &&
                    data.bank
                ) {

                    bankElement.value =
                        data.bank;

                }


                // Fraud account

                const fraudAccountElement =
                    document.getElementById("fraudAccount");

                if (
                    fraudAccountElement &&
                    data.fraudAccount
                ) {

                    fraudAccountElement.value =
                        data.fraudAccount;

                }


                // Suspect name

                const suspectNameElement =
                    document.getElementById("suspectName");

                if (
                    suspectNameElement &&
                    data.suspectName
                ) {

                    suspectNameElement.value =
                        data.suspectName;

                }


                // Suspect phone

                const suspectPhoneElement =
                    document.getElementById("suspectPhone");

                if (
                    suspectPhoneElement &&
                    data.suspectPhone
                ) {

                    suspectPhoneElement.value =
                        data.suspectPhone;

                }


                // Suspect profile

                const suspectProfileElement =
                    document.getElementById("suspectProfile");

                if (
                    suspectProfileElement &&
                    data.suspectProfile
                ) {

                    suspectProfileElement.value =
                        data.suspectProfile;

                }


                // Description

                const descriptionElement =
                    document.getElementById("description");

                if (
                    descriptionElement &&
                    data.description
                ) {

                    descriptionElement.value =
                        data.description;

                }


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

            backButton.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "complaint.html";

                }
            );

        }


        // -----------------------------
        // SAVE + NEXT
        // -----------------------------

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                () => {

                    // -------------------------
                    // REQUIRED FIELDS
                    // -------------------------

                    const crimeType =
                        document
                            .getElementById("crimeType")
                            .value;

                    const incidentDate =
                        document
                            .getElementById("incidentDate")
                            .value;

                    const description =
                        document
                            .getElementById("description")
                            .value
                            .trim();


                    // -------------------------
                    // VALIDATE CRIME TYPE
                    // -------------------------

                    if (!crimeType) {

                        alert(
                            "Please select the type of cybercrime."
                        );

                        document
                            .getElementById("crimeType")
                            .focus();

                        return;
                    }


                    // -------------------------
                    // VALIDATE INCIDENT DATE
                    // -------------------------

                    if (!incidentDate) {

                        alert(
                            "Please select the incident date."
                        );

                        document
                            .getElementById("incidentDate")
                            .focus();

                        return;
                    }


                    // -------------------------
                    // VALIDATE DESCRIPTION
                    // -------------------------

                    if (!description) {

                        alert(
                            "Please describe what happened."
                        );

                        document
                            .getElementById("description")
                            .focus();

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


                    // -----------------------------
                    // SAVE TO LOCAL STORAGE
                    // -----------------------------

                    localStorage.setItem(
                        "cyberChatbotIncident",
                        JSON.stringify(incidentData)
                    );


                    console.log(
                        "Incident data saved:",
                        incidentData
                    );


                    // -----------------------------
                    // GO TO PAGE 3
                    // -----------------------------

                    window.location.href =
                        "evidence.html";

                }
            );

        }

    }


    // ==================================================
    // PAGE 3 - EVIDENCE & SUBMIT
    // ==================================================

    const evidencePage =
        document.getElementById("evidence-page");


    if (evidencePage) {

        console.log(
            "Cyber Chatbot Evidence Page Loaded"
        );


        // -----------------------------
        // LOAD COMPLAINANT DATA
        // -----------------------------

        const savedComplainant =
            localStorage.getItem(
                "cyberChatbotComplainant"
            );


        if (savedComplainant) {

            try {

                const complainantData =
                    JSON.parse(savedComplainant);

                console.log(
                    "Complainant data available:",
                    complainantData
                );

            } catch (error) {

                console.error(
                    "Could not read complainant data:",
                    error
                );

            }

        }


        // -----------------------------
        // LOAD INCIDENT DATA
        // -----------------------------

        const savedIncident =
            localStorage.getItem(
                "cyberChatbotIncident"
            );


        if (savedIncident) {

            try {

                const incidentData =
                    JSON.parse(savedIncident);

                console.log(
                    "Incident data available:",
                    incidentData
                );

            } catch (error) {

                console.error(
                    "Could not read incident data:",
                    error
                );

            }

        }

    }


    // ==================================================
    // ACCESSIBILITY - FONT SIZE CONTROLS
    // ==================================================

    const decreaseFont =
        document.querySelector(
            "[data-font-decrease]"
        );

    const resetFont =
        document.querySelector(
            "[data-font-reset]"
        );

    const increaseFont =
        document.querySelector(
            "[data-font-increase]"
        );


    let currentFontSize =
        parseInt(
            localStorage.getItem(
                "cyberChatbotFontSize"
            )
        ) || 100;


    function applyFontSize() {

        document.documentElement.style.fontSize =
            currentFontSize + "%";

        localStorage.setItem(
            "cyberChatbotFontSize",
            currentFontSize
        );

    }


    if (decreaseFont) {

        decreaseFont.addEventListener(
            "click",
            () => {

                if (currentFontSize > 80) {

                    currentFontSize -= 10;

                    applyFontSize();

                }

            }
        );

    }


    if (resetFont) {

        resetFont.addEventListener(
            "click",
            () => {

                currentFontSize = 100;

                applyFontSize();

            }
        );

    }


    if (increaseFont) {

        increaseFont.addEventListener(
            "click",
            () => {

                if (currentFontSize < 130) {

                    currentFontSize += 10;

                    applyFontSize();

                }

            }
        );

    }


    // Apply saved font size

    applyFontSize();


    // ==================================================
    // MOBILE NAVIGATION
    // ==================================================

    const menuToggle =
        document.querySelector(".menu-toggle");

    const navLinks =
        document.querySelector(".nav-links");


    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    navLinks.classList.toggle(
                        "open"
                    );


                menuToggle.setAttribute(
                    "aria-expanded",
                    isOpen
                );

            }
        );

    }


    // ==================================================
    // NAVIGATION DROPDOWN
    // ==================================================

    const dropdownButton =
        document.querySelector(".nav-top");

    const dropdown =
        document.querySelector(".dropdown");


    if (dropdownButton && dropdown) {

        dropdownButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    dropdown.classList.toggle(
                        "open"
                    );


                dropdownButton.setAttribute(
                    "aria-expanded",
                    isOpen
                );

            }
        );

    }

});