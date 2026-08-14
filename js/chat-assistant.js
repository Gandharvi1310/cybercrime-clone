// ============================================================
// COMPLAINT THROUGH CHAT
// Conversational Cybercrime Complaint Assistant
// ============================================================

const chatBody = document.getElementById("chatBody");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const typing = document.getElementById("typing");
const fieldStatus = document.getElementById("fieldStatus");


// ============================================================
// COMPLAINT STATE
// ============================================================

let complaintData = {
    incident_type: "",
    incident_category: "",
    incident_subcategory: "",

    incident_date: "",
    incident_time: "",
    incident_location: "",

    incident_description: "",

    financial_loss: "",
    transaction_date: "",
    transaction_time: "",
    transaction_id: "",

    bank_name: "",
    UPI_ID: "",

    phone_number: "",
    email: "",

    suspicious_url: "",

    suspect_name: "",
    suspect_phone: "",
    suspect_email: "",

    communication_platform: "",

    evidence_available: "",
    evidence_description: "",

    name: "",
    state: "",
    district: "",
    address: "",

    additional_information: ""
};


// ============================================================
// CONVERSATION STATE
// ============================================================

let conversationStarted = false;
let waitingForConfirmation = false;
let confirmationField = null;

let questionsAsked = new Set();


// ============================================================
// MESSAGE UI
// ============================================================

function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = "message " + sender;

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = text;

    message.appendChild(bubble);

    chatBody.appendChild(message);

    chatBody.scrollTop = chatBody.scrollHeight;
}


// ============================================================
// TYPING INDICATOR
// ============================================================

function showTyping(callback, delay = 500) {

    typing.style.display = "block";

    setTimeout(() => {

        typing.style.display = "none";

        callback();

    }, delay);
}


// ============================================================
// SAVE DATA
// ============================================================

function saveComplaintData() {

    localStorage.setItem(
        "cyberComplaintData",
        JSON.stringify(complaintData)
    );

}


// ============================================================
// UPDATE PROGRESS
// ============================================================

function updateProgress() {

    const fields = Object.values(complaintData);

    const completed = fields.filter(
        value => value !== ""
    ).length;

    const total = fields.length;

    const percentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    progressFill.style.width =
        percentage + "%";

    progressText.textContent =
        `${percentage}% information collected`;
}


// ============================================================
// NORMALIZE TEXT
// ============================================================

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[₹,]/g, "")
        .trim();

}


// ============================================================
// EXTRACT MONEY
// ============================================================

function extractAmount(text) {

    const patterns = [
        /₹\s?(\d+(?:\.\d+)?)/i,
        /rs\.?\s?(\d+(?:\.\d+)?)/i,
        /rupees?\s?(\d+(?:\.\d+)?)/i,
        /(\d+(?:\.\d+)?)\s*(?:k|thousand)/i
    ];

    for (const pattern of patterns) {

        const match = text.match(pattern);

        if (match) {

            let amount = parseFloat(match[1]);

            if (
                /k|thousand/i.test(match[0])
            ) {
                amount *= 1000;
            }

            return amount.toString();
        }
    }

    return "";
}


// ============================================================
// EXTRACT PHONE NUMBER
// ============================================================

function extractPhone(text) {

    const match =
        text.match(
            /(?:\+91[\s-]?)?[6-9]\d{9}/
        );

    return match
        ? match[0]
        : "";
}


// ============================================================
// EXTRACT EMAIL
// ============================================================

function extractEmail(text) {

    const match =
        text.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );

    return match
        ? match[0]
        : "";
}


// ============================================================
// EXTRACT UPI ID
// ============================================================

