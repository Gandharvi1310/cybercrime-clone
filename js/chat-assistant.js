// ============================================================
// CYBER SAHAYAK
// AI-Assisted Cybercrime Complaint Intake Assistant
// File: js/chat-assistant.js
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    // ========================================================
    // CONFIGURATION
    // ========================================================

    const STORAGE_KEY = "cyberChatbotComplaint";

    // ========================================================
    // ELEMENTS
    // ========================================================

    const chatBox =
        document.getElementById("chat-messages");

    const input =
        document.getElementById("chat-input");

    const sendButton =
        document.getElementById("send-btn");

    const micButton =
        document.getElementById("voice-btn");

    const typing =
        document.getElementById("typing");

    const statusText =
        document.getElementById("statusText");

    const progressText =
        document.getElementById("progressText");

    const progressFill =
        document.getElementById("progressFill");

    const reviewPanel =
        document.getElementById("reviewPanel");

    const reviewContent =
        document.getElementById("reviewContent");

    const continueButton =
        document.getElementById("continueComplaint");

    const resetButton =
        document.getElementById("resetChat");


    // ========================================================
    // FIELD OBJECT
    // ========================================================

    function createField(
        value = null,
        source = null,
        confidence = 0,
        status = "MISSING"
    ) {

        return {
            value,
            source,
            confidence,
            status
        };

    }


    // ========================================================
    // INITIAL STATE
    // ========================================================

    function createInitialState() {

        return {

            incident_type:
                createField(),

            incident_category:
                createField(),

            incident_subcategory:
                createField(),

            incident_date:
                createField(),

            incident_time:
                createField(),

            incident_location:
                createField(),

            incident_description:
                createField(),

            financial_loss:
                createField(),

            transaction_date:
                createField(),

            transaction_time:
                createField(),

            transaction_id:
                createField(),

            bank_name:
                createField(),

            payment_method:
                createField(),

            account_related_information:
                createField(),

            UPI_ID:
                createField(),

            phone_number:
                createField(),

            email:
                createField(),

            suspicious_url:
                createField(),

            suspect_name:
                createField(),

            suspect_phone:
                createField(),

            suspect_email:
                createField(),

            suspect_social_media_account:
                createField(),

            communication_platform:
                createField(),

            evidence_available:
                createField(),

            evidence_description:
                createField(),

            full_name:
                createField(),

            state:
                createField(),

            district:
                createField(),

            address:
                createField(),

            additional_information:
                createField(),

            language: "en",

            current_question:
                null,

            current_field:
                null,

            conversation_started:
                false,

            final_review_ready:
                false,

            confirmed:
                false
        };

    }


    // ========================================================
    // LOAD STATE
    // ========================================================

    function loadState() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {

                return createInitialState();

            }

            const parsed =
                JSON.parse(saved);

            return {
                ...createInitialState(),
                ...parsed
            };

        } catch (error) {

            console.error(
                "Could not load chatbot state:",
                error
            );

            return createInitialState();

        }

    }


    const state = loadState();


    // ========================================================
    // SAVE STATE
    // ========================================================

    function saveState() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(state)
            );

        } catch (error) {

            console.error(
                "Could not save chatbot state:",
                error
            );

        }

    }


    // ========================================================
    // SAFETY
    // ========================================================

    const sensitivePatterns = [

        /\botp\b/i,

        /\bone[\s-]?time[\s-]?password\b/i,

        /\bupi[\s-]?pin\b/i,

        /\bpin\s*(number|code)?\b/i,

        /\bcvv\b/i,

        /\bcvc\b/i,

        /\bpassword\b/i,

        /\bpasscode\b/i,

        /\bnet[\s-]?banking[\s-]?password\b/i

    ];


    function containsSensitiveCredential(text) {

        return sensitivePatterns.some(
            pattern => pattern.test(text)
        );

    }


    function sensitiveCredentialResponse() {

        return (
            "Please do not share your OTP, UPI PIN, CVV, " +
            "password or other authentication credentials here. " +
            "I will not record those credentials. " +
            "We can continue preparing the complaint without them."
        );

    }


    // ========================================================
    // LANGUAGE DETECTION
    // ========================================================

    function detectLanguage(text) {

        const value =
            text.toLowerCase();

        const hindiWords = [

            "hai",
            "tha",
            "thi",
            "hua",
            "hui",
            "mujhe",
            "mera",
            "meri",
            "mere",
            "paise",
            "gaya",
            "gayi",
            "kal",
            "aaj",
            "kab",
            "kaise",
            "kya",
            "chahiye",
            "nahi",
            "haan",
            "ji",
            "mujhse",
            "nikal",
            "chale",
            "bheja",
            "bheje"

        ];


        const marathiWords = [

            "mala",
            "majha",
            "majhi",
            "maje",
            "paise",
            "zale",
            "zal",
            "kay",
            "kadhi",
            "kuthe",
            "ahe",
            "aahe",
            "nahi",
            "ho",
            "tumhi",
            "mi",
            "mhanje",
            "kela",
            "kele",
            "gela",
            "geli"

        ];


        let hindiScore = 0;
        let marathiScore = 0;


        hindiWords.forEach(word => {

            if (
                value.includes(
                    word
                )
            ) {

                hindiScore++;

            }

        });


        marathiWords.forEach(word => {

            if (
                value.includes(
                    word
                )
            ) {

                marathiScore++;

            }

        });


        if (
            marathiScore >= 2 &&
            marathiScore > hindiScore
        ) {

            return "mr";

        }


        if (
            hindiScore >= 2
        ) {

            return "hi";

        }


        return "en";

    }


    function setLanguage(text) {

        state.language =
            detectLanguage(text);

        saveState();

    }


    // ========================================================
    // RESPONSE
    // ========================================================

    function response(
        english,
        hindi,
        marathi
    ) {

        if (state.language === "hi") {

            return hindi;

        }

        if (state.language === "mr") {

            return marathi;

        }

        return english;

    }


    // ========================================================
    // FIELD HELPERS
    // ========================================================

    function setField(
        field,
        value,
        source = "user",
        confidence = 1,
        status = "CONFIRMED"
    ) {

        if (!state[field]) {

            state[field] =
                createField();

        }


        state[field] = {

            value,
            source,
            confidence,
            status

        };


        saveState();

    }


    function getValue(field) {

        if (
            state[field] &&
            state[field].value !== null &&
            state[field].value !== undefined &&
            state[field].value !== ""
        ) {

            return state[field].value;

        }

        return null;

    }


    // ========================================================
    // AMOUNT
    // ========================================================

    function extractAmount(text) {

        const normalized =
            text
                .toLowerCase()
                .replace(/,/g, "");


        const patterns = [

            /₹\s*(\d+(?:\.\d+)?)/,

            /\brs\.?\s*(\d+(?:\.\d+)?)/i,

            /\binr\s*(\d+(?:\.\d+)?)/i,

            /(\d+(?:\.\d+)?)\s*(?:rupees|rs)\b/i

        ];


        for (
            const pattern of patterns
        ) {

            const match =
                normalized.match(pattern);

            if (match) {

                return Number(
                    match[1]
                );

            }

        }


        return null;

    }


    // ========================================================
    // PHONE
    // ========================================================

    function extractPhone(text) {

        const match =
            text.match(
                /(?:\+91[\s-]?)?[6-9]\d{9}/
            );

        return match
            ? match[0]
            : null;

    }


    // ========================================================
    // EMAIL
    // ========================================================

    function extractEmail(text) {

        const match =
            text.match(
                /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
            );

        return match
            ? match[0]
            : null;

    }


    // ========================================================
    // URL
    // ========================================================

    function extractURL(text) {

        const match =
            text.match(
                /https?:\/\/[^\s]+/i
            );

        return match
            ? match[0]
            : null;

    }


    // ========================================================
    // UPI ID
    // ========================================================

    function extractUPI(text) {

        const match =
            text.match(
                /\b[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\b/
            );

        return match
            ? match[0]
            : null;

    }


    // ========================================================
    // TRANSACTION ID
    // ========================================================

    function extractTransactionId(text) {

        const match =
            text.match(
                /\b(?:UTR|transaction\s*(?:id|number)?|txn\s*(?:id|number)?)\s*[:#-]?\s*([A-Za-z0-9_-]{6,40})/i
            );

        return match
            ? match[1]
            : null;

    }


    // ========================================================
    // PLATFORM
    // ========================================================

    function detectPlatform(text) {

        const value =
            text.toLowerCase();


        const platforms = [

            ["whatsapp", "WhatsApp"],

            ["instagram", "Instagram"],

            ["facebook", "Facebook"],

            ["telegram", "Telegram"],

            ["sms", "SMS"],

            ["email", "Email"],

            ["gmail", "Email"],

            ["phone call", "Phone Call"],

            ["called me", "Phone Call"],

            ["call", "Phone Call"],

            ["linkedin", "LinkedIn"],

            ["twitter", "X / Twitter"],

            ["x.com", "X / Twitter"],

            ["website", "Website"]

        ];


        for (
            const [keyword, platform]
            of platforms
        ) {

            if (
                value.includes(keyword)
            ) {

                return platform;

            }

        }


        return null;

    }


    // ========================================================
    // CATEGORY
    // ========================================================

    function detectCategory(text) {

        const value =
            text.toLowerCase();


        // Financial fraud

        if (

            value.includes("upi") ||

            value.includes("bank fraud") ||

            value.includes("banking fraud") ||

            value.includes("money stolen") ||

            value.includes("money was taken") ||

            value.includes("paise chale") ||

            value.includes("paise nikal") ||

            value.includes("paise kat") ||

            value.includes("payment fraud") ||

            value.includes("financial fraud") ||

            value.includes("transaction") ||

            value.includes("debit") ||

            value.includes("money deducted") ||

            value.includes("account se paise")

        ) {

            return {

                type: "Financial Fraud",

                category:
                    "Online Financial Fraud"

            };

        }


        // Shopping

        if (

            value.includes("online shopping") ||

            value.includes("fake product") ||

            value.includes("product fraud") ||

            value.includes("shopping scam")

        ) {

            return {

                type: "Cyber Crime",

                category:
                    "Online Shopping Fraud"

            };

        }


        // Investment

        if (

            value.includes("investment") ||

            value.includes("trading scam") ||

            value.includes("crypto scam") ||

            value.includes("stock scam")

        ) {

            return {

                type: "Financial Fraud",

                category:
                    "Investment / Trading Fraud"

            };

        }


        // Social media

        if (

            value.includes("instagram") ||

            value.includes("facebook") ||

            value.includes("social media") ||

            value.includes("account hacked") ||

            value.includes("social media hacked")

        ) {

            return {

                type: "Cyber Crime",

                category:
                    "Social Media / Account Crime"

            };

        }


        // Phishing

        if (

            value.includes("phishing") ||

            value.includes("fake link") ||

            value.includes("suspicious link")

        ) {

            return {

                type: "Cyber Crime",

                category:
                    "Phishing / Online Scam"

            };

        }


        // Harassment

        if (

            value.includes("harassment") ||

            value.includes("blackmail") ||

            value.includes("threat") ||

            value.includes("stalking")

        ) {

            return {

                type: "Cyber Crime",

                category:
                    "Online Harassment / Threat"

            };

        }


        // Identity theft

        if (

            value.includes("identity theft")

        ) {

            return {

                type: "Cyber Crime",

                category:
                    "Identity Theft"

            };

        }


        // Malware

        if (

            value.includes("ransomware") ||

            value.includes("malware") ||

            value.includes("virus")

        ) {

            return {

                type: "Cyber Crime",

                category:
                    "Malware / Ransomware"

            };

        }


        // Generic fraud

        if (

            value.includes("fraud") ||

            value.includes("scam") ||

            value.includes("cheated")

        ) {

            return {

                type: "Cyber Crime",

                category:
                    "Other Cybercrime"

            };

        }


        return null;

    }


    // ========================================================
    // DATE
    // ========================================================

    function extractDate(text) {

        const value =
            text.toLowerCase();

        const today =
            new Date();


        if (
            value.includes("today") ||
            value.includes("aaj")
        ) {

            return formatDate(
                today
            );

        }


        if (

            value.includes("yesterday") ||

            value.includes("kal")

        ) {

            const date =
                new Date(today);

            date.setDate(
                date.getDate() - 1
            );

            return formatDate(
                date
            );

        }


        const match =
            text.match(
                /\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/
            );


        if (!match) {

            return null;

        }


        let year =
            Number(match[3]);


        if (
            year < 100
        ) {

            year += 2000;

        }


        return (
            `${year}-${String(match[2]).padStart(2, "0")}-${String(match[1]).padStart(2, "0")}`
        );

    }


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


        return `${year}-${month}-${day}`;

    }


    // ========================================================
    // TIME
    // ========================================================

    function extractTime(text) {

        const match =
            text.match(
                /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i
            );


        if (!match) {

            return null;

        }


        let hour =
            Number(match[1]);


        const minute =
            match[2]
                ? Number(match[2])
                : 0;


        const modifier =
            match[3]
                ? match[3].toLowerCase()
                : null;


        if (
            modifier === "pm" &&
            hour < 12
        ) {

            hour += 12;

        }


        if (
            modifier === "am" &&
            hour === 12
        ) {

            hour = 0;

        }


        if (
            hour > 23 ||
            minute > 59
        ) {

            return null;

        }


        return (
            `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        );

    }


    // ========================================================
    // BANK
    // ========================================================

    function detectBank(text) {

        const banks = [

            "State Bank of India",
            "SBI",
            "HDFC Bank",
            "HDFC",
            "ICICI Bank",
            "ICICI",
            "Axis Bank",
            "Axis",
            "Kotak Mahindra Bank",
            "Kotak",
            "Bank of Baroda",
            "Punjab National Bank",
            "PNB",
            "Canara Bank",
            "Union Bank",
            "IDFC First Bank",
            "IDFC",
            "IndusInd Bank",
            "Yes Bank"

        ];


        const value =
            text.toLowerCase();


        for (
            const bank of banks
        ) {

            if (
                value.includes(
                    bank.toLowerCase()
                )
            ) {

                return bank;

            }

        }


        return null;

    }


    // ========================================================
    // PAYMENT METHOD
    // ========================================================

    function detectPaymentMethod(text) {

        const value =
            text.toLowerCase();


        if (
            value.includes("upi") ||
            value.includes("gpay") ||
            value.includes("google pay") ||
            value.includes("phonepe") ||
            value.includes("paytm")
        ) {

            return "UPI";

        }


        if (
            value.includes("debit card") ||
            value.includes("credit card") ||
            value.includes("card")
        ) {

            return "Card";

        }


        if (
            value.includes("bank transfer") ||
            value.includes("net banking") ||
            value.includes("bank")
        ) {

            return "Bank Transfer";

        }


        if (
            value.includes("wallet")
        ) {

            return "Wallet";

        }


        return null;

    }


    // ========================================================
    // INFORMATION EXTRACTION
    // ========================================================

    function extractInformation(text) {

        const category =
            detectCategory(text);


        if (category) {

            setField(
                "incident_type",
                category.type,
                "user",
                0.90,
                "CONFIRMED"
            );


            setField(
                "incident_category",
                category.category,
                "user",
                0.90,
                "CONFIRMED"
            );

        }


        const platform =
            detectPlatform(text);


        if (platform) {

            setField(
                "communication_platform",
                platform,
                "user",
                0.98,
                "CONFIRMED"
            );

        }


        const amount =
            extractAmount(text);


        if (amount !== null) {

            setField(
                "financial_loss",
                amount,
                "user",
                0.99,
                "CONFIRMED"
            );

        }


        const payment =
            detectPaymentMethod(text);


        if (payment) {

            setField(
                "payment_method",
                payment,
                "user",
                0.95,
                "CONFIRMED"
            );

        }


        const phone =
            extractPhone(text);


        if (phone) {

            setField(
                "phone_number",
                phone,
                "user",
                0.98,
                "CONFIRMED"
            );

        }


        const email =
            extractEmail(text);


        if (email) {

            setField(
                "email",
                email,
                "user",
                0.98,
                "CONFIRMED"
            );

        }


        const url =
            extractURL(text);


        if (url) {

            setField(
                "suspicious_url",
                url,
                "user",
                0.99,
                "CONFIRMED"
            );

        }


        const upi =
            extractUPI(text);


        if (
            upi &&
            !email
        ) {

            setField(
                "UPI_ID",
                upi,
                "user",
                0.90,
                "NEEDS_CONFIRMATION"
            );

        }


        const transactionId =
            extractTransactionId(text);


        if (transactionId) {

            setField(
                "transaction_id",
                transactionId,
                "user",
                0.95,
                "NEEDS_CONFIRMATION"
            );

        }


        const date =
            extractDate(text);


        if (date) {

            setField(
                "incident_date",
                date,
                "user",
                0.95,
                "CONFIRMED"
            );


            if (
                !getValue(
                    "transaction_date"
                )
            ) {

                setField(
                    "transaction_date",
                    date,
                    "user",
                    0.90,
                    "CONFIRMED"
                );

            }

        }


        const time =
            extractTime(text);


        if (time) {

            setField(
                "incident_time",
                time,
                "user",
                0.85,
                "NEEDS_CONFIRMATION"
            );

        }


        const bank =
            detectBank(text);


        if (bank) {

            setField(
                "bank_name",
                bank,
                "user",
                0.98,
                "CONFIRMED"
            );

        }


        if (
            text.length > 20
        ) {

            const previous =
                getValue(
                    "incident_description"
                );


            if (
                !previous
            ) {

                setField(
                    "incident_description",
                    text,
                    "user",
                    0.85,
                    "CONFIRMED"
                );

            }

        }


        saveState();

    }


    // ========================================================
    // YES / NO / UNKNOWN
    // ========================================================

    function isYes(text) {

        return /^(yes|yeah|yep|haan|ha|ji|ho|हो|होय|yes please|correct|right)$/i
            .test(
                text.trim()
            );

    }


    function isNo(text) {

        return /^(no|nope|nahi|nahin|नहीं|नाही)$/i
            .test(
                text.trim()
            );

    }


    function isUnknown(text) {

        return /^(i don't know|i do not know|don't know|not sure|unknown|pata nahi|malum nahi|mujhe nahi pata|nahi pata)$/i
            .test(
                text.trim()
            );

    }


    // ========================================================
    // PROCESS ANSWER
    // ========================================================

    function processAnswer(text) {

        const field =
            state.current_field;


        if (!field) {

            return;

        }


        if (
            isUnknown(text)
        ) {

            setField(
                field,
                "UNKNOWN",
                "user",
                1,
                "CONFIRMED"
            );

            return;

        }


        if (
            field ===
            "incident_description"
        ) {

            setField(
                field,
                text,
                "user",
                0.95,
                "CONFIRMED"
            );

            return;

        }


        if (
            field ===
            "incident_date"
        ) {

            const date =
                extractDate(text);


            setField(
                field,
                date || text.trim(),
                "user",
                date ? 0.95 : 0.60,
                date
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;

        }


        if (
            field ===
            "incident_time"
        ) {

            const time =
                extractTime(text);


            setField(
                field,
                time || text.trim(),
                "user",
                time ? 0.90 : 0.60,
                time
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;

        }


        if (
            field ===
            "financial_loss"
        ) {

            const amount =
                extractAmount(text);


            if (
                amount !== null
            ) {

                setField(
                    field,
                    amount,
                    "user",
                    0.99,
                    "CONFIRMED"
                );

            } else if (
                /no financial loss|no loss|koi loss nahi|loss nahi/i
                    .test(text)
            ) {

                setField(
                    field,
                    0,
                    "user",
                    1,
                    "CONFIRMED"
                );

            } else {

                setField(
                    field,
                    text.trim(),
                    "user",
                    0.60,
                    "NEEDS_CONFIRMATION"
                );

            }

            return;

        }


        if (
            field ===
            "bank_name"
        ) {

            const bank =
                detectBank(text);


            setField(
                field,
                bank || text.trim(),
                "user",
                bank ? 0.98 : 0.80,
                "CONFIRMED"
            );

            return;

        }


        if (
            field ===
            "payment_method"
        ) {

            const payment =
                detectPaymentMethod(text);


            setField(
                field,
                payment || text.trim(),
                "user",
                payment ? 0.95 : 0.75,
                "CONFIRMED"
            );

            return;

        }


        if (
            field ===
            "transaction_id"
        ) {

            const id =
                extractTransactionId(text);


            setField(
                field,
                id || text.trim(),
                "user",
                id ? 0.95 : 0.70,
                id
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;

        }


        if (
            field ===
            "UPI_ID"
        ) {

            const upi =
                extractUPI(text);


            setField(
                field,
                upi || text.trim(),
                "user",
                upi ? 0.95 : 0.60,
                upi
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;

        }


        if (
            field ===
            "communication_platform"
        ) {

            const platform =
                detectPlatform(text);


            setField(
                field,
                platform || text.trim(),
                "user",
                platform ? 0.98 : 0.70,
                platform
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;

        }


        if (
            field ===
            "suspect_phone"
        ) {

            const phone =
                extractPhone(text);


            setField(
                field,
                phone || text.trim(),
                "user",
                phone ? 0.98 : 0.70,
                phone
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;

        }


        if (
            field ===
            "evidence_available"
        ) {

            if (
                isYes(text)
            ) {

                setField(
                    field,
                    "YES",
                    "user",
                    1,
                    "CONFIRMED"
                );

            } else if (
                isNo(text)
            ) {

                setField(
                    field,
                    "NO",
                    "user",
                    1,
                    "CONFIRMED"
                );

            } else {

                setField(
                    field,
                    text.trim(),
                    "user",
                    0.80,
                    "CONFIRMED"
                );

            }

            return;

        }


        setField(
            field,
            text.trim(),
            "user",
            0.80,
            "CONFIRMED"
        );

    }


    // ========================================================
    // NEXT QUESTION
    // ========================================================

    function getNextQuestion() {

        if (
            !getValue(
                "incident_description"
            )
        ) {

            state.current_field =
                "incident_description";


            return response(

                "Please tell me briefly what happened.",

                "Please mujhe short mein bataiye ki kya hua.",

                "Thodkyat mala sanga ki nemka kay zala."

            );

        }


        if (
            !getValue(
                "incident_category"
            )
        ) {

            state.current_field =
                "incident_category";


            return response(

                "What type of cybercrime do you believe this was? For example, UPI fraud, online shopping fraud, investment scam, social media fraud, phishing, or another cybercrime.",

                "Aapko kya lagta hai kis type ka cybercrime hua? Jaise UPI fraud, online shopping fraud, investment scam, social media fraud ya phishing.",

                "Tumhala kontya prakarcha cybercrime zala ase watate? Udaharanarth UPI fraud, online shopping fraud, investment scam, social media fraud kiwa phishing."

            );

        }


        if (
            !getValue(
                "incident_date"
            )
        ) {

            state.current_field =
                "incident_date";


            return response(

                "Approximately when did the incident happen?",

                "Ye incident approximately kis date ko hua tha?",

                "Ha incident andaje kontya divshi zala?"

            );

        }


        if (
            !getValue(
                "incident_time"
            )
        ) {

            state.current_field =
                "incident_time";


            return response(

                "Do you remember approximately what time it happened? If you don't remember, you can say 'I don't know'.",

                "Approximately kis time hua tha? Agar yaad nahi hai to 'I don't know' bol sakte hain.",

                "Andaje kiti vajta zala hota? Aathavat nasel tar 'I don't know' mhana."

            );

        }


        if (
            getValue(
                "incident_category"
            ) ===
            "Online Financial Fraud"
        ) {


            if (
                !getValue(
                    "financial_loss"
                )
            ) {

                state.current_field =
                    "financial_loss";


                return response(

                    "Approximately how much money was lost? If there was no financial loss, tell me that.",

                    "Approximately kitne paise ka loss hua? Agar financial loss nahi hua to woh bhi bataiye.",

                    "Andaje kiti rupayanchा loss zala? Financial loss nasel tar te sanga."

                );

            }


            if (
                !getValue(
                    "payment_method"
                )
            ) {

                state.current_field =
                    "payment_method";


                return response(

                    "How was the payment made — UPI, bank transfer, card, wallet, or another method?",

                    "Payment kaise kiya gaya tha — UPI, bank transfer, card, wallet ya kisi aur method se?",

                    "Payment kasa kela hota — UPI, bank transfer, card, wallet kiwa dusrya method ne?"

                );

            }


            if (
                !getValue(
                    "bank_name"
                )
            ) {

                state.current_field =
                    "bank_name";


                return response(

                    "Which bank or payment app was involved?",

                    "Kaunsa bank ya payment app involved tha?",

                    "Konta bank kiwa payment app involved hota?"

                );

            }


            if (
                !getValue(
                    "transaction_id"
                )
            ) {

                state.current_field =
                    "transaction_id";


                return response(

                    "Do you have the transaction ID or UTR number? If you don't have it, that's okay.",

                    "Transaction ID ya UTR number hai kya? Nahi hai to koi problem nahi.",

                    "Transaction ID kiwa UTR number aahe ka? Nasel tari chalel."

                );

            }


            if (
                !getValue(
                    "UPI_ID"
                )
            ) {

                state.current_field =
                    "UPI_ID";


                return response(

                    "If a UPI ID or payment identifier is available, you can provide it. Do not share your UPI PIN.",

                    "Agar UPI ID ya payment identifier available hai to bata sakte hain. UPI PIN share mat kijiye.",

                    "UPI ID kiwa payment identifier available asel tar sanga. UPI PIN share karu naka."

                );

            }

        }


        if (
            !getValue(
                "communication_platform"
            )
        ) {

            state.current_field =
                "communication_platform";


            return response(

                "How did the person contact you — WhatsApp, phone call, SMS, email, website, or another platform?",

                "Us person ne aapse WhatsApp, phone call, SMS, email, website ya kisi aur platform se contact kiya tha?",

                "Tya vyaktine WhatsApp, phone call, SMS, email, website kiwa dusrya platform varun contact kela hota?"

            );

        }


        if (
            getValue(
                "incident_category"
            ) ===
            "Online Financial Fraud" &&
            !getValue(
                "suspect_phone"
            )
        ) {

            state.current_field =
                "suspect_phone";


            return response(

                "Do you have the phone number used by the person? If yes, provide it. Do not share OTP or PIN.",

                "Kya aapke paas us person ka phone number hai? Agar hai to bataiye. OTP ya PIN share mat kijiye.",

                "Tya vyakticha phone number aahe ka? Asel tar sanga. OTP kiwa PIN share karu naka."

            );

        }


        if (
            !getValue(
                "evidence_available"
            )
        ) {

            state.current_field =
                "evidence_available";


            return response(

                "Do you have screenshots, messages, emails, receipts, transaction records, or any other evidence?",

                "Kya aapke paas screenshots, messages, emails, receipts, transaction records ya koi aur evidence hai?",

                "Tumchyakade screenshots, messages, emails, receipts, transaction records kiwa kahi evidence aahe ka?"

            );

        }


        state.current_field =
            null;


        return null;

    }


    // ========================================================
    // PROGRESS
    // ========================================================

    function updateProgress() {

        const fields = [

            "incident_description",

            "incident_category",

            "incident_date",

            "incident_time",

            "financial_loss",

            "payment_method",

            "transaction_id",

            "communication_platform",

            "evidence_available"

        ];


        const completed =
            fields.filter(
                field => Boolean(
                    getValue(field)
                )
            ).length;


        const percentage =
            Math.round(
                (
                    completed /
                    fields.length
                ) * 100
            );


        if (progressFill) {

            progressFill.style.width =
                Math.max(
                    5,
                    percentage
                ) + "%";

        }


        if (progressText) {

            progressText.textContent =
                `${percentage}% information collected`;

        }

    }


    // ========================================================
    // CHAT UI
    // ========================================================

    function addMessage(
        message,
        sender = "bot"
    ) {

        if (!chatBox) {

            console.log(
                sender.toUpperCase() +
                ": " +
                message
            );

            return;

        }


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            `chat-message ${sender}`;


        const bubble =
            document.createElement(
                "div"
            );


        bubble.className =
            "message-bubble";


        bubble.textContent =
            message;


        wrapper.appendChild(
            bubble
        );


        chatBox.appendChild(
            wrapper
        );


        chatBox.scrollTop =
            chatBox.scrollHeight;

    }


    function showTyping() {

        if (!typing) {

            return;

        }

        typing.style.display =
            "block";

    }


    function removeTyping() {

        if (!typing) {

            return;

        }

        typing.style.display =
            "none";

    }


    // ========================================================
    // REVIEW
    // ========================================================

    function formatDateForDisplay(date) {

        if (
            !date ||
            date === "UNKNOWN"
        ) {

            return "Not available";

        }


        const parts =
            date.split("-");


        if (
            parts.length === 3
        ) {

            return (
                `${parts[2]}/${parts[1]}/${parts[0]}`
            );

        }


        return date;

    }


    function formatAmount(value) {

        if (
            value === null ||
            value === undefined ||
            value === "UNKNOWN"
        ) {

            return "Not available";

        }


        if (
            Number(value) === 0
        ) {

            return "No financial loss";

        }


        const number =
            Number(value);


        if (
            !Number.isNaN(number)
        ) {

            return (
                `₹${number.toLocaleString("en-IN")}`
            );

        }


        return value;

    }


    function buildReviewObject() {

        return {

            description:
                getValue(
                    "incident_description"
                ) || "Not available",

            category:
                getValue(
                    "incident_category"
                ) || "Not identified",

            date:
                formatDateForDisplay(
                    getValue(
                        "incident_date"
                    )
                ),

            time:
                getValue(
                    "incident_time"
                ) || "Not available",

            amount:
                formatAmount(
                    getValue(
                        "financial_loss"
                    )
                ),

            payment:
                getValue(
                    "payment_method"
                ) || "Not available",

            bank:
                getValue(
                    "bank_name"
                ) || "Not available",

            transaction:
                getValue(
                    "transaction_id"
                ) || "Not available",

            upi:
                getValue(
                    "UPI_ID"
                ) || "Not available",

            platform:
                getValue(
                    "communication_platform"
                ) || "Not available",

            suspectPhone:
                getValue(
                    "suspect_phone"
                ) || "Not available",

            evidence:
                getValue(
                    "evidence_available"
                ) || "Not specified"

        };

    }


    function buildReviewText() {

        const data =
            buildReviewObject();


        return (

            `Complaint Review\n\n` +

            `Incident:\n` +
            `${data.description}\n\n` +

            `Category:\n` +
            `${data.category}\n\n` +

            `Date:\n` +
            `${data.date}\n\n` +

            `Time:\n` +
            `${data.time}\n\n` +

            `Financial Loss:\n` +
            `${data.amount}\n\n` +

            `Payment Method:\n` +
            `${data.payment}\n\n` +

            `Bank / Payment App:\n` +
            `${data.bank}\n\n` +

            `Transaction ID / UTR:\n` +
            `${data.transaction}\n\n` +

            `UPI ID:\n` +
            `${data.upi}\n\n` +

            `Communication Platform:\n` +
            `${data.platform}\n\n` +

            `Suspect Phone:\n` +
            `${data.suspectPhone}\n\n` +

            `Evidence:\n` +
            `${data.evidence}`

        );

    }


    function showReview() {

        const review =
            buildReviewText();


        if (
            reviewContent
        ) {

            reviewContent.textContent =
                review;

        }


        if (
            reviewPanel
        ) {

            reviewPanel.style.display =
                "block";

        }


        state.final_review_ready =
            true;


        saveState();

    }


    // ========================================================
    // AUTO-FILL DATA
    // ========================================================

    function prepareComplaintData() {

        const data = {

            generatedAt:
                new Date().toISOString(),

            chatbotVersion:
                "Cyber Sahayak v3",

            complainant: {

                fullName:
                    getValue(
                        "full_name"
                    ) || "",

                mobile:
                    getValue(
                        "phone_number"
                    ) || "",

                email:
                    getValue(
                        "email"
                    ) || "",

                state:
                    getValue(
                        "state"
                    ) || "",

                district:
                    getValue(
                        "district"
                    ) || "",

                address:
                    getValue(
                        "address"
                    ) || ""

            },

            incident: {

                type:
                    getValue(
                        "incident_type"
                    ) || "",

                category:
                    getValue(
                        "incident_category"
                    ) || "",

                subcategory:
                    getValue(
                        "incident_subcategory"
                    ) || "",

                date:
                    getValue(
                        "incident_date"
                    ) || "",

                time:
                    getValue(
                        "incident_time"
                    ) || "",

                location:
                    getValue(
                        "incident_location"
                    ) || "",

                description:
                    getValue(
                        "incident_description"
                    ) || ""

            },

            financial: {

                loss:
                    getValue(
                        "financial_loss"
                    ) || "",

                paymentMethod:
                    getValue(
                        "payment_method"
                    ) || "",

                transactionId:
                    getValue(
                        "transaction_id"
                    ) || "",

                transactionDate:
                    getValue(
                        "transaction_date"
                    ) || "",

                transactionTime:
                    getValue(
                        "transaction_time"
                    ) || "",

                bank:
                    getValue(
                        "bank_name"
                    ) || "",

                upiId:
                    getValue(
                        "UPI_ID"
                    ) || ""

            },

            suspect: {

                name:
                    getValue(
                        "suspect_name"
                    ) || "",

                phone:
                    getValue(
                        "suspect_phone"
                    ) || "",

                email:
                    getValue(
                        "suspect_email"
                    ) || "",

                socialMedia:
                    getValue(
                        "suspect_social_media_account"
                    ) || ""

            },

            communication: {

                platform:
                    getValue(
                        "communication_platform"
                    ) || "",

                suspiciousUrl:
                    getValue(
                        "suspicious_url"
                    ) || ""

            },

            evidence: {

                available:
                    getValue(
                        "evidence_available"
                    ) || "",

                description:
                    getValue(
                        "evidence_description"
                    ) || ""

            }

        };


        // Main chatbot storage

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                state
            )
        );


        // Complainant compatibility storage

        localStorage.setItem(

            "cyberChatbotComplainant",

            JSON.stringify(
                data.complainant
            )

        );


        // Incident compatibility storage

        localStorage.setItem(

            "cyberChatbotIncident",

            JSON.stringify({

                crimeType:
                    data.incident.category,

                incidentDate:
                    data.incident.date,

                incidentTime:
                    data.incident.time,

                platform:
                    data.communication.platform,

                amount:
                    data.financial.loss,

                transactionId:
                    data.financial.transactionId,

                bank:
                    data.financial.bank,

                paymentMethod:
                    data.financial.paymentMethod,

                upiId:
                    data.financial.upiId,

                suspectName:
                    data.suspect.name,

                suspectPhone:
                    data.suspect.phone,

                suspectProfile:
                    data.suspect.socialMedia,

                description:
                    data.incident.description

            })

        );


        return data;

    }


    // ========================================================
    // HANDLE USER MESSAGE
    // ========================================================

    function handleUserMessage(text) {

        setLanguage(text);


        if (
            state.current_field
        ) {

            processAnswer(text);

        }


        extractInformation(text);


        state.conversation_started =
            true;


        updateProgress();


        saveState();


        const nextQuestion =
            getNextQuestion();


        if (
            nextQuestion
        ) {

            addMessage(
                nextQuestion,
                "bot"
            );

            saveState();

            return;

        }


        // Everything important collected.

        state.final_review_ready =
            true;


        saveState();


        addMessage(

            response(

                "I have collected the relevant information. I will now prepare a review before anything is submitted.",

                "Maine relevant information collect kar li hai. Submit karne se pehle main review dikhaunga.",

                "Mi relevant information collect keli aahe. Submit karnyapurvi mi review dakhaven."

            ),

            "bot"

        );


        setTimeout(() => {

            showReview();


            addMessage(

                response(

                    "Please review the details carefully. Nothing will be submitted automatically.",

                    "Please details carefully review kijiye. Kuch bhi automatically submit nahi hoga.",

                    "Kripaya details carefully review kara. Kahi hi automatically submit honar nahi."

                ),

                "bot"

            );

        }, 500);

    }


    // ========================================================
    // SEND MESSAGE
    // ========================================================

    function sendMessage() {

        if (!input) {

            return;

        }


        const text =
            input.value.trim();


        if (!text) {

            return;

        }


        addMessage(
            text,
            "user"
        );


        input.value =
            "";


        if (
            containsSensitiveCredential(
                text
            )
        ) {

            addMessage(
                sensitiveCredentialResponse(),
                "bot"
            );


            statusText.textContent =
                "Sensitive credentials were not recorded.";


            return;

        }


        showTyping();


        statusText.textContent =
            "Processing your information...";


        setTimeout(() => {

            removeTyping();


            handleUserMessage(
                text
            );


            statusText.textContent =
                "Information is being collected and saved.";

        }, 450);

    }


    // ========================================================
    // BUTTON EVENTS
    // ========================================================

    if (
        sendButton
    ) {

        sendButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                sendMessage();

            }
        );

    }


    if (
        input
    ) {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );

    }


    // ========================================================
    // VOICE RECOGNITION
    // ========================================================

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    let recognition =
        null;


    let isRecording =
        false;


    if (
        SpeechRecognition &&
        micButton
    ) {

        recognition =
            new SpeechRecognition();


        recognition.continuous =
            false;


        recognition.interimResults =
            false;


        recognition.lang =
            "en-IN";


        recognition.onstart =
            () => {

                isRecording =
                    true;


                micButton.classList.add(
                    "recording"
                );


                statusText.textContent =
                    "🎙 Listening... Speak now.";

            };


        recognition.onresult =
            event => {

                const transcript =
                    event.results[0][0]
                        .transcript;


                input.value =
                    transcript;


                statusText.textContent =
                    "Voice captured. Sending...";


                setTimeout(() => {

                    sendMessage();

                }, 150);

            };


        recognition.onerror =
            event => {

                console.warn(
                    "Voice recognition error:",
                    event.error
                );


                statusText.textContent =
                    "Voice recognition failed. You can type instead.";

            };


        recognition.onend =
            () => {

                isRecording =
                    false;


                micButton.classList.remove(
                    "recording"
                );

            };


        micButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (
                    isRecording
                ) {

                    recognition.stop();

                    return;

                }


                try {

                    recognition.start();

                } catch (error) {

                    console.warn(
                        "Speech recognition could not start:",
                        error
                    );

                }

            }
        );

    } else if (
        micButton
    ) {

        micButton.disabled =
            true;


        statusText.textContent =
            "Voice recognition is not supported. Please use Chrome or Edge.";

    }


    // ========================================================
    // CONTINUE TO COMPLAINT FORM
    // ========================================================

    if (
        continueButton
    ) {

        continueButton.addEventListener(
            "click",
            () => {

                prepareComplaintData();


                /*
                 * IMPORTANT:
                 *
                 * Change complaint.html below only if
                 * your manual complaint form has a
                 * different filename.
                 */

                window.location.href =
                    "complaint.html";

            }
        );

    }


    // ========================================================
    // RESET CHAT
    // ========================================================

    if (
        resetButton
    ) {

        resetButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Start a new complaint? Current chatbot data will be cleared."
                    );


                if (
                    !confirmed
                ) {

                    return;

                }


                localStorage.removeItem(
                    STORAGE_KEY
                );


                localStorage.removeItem(
                    "cyberChatbotComplainant"
                );


                localStorage.removeItem(
                    "cyberChatbotIncident"
                );


                window.location.reload();

            }
        );

    }


    // ========================================================
    // START CONVERSATION
    // ========================================================

    function startConversation() {

        if (
            state.conversation_started
        ) {

            const nextQuestion =
                getNextQuestion();


            if (
                nextQuestion
            ) {

                addMessage(

                    response(

                        "Welcome back. We can continue from where we stopped.",

                        "Welcome back. Hum wahi se continue kar sakte hain jahan rukhe the.",

                        "Welcome back. Jithe thamblo hoto tithun continue karu shakto."

                    ),

                    "bot"

                );


                setTimeout(() => {

                    addMessage(
                        nextQuestion,
                        "bot"
                    );

                }, 400);

            }


            updateProgress();

            return;

        }


        state.conversation_started =
            true;


        state.current_field =
            "incident_description";


        saveState();


        setTimeout(() => {

            addMessage(

                response(

                    "Hello. I'm Cyber Sahayak. I'm here to help you prepare your cybercrime complaint step by step. Please tell me briefly what happened. You can type or speak.",

                    "Namaste. Main Cyber Sahayak hoon. Main aapki cybercrime complaint step by step prepare karne mein help karunga. Pehle mujhe short mein bataiye ki kya hua. Aap type ya speak kar sakte hain.",

                    "Namaskar. Mi Cyber Sahayak aahe. Mi tumchi cybercrime complaint step by step prepare karayla madat karen. Pahile thodkyat sanga ki kay zala. Tumhi type kiwa speak karu shakta."

                ),

                "bot"

            );


            setTimeout(() => {

                addMessage(

                    response(

                        'Example: "I received a WhatsApp KYC message and ₹20,000 was deducted from my account."',

                        'Example: "Mere WhatsApp pe KYC ka message aaya aur mere account se ₹20,000 chale gaye."',

                        'Example: "Mala WhatsApp var KYC cha message aala ani majhya account madhun ₹20,000 gele."'

                    ),

                    "bot"

                );

            }, 500);


            updateProgress();

        }, 300);

    }


    // ========================================================
    // DEBUG / DEVELOPMENT API
    // ========================================================

    window.CyberChatbot = {

        getState: () => {

            return JSON.parse(
                JSON.stringify(
                    state
                )
            );

        },


        save: saveState,


        review: () => {

            return buildReviewText();

        },


        prepareComplaint: () => {

            return prepareComplaintData();

        },


        reset: () => {

            localStorage.removeItem(
                STORAGE_KEY
            );

            localStorage.removeItem(
                "cyberChatbotComplainant"
            );

            localStorage.removeItem(
                "cyberChatbotIncident"
            );

            location.reload();

        }

    };


    // ========================================================
    // INITIALIZE
    // ========================================================

    updateProgress();

    startConversation();

});