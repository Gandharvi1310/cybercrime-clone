// ============================================================
// CYBER SAHAYAK
// COMPLAINT FORM
// Chatbot -> LocalStorage -> Auto Fill -> Review -> Demo Submit
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    // ========================================================
    // STORAGE
    // ========================================================

    const COMPLAINT_STORAGE_KEY =
        "cyberSahayakComplaint";

    const CHAT_STORAGE_KEY =
        "cyberChatbotComplaint";


    // ========================================================
    // HELPER
    // ========================================================

    function getElement(id) {

        return document.getElementById(id);

    }


    function getValue(id) {

        const element =
            getElement(id);

        if (!element) {
            return "";
        }

        return element.value.trim();

    }


    function setValue(
        id,
        value,
        autoFilled = false
    ) {

        const element =
            getElement(id);

        if (!element) {
            return;
        }

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return;
        }

        element.value =
            value;

        if (autoFilled) {

            element.classList.add(
                "auto-filled"
            );

        }

    }


    // ========================================================
    // SHOW MESSAGE
    // ========================================================

    function showMessage(
        message,
        type = "success"
    ) {

        const box =
            getElement("formMessage");

        if (!box) {
            return;
        }

        box.textContent =
            message;

        box.className =
            `message ${type}`;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function hideMessage() {

        const box =
            getElement("formMessage");

        if (!box) {
            return;
        }

        box.className =
            "message";

        box.textContent =
            "";

    }


    // ========================================================
    // READ CHATBOT DATA
    // ========================================================

    function loadChatbotData() {

        try {

            const saved =
                localStorage.getItem(
                    COMPLAINT_STORAGE_KEY
                );

            if (saved) {

                return JSON.parse(
                    saved
                );

            }

        } catch (error) {

            console.error(
                "Could not read complaint data:",
                error
            );

        }


        // ----------------------------------------------------
        // FALLBACK
        // ----------------------------------------------------

        try {

            const savedChat =
                localStorage.getItem(
                    CHAT_STORAGE_KEY
                );

            if (!savedChat) {
                return null;
            }

            const chatState =
                JSON.parse(
                    savedChat
                );


            function value(field) {

                if (
                    chatState[field] &&
                    chatState[field].value !==
                    undefined
                ) {

                    return chatState[field].value;

                }

                return "";

            }


            return {

                crimeType:
                    value(
                        "incident_category"
                    ),

                incidentType:
                    value(
                        "incident_type"
                    ),

                incidentDate:
                    value(
                        "incident_date"
                    ),

                incidentTime:
                    value(
                        "incident_time"
                    ),

                incidentLocation:
                    value(
                        "incident_location"
                    ),

                description:
                    value(
                        "incident_description"
                    ),

                amount:
                    value(
                        "financial_loss"
                    ),

                transactionId:
                    value(
                        "transaction_id"
                    ),

                transactionDate:
                    value(
                        "transaction_date"
                    ),

                transactionTime:
                    value(
                        "transaction_time"
                    ),

                paymentMethod:
                    value(
                        "UPI_ID"
                    )
                        ? "UPI"
                        : "",

                bank:
                    value(
                        "bank_name"
                    ),

                upiId:
                    value(
                        "UPI_ID"
                    ),

                accountRelated:
                    value(
                        "account_related_information"
                    ),

                suspectName:
                    value(
                        "suspect_name"
                    ),

                suspectPhone:
                    value(
                        "suspect_phone"
                    ),

                suspectEmail:
                    value(
                        "suspect_email"
                    ),

                suspectProfile:
                    value(
                        "suspect_social_media_account"
                    ),

                platform:
                    value(
                        "communication_platform"
                    ),

                suspiciousUrl:
                    value(
                        "suspicious_url"
                    ),

                evidenceAvailable:
                    value(
                        "evidence_available"
                    ),

                evidenceDescription:
                    value(
                        "evidence_description"
                    ),

                fullName:
                    value(
                        "full_name"
                    ),

                mobile:
                    value(
                        "phone_number"
                    ),

                email:
                    value(
                        "email"
                    ),

                state:
                    value(
                        "state"
                    ),

                district:
                    value(
                        "district"
                    ),

                address:
                    value(
                        "address"
                    ),

                additionalInformation:
                    value(
                        "additional_information"
                    )

            };

        } catch (error) {

            console.error(
                "Could not read chatbot state:",
                error
            );

            return null;

        }

    }


    // ========================================================
    // AUTOFILL
    // ========================================================

    function autoFillForm() {

        const data =
            loadChatbotData();

        if (!data) {

            showMessage(
                "No chatbot information was found. You can fill the complaint form manually.",
                "error"
            );

            return;

        }


        let filled =
            0;


        const fields = {

            crimeType:
                data.crimeType,

            incidentType:
                data.incidentType,

            incidentDate:
                data.incidentDate,

            incidentTime:
                data.incidentTime,

            incidentLocation:
                data.incidentLocation,

            description:
                data.description,

            amount:
                data.amount,

            transactionId:
                data.transactionId,

            transactionDate:
                data.transactionDate,

            transactionTime:
                data.transactionTime,

            paymentMethod:
                data.paymentMethod,

            bank:
                data.bank,

            upiId:
                data.upiId,

            accountRelated:
                data.accountRelated,

            suspectName:
                data.suspectName,

            suspectPhone:
                data.suspectPhone,

            suspectEmail:
                data.suspectEmail,

            suspectProfile:
                data.suspectProfile,

            platform:
                data.platform,

            suspiciousUrl:
                data.suspiciousUrl,

            evidenceAvailable:
                data.evidenceAvailable,

            evidenceDescription:
                data.evidenceDescription,

            fullName:
                data.fullName,

            mobile:
                data.mobile,

            email:
                data.email,

            state:
                data.state,

            district:
                data.district,

            address:
                data.address,

            additionalInformation:
                data.additionalInformation

        };


        Object.entries(fields)
            .forEach(
                ([id, value]) => {

                    if (
                        value !== null &&
                        value !== undefined &&
                        value !== ""
                    ) {

                        setValue(
                            id,
                            value,
                            true
                        );

                        filled++;

                    }

                }
            );


        if (filled > 0) {

            showMessage(
                `${filled} field(s) were automatically filled from Cyber Sahayak. Please review and correct them if necessary.`,
                "success"
            );

        }

    }


    // ========================================================
    // COLLECT FORM DATA
    // ========================================================

    function collectFormData() {

        return {

            crimeType:
                getValue(
                    "crimeType"
                ),

            incidentType:
                getValue(
                    "incidentType"
                ),

            incidentDate:
                getValue(
                    "incidentDate"
                ),

            incidentTime:
                getValue(
                    "incidentTime"
                ),

            incidentLocation:
                getValue(
                    "incidentLocation"
                ),

            description:
                getValue(
                    "description"
                ),

            amount:
                getValue(
                    "amount"
                ),

            transactionId:
                getValue(
                    "transactionId"
                ),

            transactionDate:
                getValue(
                    "transactionDate"
                ),

            transactionTime:
                getValue(
                    "transactionTime"
                ),

            paymentMethod:
                getValue(
                    "paymentMethod"
                ),

            bank:
                getValue(
                    "bank"
                ),

            upiId:
                getValue(
                    "upiId"
                ),

            accountRelated:
                getValue(
                    "accountRelated"
                ),

            suspectName:
                getValue(
                    "suspectName"
                ),

            suspectPhone:
                getValue(
                    "suspectPhone"
                ),

            suspectEmail:
                getValue(
                    "suspectEmail"
                ),

            suspectProfile:
                getValue(
                    "suspectProfile"
                ),

            platform:
                getValue(
                    "platform"
                ),

            suspiciousUrl:
                getValue(
                    "suspiciousUrl"
                ),

            evidenceAvailable:
                getValue(
                    "evidenceAvailable"
                ),

            evidenceDescription:
                getValue(
                    "evidenceDescription"
                ),

            fullName:
                getValue(
                    "fullName"
                ),

            mobile:
                getValue(
                    "mobile"
                ),

            email:
                getValue(
                    "email"
                ),

            state:
                getValue(
                    "state"
                ),

            district:
                getValue(
                    "district"
                ),

            address:
                getValue(
                    "address"
                ),

            additionalInformation:
                getValue(
                    "additionalInformation"
                )

        };

    }


    // ========================================================
    // VALIDATION
    // ========================================================

    function validateForm(data) {

        const errors = [];


        if (!data.crimeType) {

            errors.push(
                "Please select the crime type."
            );

        }


        if (!data.description) {

            errors.push(
                "Please provide an incident description."
            );

        }


        if (!data.fullName) {

            errors.push(
                "Please enter your full name."
            );

        }


        if (!data.mobile) {

            errors.push(
                "Please enter your mobile number."
            );

        } else {

            const cleanMobile =
                data.mobile.replace(
                    /\D/g,
                    ""
                );


            if (
                cleanMobile.length !== 10 &&
                cleanMobile.length !== 12
            ) {

                errors.push(
                    "Please enter a valid mobile number."
                );

            }

        }


        if (!data.state) {

            errors.push(
                "Please enter your state."
            );

        }


        if (data.email) {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    data.email
                )
            ) {

                errors.push(
                    "Please enter a valid email address."
                );

            }

        }


        if (data.amount) {

            if (
                Number(data.amount) < 0
            ) {

                errors.push(
                    "Financial loss cannot be negative."
                );

            }

        }


        if (data.suspiciousUrl) {

            try {

                new URL(
                    data.suspiciousUrl
                );

            } catch {

                errors.push(
                    "Please enter a valid suspicious URL."
                );

            }

        }


        return errors;

    }


    // ========================================================
    // SAVE FORM
    // ========================================================

    function saveFormData(data) {

        const complaintData = {

            ...data,

            generatedAt:
                new Date().toISOString(),

            source:
                "Cyber Sahayak Complaint Form",

            demo:
                true

        };


        localStorage.setItem(

            COMPLAINT_STORAGE_KEY,

            JSON.stringify(
                complaintData
            )

        );


        return complaintData;

    }


    // ========================================================
    // REVIEW
    // ========================================================

    function createReview(data) {

        const amount =
            data.amount
                ? `₹${Number(data.amount).toLocaleString("en-IN")}`
                : "Not provided";


        return (

            "COMPLAINT REVIEW\n\n" +

            "INCIDENT DETAILS\n" +
            "------------------------------\n" +

            `Crime Type: ${
                data.crimeType || "Not provided"
            }\n` +

            `Incident Type: ${
                data.incidentType || "Not provided"
            }\n` +

            `Date: ${
                data.incidentDate || "Not provided"
            }\n` +

            `Time: ${
                data.incidentTime || "Not provided"
            }\n` +

            `Location: ${
                data.incidentLocation || "Not provided"
            }\n\n` +


            "FINANCIAL DETAILS\n" +
            "------------------------------\n" +

            `Financial Loss: ${amount}\n` +

            `Bank / Payment App: ${
                data.bank || "Not provided"
            }\n` +

            `Payment Method: ${
                data.paymentMethod || "Not provided"
            }\n` +

            `Transaction ID / UTR: ${
                data.transactionId || "Not provided"
            }\n` +

            `Transaction Date: ${
                data.transactionDate || "Not provided"
            }\n` +

            `Transaction Time: ${
                data.transactionTime || "Not provided"
            }\n` +

            `UPI ID: ${
                data.upiId || "Not provided"
            }\n\n` +


            "SUSPECT / CONTACT\n" +
            "------------------------------\n" +

            `Platform: ${
                data.platform || "Not provided"
            }\n` +

            `Suspect Name: ${
                data.suspectName || "Not provided"
            }\n` +

            `Suspect Phone: ${
                data.suspectPhone || "Not provided"
            }\n` +

            `Suspect Email: ${
                data.suspectEmail || "Not provided"
            }\n` +

            `Suspect Profile: ${
                data.suspectProfile || "Not provided"
            }\n` +

            `Suspicious URL: ${
                data.suspiciousUrl || "Not provided"
            }\n\n` +


            "EVIDENCE\n" +
            "------------------------------\n" +

            `Evidence Available: ${
                data.evidenceAvailable || "Not provided"
            }\n` +

            `Evidence Description: ${
                data.evidenceDescription || "Not provided"
            }\n\n` +


            "COMPLAINANT\n" +
            "------------------------------\n" +

            `Name: ${
                data.fullName || "Not provided"
            }\n` +

            `Mobile: ${
                data.mobile || "Not provided"
            }\n` +

            `Email: ${
                data.email || "Not provided"
            }\n` +

            `State: ${
                data.state || "Not provided"
            }\n` +

            `District: ${
                data.district || "Not provided"
            }\n` +

            `Address: ${
                data.address || "Not provided"
            }\n\n` +


            "INCIDENT DESCRIPTION\n" +
            "------------------------------\n" +

            `${
                data.description ||
                "Not provided"
            }\n\n` +


            "ADDITIONAL INFORMATION\n" +
            "------------------------------\n" +

            `${
                data.additionalInformation ||
                "Not provided"
            }`

        );

    }


    // ========================================================
    // REVIEW BUTTON
    // ========================================================

    function reviewComplaint() {

        hideMessage();


        const data =
            collectFormData();


        const errors =
            validateForm(
                data
            );


        if (errors.length > 0) {

            showMessage(
                errors.join(" "),
                "error"
            );

            return;

        }


        saveFormData(
            data
        );


        const reviewBox =
            getElement(
                "reviewBox"
            );


        const reviewContent =
            getElement(
                "reviewContent"
            );


        if (
            reviewBox &&
            reviewContent
        ) {

            reviewContent.textContent =
                createReview(
                    data
                );

            reviewBox.classList.add(
                "active"
            );


            reviewBox.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    // ========================================================
    // DEMO SUBMISSION
    // ========================================================

    function submitDemoComplaint() {

        const data =
            collectFormData();


        const errors =
            validateForm(
                data
            );


        if (errors.length > 0) {

            showMessage(
                errors.join(" "),
                "error"
            );

            return;

        }


        saveFormData(
            data
        );


        const now =
            new Date();


        const randomNumber =
            Math.floor(
                100000 +
                Math.random() *
                900000
            );


        const reference =
            `CYBER-DEMO-${now.getFullYear()}-${randomNumber}`;


        localStorage.setItem(

            "cyberSahayakDemoReference",

            reference

        );


        const referenceBox =
            getElement(
                "referenceBox"
            );


        const referenceNumber =
            getElement(
                "referenceNumber"
            );


        if (
            referenceBox &&
            referenceNumber
        ) {

            referenceNumber.textContent =
                reference;

            referenceBox.classList.add(
                "active"
            );


            referenceBox.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }


        showMessage(
            "Demo complaint prepared successfully. No real complaint was submitted.",
            "success"
        );

    }


    // ========================================================
    // CLEAR FORM
    // ========================================================

    function clearForm() {

        const confirmed =
            window.confirm(
                "Are you sure you want to clear the complaint form?"
            );


        if (!confirmed) {
            return;
        }


        const inputs =
            document.querySelectorAll(
                "input, textarea, select"
            );


        inputs.forEach(
            element => {

                element.value = "";

                element.classList.remove(
                    "auto-filled"
                );

            }
        );


        const reviewBox =
            getElement(
                "reviewBox"
            );


        if (reviewBox) {

            reviewBox.classList.remove(
                "active"
            );

        }


        const referenceBox =
            getElement(
                "referenceBox"
            );


        if (referenceBox) {

            referenceBox.classList.remove(
                "active"
            );

        }


        localStorage.removeItem(
            COMPLAINT_STORAGE_KEY
        );


        showMessage(
            "Complaint form has been cleared.",
            "success"
        );

    }


    // ========================================================
    // BACK TO CHAT
    // ========================================================

    function backToChat() {

        window.location.href =
            "chatbot.html";

    }


    // ========================================================
    // EDIT REVIEW
    // ========================================================

    function editComplaint() {

        const reviewBox =
            getElement(
                "reviewBox"
            );


        if (reviewBox) {

            reviewBox.classList.remove(
                "active"
            );

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // ========================================================
    // BUTTON EVENTS
    // ========================================================

    const reviewButton =
        getElement(
            "reviewComplaint"
        );


    if (reviewButton) {

        reviewButton.addEventListener(
            "click",
            reviewComplaint
        );

    }


    const submitButton =
        getElement(
            "submitComplaint"
        );


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            submitDemoComplaint
        );

    }


    const clearButton =
        getElement(
            "clearForm"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearForm
        );

    }


    const backButton =
        getElement(
            "backToChat"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            backToChat
        );

    }


    const editButton =
        getElement(
            "editComplaint"
        );


    if (editButton) {

        editButton.addEventListener(
            "click",
            editComplaint
        );

    }


    // ========================================================
    // PREVENT SENSITIVE INFORMATION
    // ========================================================

    const sensitivePatterns = [

        /\botp\b/i,

        /\bupi\s*pin\b/i,

        /\bcvv\b/i,

        /\bpassword\b/i,

        /\bpasscode\b/i

    ];


    document
        .querySelectorAll(
            "input, textarea"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "input",
                    () => {

                        const value =
                            element.value;


                        const detected =
                            sensitivePatterns.some(
                                pattern =>
                                    pattern.test(
                                        value
                                    )
                            );


                        if (detected) {

                            element.value = "";


                            showMessage(

                                "For your safety, do not enter OTP, UPI PIN, CVV, password or other authentication credentials.",

                                "error"

                            );

                        }

                    }
                );

            }
        );


    // ========================================================
    // AUTOSAVE WHEN USER EDITS
    // ========================================================

    document
        .querySelectorAll(
            "input, textarea, select"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "change",
                    () => {

                        const data =
                            collectFormData();


                        localStorage.setItem(

                            COMPLAINT_STORAGE_KEY,

                            JSON.stringify({

                                ...data,

                                source:
                                    "Cyber Sahayak Complaint Form",

                                demo:
                                    true,

                                lastEdited:
                                    new Date()
                                        .toISOString()

                            })

                        );

                    }
                );

            }
        );


    // ========================================================
    // INITIALIZE
    // ========================================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const autoFill =
        params.get(
            "autofill"
        );


    if (
        autoFill === "true"
    ) {

        setTimeout(
            autoFillForm,
            200
        );

    } else {

        // Load previously saved data
        // when user directly opens complaint page.

        const saved =
            loadChatbotData();


        if (saved) {

            const hasData =
                Object.values(saved)
                    .some(
                        value =>
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                    );


            if (hasData) {

                setTimeout(
                    autoFillForm,
                    200
                );

            }

        }

    }


    // ========================================================
    // GLOBAL API
    // ========================================================

    window.CyberComplaint = {

        getData:
            collectFormData,

        validate:
            () =>
                validateForm(
                    collectFormData()
                ),

        save:
            () =>
                saveFormData(
                    collectFormData()
                ),

        review:
            reviewComplaint,

        submitDemo:
            submitDemoComplaint,

        clear:
            clearForm,

        autoFill:
            autoFillForm

    };

});