function extractUPI(text) {

    const match =
        text.match(
            /\b[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\b/
        );

    if (
        match &&
        !match[0].includes(".com")
    ) {
        return match[0];
    }

    return "";
}


// ============================================================
// EXTRACT URL
// ============================================================

function extractURL(text) {

    const match =
        text.match(
            /https?:\/\/[^\s]+/i
        );

    return match
        ? match[0]
        : "";
}


// ============================================================
// DETECT PLATFORM
// ============================================================

function detectPlatform(text) {

    const lower =
        normalizeText(text);

    if (lower.includes("whatsapp"))
        return "WhatsApp";

    if (lower.includes("telegram"))
        return "Telegram";

    if (lower.includes("instagram"))
        return "Instagram";

    if (lower.includes("facebook"))
        return "Facebook";

    if (lower.includes("phone call") ||
        lower.includes("call"))
        return "Phone Call";

    if (lower.includes("sms"))
        return "SMS";

    if (lower.includes("email") ||
        lower.includes("mail"))
        return "Email";

    return "";
}


// ============================================================
// DETECT PAYMENT METHOD
// ============================================================

function detectPaymentMethod(text) {

    const lower =
        normalizeText(text);

    if (lower.includes("upi"))
        return "UPI";

    if (lower.includes("phonepe"))
        return "PhonePe";

    if (lower.includes("google pay") ||
        lower.includes("gpay"))
        return "Google Pay";

    if (lower.includes("paytm"))
        return "Paytm";

    if (lower.includes("credit card"))
        return "Credit Card";

    if (lower.includes("debit card"))
        return "Debit Card";

    if (lower.includes("bank transfer"))
        return "Bank Transfer";

    if (lower.includes("net banking"))
        return "Net Banking";

    return "";
}


// ============================================================
// DETECT INCIDENT TYPE
// ============================================================

function detectIncidentType(text) {

    const lower =
        normalizeText(text);

    if (
        lower.includes("upi") ||
        lower.includes("transaction") ||
        lower.includes("money") ||
        lower.includes("paise") ||
        lower.includes("payment") ||
        lower.includes("debit")
    ) {
        return "Financial Fraud";
    }

    if (
        lower.includes("instagram") ||
        lower.includes("facebook") ||
        lower.includes("account hacked") ||
        lower.includes("hack")
    ) {
        return "Account / Social Media Crime";
    }

    if (
        lower.includes("blackmail") ||
        lower.includes("threat")
    ) {
        return "Cyber Harassment / Blackmail";
    }

    if (
        lower.includes("fake website") ||
        lower.includes("phishing") ||
        lower.includes("link")
    ) {
        return "Phishing / Online Scam";
    }

    return "";
}


// ============================================================
// EXTRACT INFORMATION FROM ONE MESSAGE
// ============================================================

function extractInformation(text) {

    const amount =
        extractAmount(text);

    const phone =
        extractPhone(text);

    const email =
        extractEmail(text);

    const upi =
        extractUPI(text);

    const url =
        extractURL(text);

    const platform =
        detectPlatform(text);

    const payment =
        detectPaymentMethod(text);

    const incident =
        detectIncidentType(text);


    if (amount) {
        complaintData.financial_loss =
            amount;
    }

    if (phone) {
        complaintData.phone_number =
            phone;
    }

    if (email) {
        complaintData.email =
            email;
    }

    if (upi) {
        complaintData.UPI_ID =
            upi;
    }

    if (url) {
        complaintData.suspicious_url =
            url;
    }

    if (platform) {
        complaintData.communication_platform =
            platform;
    }

    if (payment) {
        complaintData.incident_subcategory =
            payment;
    }

    if (incident) {
        complaintData.incident_type =
            incident;
    }


    complaintData.incident_description =
        text;

    saveComplaintData();

    updateProgress();
}


// ============================================================
// DETERMINE NEXT QUESTION
// ============================================================

function getNextQuestion() {

    if (!complaintData.incident_description) {

        return {
            field: "incident_description",

            question:
                "Please tell me what happened in your own words. You can type it naturally, in English, Hindi, Hinglish, or Marathi."
        };
    }


    if (!complaintData.incident_date) {

        return {
            field: "incident_date",

            question:
                "Approximately when did this incident happen? You can give an exact date or an approximate date."
        };
    }


    if (
        complaintData.incident_type === "Financial Fraud" &&
        !complaintData.financial_loss
    ) {

        return {
            field: "financial_loss",

            question:
                "Was any money lost? If yes, approximately how much?"
        };
    }


    if (
        complaintData.incident_type === "Financial Fraud" &&
        !complaintData.incident_subcategory
    ) {

        return {
            field: "incident_subcategory",

            question:
                "How was the payment made — UPI, bank transfer, card, wallet, or something else?"
        };
    }


    if (
        complaintData.incident_type === "Financial Fraud" &&
        !complaintData.transaction_id
    ) {

        return {
            field: "transaction_id",

            question:
                "Do you have the transaction ID or UTR number? If you don't have it, just say 'I don't know'."
        };
    }


    if (!complaintData.name) {

        return {
            field: "name",

            question:
                "What is your full name?"
        };
    }


    if (!complaintData.phone_number) {

        return {
            field: "phone_number",

            question:
                "What mobile number should be associated with the complaint?"
        };
    }


    if (!complaintData.state) {

        return {
            field: "state",

            question:
                "Which state did the incident occur in?"
        };
    }


    if (!complaintData.district) {

        return {
            field: "district",

            question:
                "Which district did the incident occur in?"
        };
    }


    return null;
}


// ============================================================
// ASK NEXT QUESTION
// ============================================================

function askNextQuestion() {

    const next =
        getNextQuestion();

    if (!next) {

        finishConversation();

        return;
    }


    if (
        questionsAsked.has(next.field)
    ) {
        return;
    }


    questionsAsked.add(next.field);


    showTyping(() => {

        addMessage(
            next.question,
            "ai"
        );

        fieldStatus.textContent =
            `Collecting: ${next.field}`;

    });
}


// ============================================================
// PROCESS USER ANSWER
// ============================================================

function processAnswer(answer) {

    if (!answer)
        return;


    addMessage(
        answer,
        "user"
    );


    // Extract anything useful from the answer
    extractInformation(answer);


    const next =
        getNextQuestion();


    if (!next) {

        finishConversation();

        return;
    }


    // Save direct answer to current missing field
    if (
        next.field &&
        complaintData[next.field] === ""
    ) {

        // We don't blindly overwrite special fields.
        // Story is already handled by extraction.

        if (
            next.field !== "incident_description"
        ) {

            complaintData[next.field] =
                answer;

            saveComplaintData();

            updateProgress();
        }
    }


    setTimeout(() => {

        askNextQuestion();

    }, 400);
}


// ============================================================
// FINAL REVIEW
// ============================================================

function finishConversation() {

    progressText.textContent =
        "Ready for review";

    progressFill.style.width =
        "100%";

    fieldStatus.textContent =
        "Complaint information prepared for review.";


    showTyping(() => {

        addMessage(
            "I have collected the relevant information. Please review the complaint details before proceeding.",
            "ai"
        );


        const reviewButton =
            document.createElement("button");


        reviewButton.className =
            "btn btn-red";


        reviewButton.textContent =
            "Review Complaint";


        reviewButton.style.marginTop =
            "10px";


        reviewButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "review.html";

            }
        );


        chatBody.appendChild(
            reviewButton
        );


        userInput.disabled =
            true;

        sendBtn.disabled =
            true;

        voiceBtn.disabled =
            true;

    });
}


// ============================================================
// SEND BUTTON
// ============================================================

sendBtn.addEventListener(
    "click",
    () => {

        const answer =
            userInput.value.trim();


        if (!answer)
            return;


        userInput.value = "";


        processAnswer(answer);

    }
);


// ============================================================
// ENTER KEY
// ============================================================

userInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendBtn.click();
        }

    }
);


// ============================================================
// VOICE INPUT
// Browser Speech Recognition
// ============================================================

let recognition = null;

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.lang = "en-IN";


    recognition.onstart = () => {

        voiceBtn.textContent =
            "🔴";

        fieldStatus.textContent =
            "Listening... Speak now.";

    };


    recognition.onresult = event => {

        const transcript =
            event.results[0][0].transcript;


        userInput.value =
            transcript;


        fieldStatus.textContent =
            "Voice captured. Press Send to continue.";

    };


    recognition.onerror = () => {

        voiceBtn.textContent =
            "🎙";

        fieldStatus.textContent =
            "Voice input could not be captured.";

    };


    recognition.onend = () => {

        voiceBtn.textContent =
            "🎙";

    };


    voiceBtn.addEventListener(
        "click",
        () => {

            recognition.start();

        }
    );

} else {

    voiceBtn.addEventListener(
        "click",
        () => {

            addMessage(
                "Voice input is not supported by this browser. Please use Google Chrome or Microsoft Edge.",
                "ai"
            );

        }
    );

}


// ============================================================
// START CHAT
// ============================================================

updateProgress();


addMessage(
    "Hello. Tell me what happened in your own words. You can type or use the microphone. You do not need to know the technical complaint terms.",
    "ai"
);


setTimeout(() => {

    askNextQuestion();

}, 700);