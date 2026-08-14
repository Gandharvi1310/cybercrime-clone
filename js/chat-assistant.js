// ============================================================
// CYBER SAHAYAK
// AI-Assisted Cybercrime Complaint Intake
// TALK → UNDERSTAND → ASK → EXTRACT → CONFIRM → AUTO-FILL
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    // ============================================================
    // STORAGE
    // ============================================================

    const CHAT_STORAGE_KEY = "cyberChatbotComplaint";
    const COMPLAINT_STORAGE_KEY = "cyberSahayakComplaint";
    const COMPLAINANT_KEY = "cyberChatbotComplainant";
    const INCIDENT_KEY = "cyberChatbotIncident";

    // ============================================================
    // DOM
    // ============================================================

    const chatBox = document.getElementById("chat-messages");
    const input = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-btn");
    const voiceButton = document.getElementById("voice-btn");
    const reviewPanel = document.getElementById("reviewPanel");
    const reviewContent = document.getElementById("reviewContent");
    const continueComplaint = document.getElementById("continueComplaint");
    const resetButton = document.getElementById("resetChat");
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const statusText = document.getElementById("statusText");

    // ============================================================
    // FIELD CREATOR
    // ============================================================

    function createField(
        value = "",
        source = "",
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

    // ============================================================
    // INITIAL STATE
    // ============================================================

    function createInitialState() {

        return {

            incident_type: createField(),
            incident_category: createField(),
            incident_subcategory: createField(),

            incident_date: createField(),
            incident_time: createField(),
            incident_location: createField(),

            incident_description: createField(),

            financial_loss: createField(),

            transaction_date: createField(),
            transaction_time: createField(),

            transaction_id: createField(),

            bank_name: createField(),

            account_related_information: createField(),

            UPI_ID: createField(),

            phone_number: createField(),
            email: createField(),

            suspicious_url: createField(),

            suspect_name: createField(),
            suspect_phone: createField(),
            suspect_email: createField(),
            suspect_social_media_account: createField(),

            communication_platform: createField(),

            evidence_available: createField(),
            evidence_description: createField(),

            full_name: createField(),
            state: createField(),
            district: createField(),
            address: createField(),

            additional_information: createField(),

            language: "en",

            current_field: null,

            conversation_started: false,

            final_review_ready: false,

            confirmed: false,

            waiting_for_confirmation: false

        };
    }

    // ============================================================
    // LOAD STATE
    // ============================================================

    function loadState() {

        try {

            const saved = localStorage.getItem(
                CHAT_STORAGE_KEY
            );

            if (!saved) {
                return createInitialState();
            }

            const parsed = JSON.parse(saved);

            return {
                ...createInitialState(),
                ...parsed
            };

        } catch (error) {

            console.error(
                "Could not load Cyber Sahayak state:",
                error
            );

            return createInitialState();
        }
    }

    const state = loadState();

    // ============================================================
    // SAVE STATE
    // ============================================================

    function saveState() {

        try {

            localStorage.setItem(
                CHAT_STORAGE_KEY,
                JSON.stringify(state)
            );

        } catch (error) {

            console.error(
                "Could not save chatbot state:",
                error
            );
        }
    }

    // ============================================================
    // UTILITY
    // ============================================================

    function getValue(field) {

        if (
            state[field] &&
            state[field].value !== undefined &&
            state[field].value !== null &&
            state[field].value !== ""
        ) {

            return state[field].value;
        }

        return "";
    }

    function setField(
        field,
        value,
        source = "user",
        confidence = 1,
        status = "CONFIRMED"
    ) {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return;
        }

        state[field] = {
            value: value,
            source: source,
            confidence: confidence,
            status: status
        };

        saveState();
        updateProgress();
    }

    // ============================================================
    // LANGUAGE
    // ============================================================

    function detectLanguage(text) {

        const value = text.toLowerCase();

        const marathiWords = [
            "mala",
            "majha",
            "majhi",
            "majhe",
            "mala",
            "kay",
            "kadhi",
            "kuthe",
            "aahe",
            "ahe",
            "zala",
            "zale",
            "zali",
            "nahi",
            "ho",
            "tumhi",
            "tyane",
            "tyani",
            "paise",
            "ghetle"
        ];

        const hindiWords = [
            "mujhe",
            "mera",
            "meri",
            "mere",
            "mujhse",
            "paise",
            "gaya",
            "gayi",
            "gaye",
            "hai",
            "tha",
            "thi",
            "hua",
            "hui",
            "aaj",
            "kal",
            "kya",
            "kaise",
            "nahi",
            "haan",
            "usne",
            "mujhse",
            "liye",
            "nikal"
        ];

        const marathiScore =
            marathiWords.filter(
                word => value.includes(word)
            ).length;

        const hindiScore =
            hindiWords.filter(
                word => value.includes(word)
            ).length;

        if (
            marathiScore >= 2 &&
            marathiScore > hindiScore
        ) {
            return "mr";
        }

        if (hindiScore >= 2) {
            return "hi";
        }

        return "en";
    }

    function setLanguage(text) {

        const detected = detectLanguage(text);

        if (
            detected === "hi" ||
            detected === "mr"
        ) {
            state.language = detected;
        }

        saveState();
    }

    function response(en, hi, mr) {

        if (state.language === "hi") {
            return hi;
        }

        if (state.language === "mr") {
            return mr;
        }

        return en;
    }

    // ============================================================
    // SENSITIVE INFORMATION
    // ============================================================

    const sensitivePatterns = [

        /\botp\b/i,
        /\bone time password\b/i,
        /\bupi\s*pin\b/i,
        /\bpin\b/i,
        /\bcvv\b/i,
        /\bpassword\b/i,
        /\bpasscode\b/i,
        /\bnet banking password\b/i

    ];

    function containsSensitiveCredential(text) {

        return sensitivePatterns.some(
            pattern => pattern.test(text)
        );
    }

    function sensitiveCredentialResponse() {

        return response(

            "Please do not share your OTP, PIN, CVV, password or other authentication credentials. These details are not required for preparing your complaint.",

            "Please OTP, PIN, CVV, password ya banking credentials share mat kijiye. Complaint prepare karne ke liye in details ki zarurat nahi hai.",

            "Kripaya OTP, PIN, CVV, password kiwa banking credentials share karu naka. Complaint prepare karnyasathi ya details chi garaj nahi."

        );
    }

    // ============================================================
    // AMOUNT
    // ============================================================

    function extractAmount(text) {

        const normalized =
            text
                .toLowerCase()
                .replace(/,/g, "");

        const patterns = [

            /₹\s*(\d+(?:\.\d+)?)/i,

            /rs\.?\s*(\d+(?:\.\d+)?)/i,

            /inr\s*(\d+(?:\.\d+)?)/i,

            /(\d+(?:\.\d+)?)\s*(?:rupees|rs)\b/i,

            /(?:lost|lose|loss|stolen|taken|paid|sent|debited|withdrawn)\s*(?:of|is|was|about)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)/i

        ];

        for (const pattern of patterns) {

            const match =
                normalized.match(pattern);

            if (match) {

                return Number(match[1]);
            }
        }

        return null;
    }

    // ============================================================
    // PHONE
    // ============================================================

    function extractPhone(text) {

        const match =
            text.match(
                /(?:\+91[\s-]?)?[6-9]\d{9}/
            );

        return match ? match[0] : null;
    }

    // ============================================================
    // EMAIL
    // ============================================================

    function extractEmail(text) {

        const match =
            text.match(
                /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
            );

        return match ? match[0] : null;
    }

    // ============================================================
    // URL
    // ============================================================

    function extractURL(text) {

        const match =
            text.match(
                /https?:\/\/[^\s<>"']+/i
            );

        return match ? match[0] : null;
    }

    // ============================================================
    // UPI
    // ============================================================

    function extractUPI(text) {

        const matches =
            text.match(
                /\b[A-Za-z0-9._-]{2,}@[A-Za-z0-9.-]{2,}\b/g
            );

        if (!matches) {
            return null;
        }

        const email =
            extractEmail(text);

        for (const value of matches) {

            if (
                !email ||
                value.toLowerCase() !==
                email.toLowerCase()
            ) {

                return value;
            }
        }

        return null;
    }

    // ============================================================
    // TRANSACTION ID
    // ============================================================

    function extractTransactionId(text) {

        const patterns = [

            /\b(?:UTR|transaction\s*(?:id|number)?|txn\s*(?:id|number)?)\s*[:#-]?\s*([A-Za-z0-9_-]{6,40})/i,

            /\b(?:RRN)\s*[:#-]?\s*([A-Za-z0-9_-]{6,40})/i

        ];

        for (const pattern of patterns) {

            const match =
                text.match(pattern);

            if (match) {
                return match[1];
            }
        }

        return null;
    }

    // ============================================================
    // PLATFORM
    // ============================================================

    function detectPlatform(text) {

        const value =
            text.toLowerCase();

        const platforms = [

            ["whatsapp", "WhatsApp"],
            ["instagram", "Instagram"],
            ["facebook", "Facebook"],
            ["telegram", "Telegram"],
            ["linkedin", "LinkedIn"],
            ["twitter", "X / Twitter"],
            ["x.com", "X / Twitter"],
            ["sms", "SMS"],
            ["gmail", "Email"],
            ["email", "Email"],
            ["phone call", "Phone Call"],
            ["called me", "Phone Call"],
            ["call me", "Phone Call"],
            ["call", "Phone Call"]

        ];

        for (
            const [keyword, platform]
            of platforms
        ) {

            if (value.includes(keyword)) {
                return platform;
            }
        }

        return null;
    }

    // ============================================================
    // CATEGORY
    // ============================================================

    function detectCategory(text) {

        const value =
            text.toLowerCase();

        if (
            value.includes("investment") ||
            value.includes("trading") ||
            value.includes("crypto") ||
            value.includes("share market") ||
            value.includes("stock")
        ) {

            return {
                type: "Financial Fraud",
                category: "Investment / Trading Fraud"
            };
        }

        if (
            value.includes("shopping") ||
            value.includes("fake product") ||
            value.includes("online order") ||
            value.includes("order scam") ||
            value.includes("delivery scam")
        ) {

            return {
                type: "Financial Fraud",
                category: "Online Shopping Fraud"
            };
        }

        if (
            value.includes("upi") ||
            value.includes("bank fraud") ||
            value.includes("banking fraud") ||
            value.includes("money stolen") ||
            value.includes("money was taken") ||
            value.includes("payment fraud") ||
            value.includes("financial fraud") ||
            value.includes("transaction") ||
            value.includes("debited") ||
            value.includes("debit") ||
            value.includes("money") ||
            value.includes("paise") ||
            value.includes("scam") ||
            value.includes("cheated") ||
            value.includes("fraud")
        ) {

            return {
                type: "Financial Fraud",
                category: "Online Financial Fraud"
            };
        }

        if (
            value.includes("phishing") ||
            value.includes("fake link") ||
            value.includes("suspicious link") ||
            value.includes("phishing link")
        ) {

            return {
                type: "Cyber Crime",
                category: "Phishing / Online Scam"
            };
        }

        if (
            value.includes("instagram hacked") ||
            value.includes("facebook hacked") ||
            value.includes("social media hacked") ||
            value.includes("account hacked")
        ) {

            return {
                type: "Cyber Crime",
                category: "Social Media / Account Crime"
            };
        }

        if (
            value.includes("harassment") ||
            value.includes("blackmail") ||
            value.includes("threat") ||
            value.includes("stalking")
        ) {

            return {
                type: "Cyber Crime",
                category: "Online Harassment / Threat"
            };
        }

        if (
            value.includes("identity theft") ||
            value.includes("identity stolen")
        ) {

            return {
                type: "Cyber Crime",
                category: "Identity Theft"
            };
        }

        if (
            value.includes("ransomware") ||
            value.includes("malware") ||
            value.includes("virus")
        ) {

            return {
                type: "Cyber Crime",
                category: "Malware / Ransomware"
            };
        }

        return null;
    }

    // ============================================================
    // DATE
    // ============================================================

    function formatDate(date) {

        const year =
            date.getFullYear();

        const month =
            String(date.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(date.getDate())
                .padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function extractDate(text) {

        const value =
            text.toLowerCase();

        const today =
            new Date();

        if (
            value.includes("today") ||
            value.includes("aaj")
        ) {

            return formatDate(today);
        }

        if (
            value.includes("yesterday") ||
            value.includes("kal")
        ) {

            const yesterday =
                new Date(today);

            yesterday.setDate(
                yesterday.getDate() - 1
            );

            return formatDate(yesterday);
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

        if (year < 100) {
            year += 2000;
        }

        return (
            `${year}-` +
            `${String(match[2]).padStart(2, "0")}-` +
            `${String(match[1]).padStart(2, "0")}`
        );
    }

    // ============================================================
    // TIME
    // ============================================================

    function extractTime(text) {

        const match =
            text.match(
                /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i
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
            match[3].toLowerCase();

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
            `${String(hour).padStart(2, "0")}:` +
            `${String(minute).padStart(2, "0")}`
        );
    }

    // ============================================================
    // BANK
    // ============================================================

    function detectBank(text) {

        const banks = [

            ["state bank of india", "State Bank of India"],
            ["sbi", "SBI"],
            ["hdfc", "HDFC Bank"],
            ["icici", "ICICI Bank"],
            ["axis", "Axis Bank"],
            ["kotak", "Kotak Mahindra Bank"],
            ["bank of baroda", "Bank of Baroda"],
            ["pnb", "Punjab National Bank"],
            ["punjab national bank", "Punjab National Bank"],
            ["canara", "Canara Bank"],
            ["union bank", "Union Bank"],
            ["idfc", "IDFC FIRST Bank"],
            ["indusind", "IndusInd Bank"],
            ["yes bank", "Yes Bank"]

        ];

        const value =
            text.toLowerCase();

        for (
            const [keyword, bank]
            of banks
        ) {

            if (value.includes(keyword)) {
                return bank;
            }
        }

        return null;
    }

    // ============================================================
    // INFORMATION EXTRACTION
    // ============================================================

    function extractInformation(text) {

        const category =
            detectCategory(text);

        if (category) {

            setField(
                "incident_type",
                category.type,
                "extraction",
                0.95
            );

            setField(
                "incident_category",
                category.category,
                "extraction",
                0.95
            );
        }

        const platform =
            detectPlatform(text);

        if (platform) {

            setField(
                "communication_platform",
                platform,
                "extraction",
                0.98
            );
        }

        const amount =
            extractAmount(text);

        if (amount !== null) {

            setField(
                "financial_loss",
                amount,
                "extraction",
                0.99
            );
        }

        const phone =
            extractPhone(text);

        if (phone) {

            setField(
                "phone_number",
                phone,
                "extraction",
                0.98
            );
        }

        const email =
            extractEmail(text);

        if (email) {

            setField(
                "email",
                email,
                "extraction",
                0.98
            );
        }

        const url =
            extractURL(text);

        if (url) {

            setField(
                "suspicious_url",
                url,
                "extraction",
                0.99
            );
        }

        const upi =
            extractUPI(text);

        if (upi) {

            setField(
                "UPI_ID",
                upi,
                "extraction",
                0.95
            );
        }

        const transactionId =
            extractTransactionId(text);

        if (transactionId) {

            setField(
                "transaction_id",
                transactionId,
                "extraction",
                0.95
            );
        }

        const date =
            extractDate(text);

        if (date) {

            setField(
                "incident_date",
                date,
                "extraction",
                0.95
            );

            if (
                getValue("financial_loss")
            ) {

                setField(
                    "transaction_date",
                    date,
                    "extraction",
                    0.95
                );
            }
        }

        const time =
            extractTime(text);

        if (time) {

            setField(
                "incident_time",
                time,
                "extraction",
                0.90
            );

            if (
                getValue("financial_loss")
            ) {

                setField(
                    "transaction_time",
                    time,
                    "extraction",
                    0.90
                );
            }
        }

        const bank =
            detectBank(text);

        if (bank) {

            setField(
                "bank_name",
                bank,
                "extraction",
                0.98
            );
        }

        // Phone number may belong to suspect if
        // the user is currently answering that question.

        if (
            state.current_field ===
            "suspect_phone" &&
            phone
        ) {

            setField(
                "suspect_phone",
                phone,
                "user",
                0.98
            );
        }

        // Preserve conversation.

        const previous =
            getValue(
                "incident_description"
            );

        if (!previous) {

            setField(
                "incident_description",
                text,
                "conversation",
                0.90
            );

        } else if (
            previous !== text &&
            !previous.includes(text)
        ) {

            setField(
                "incident_description",
                `${previous}\n${text}`,
                "conversation",
                0.90
            );
        }

        saveState();
    }

    // ============================================================
    // YES / NO
    // ============================================================

    function isYes(text) {

        return /^(yes|yeah|yep|haan|ha|ji|correct|right|yes please|ho)$/i
            .test(text.trim());
    }

    function isNo(text) {

        return /^(no|nope|nahi|nahin|nahi hai)$/i
            .test(text.trim());
    }

    function isUnknown(text) {

        return /^(i don't know|i do not know|don't know|not sure|unknown|pata nahi|malum nahi|mujhe nahi pata|nahi pata|nasel|mahiti nahi)$/i
            .test(text.trim());
    }

    // ============================================================
    // PROCESS CURRENT ANSWER
    // ============================================================

    function processAnswer(text) {

        const field =
            state.current_field;

        if (!field) {
            return;
        }

        if (isUnknown(text)) {

            setField(
                field,
                "UNKNOWN",
                "user",
                1,
                "CONFIRMED"
            );

            return;
        }

        // --------------------------------------------------------
        // DATE
        // --------------------------------------------------------

        if (
            field === "incident_date"
        ) {

            const date =
                extractDate(text);

            setField(
                field,
                date || text.trim(),
                "user",
                date ? 0.95 : 0.70,
                date
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;
        }

        // --------------------------------------------------------
        // TIME
        // --------------------------------------------------------

        if (
            field === "incident_time"
        ) {

            const time =
                extractTime(text);

            setField(
                field,
                time || text.trim(),
                "user",
                time ? 0.90 : 0.70,
                time
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;
        }

        // --------------------------------------------------------
        // MONEY
        // --------------------------------------------------------

        if (
            field === "financial_loss"
        ) {

            const amount =
                extractAmount(text);

            setField(
                field,
                amount !== null
                    ? amount
                    : text.trim(),
                "user",
                amount !== null
                    ? 0.99
                    : 0.70,
                amount !== null
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;
        }

        // --------------------------------------------------------
        // TRANSACTION ID
        // --------------------------------------------------------

        if (
            field === "transaction_id"
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

        // --------------------------------------------------------
        // UPI
        // --------------------------------------------------------

        if (
            field === "UPI_ID"
        ) {

            const upi =
                extractUPI(text);

            setField(
                field,
                upi || text.trim(),
                "user",
                upi ? 0.95 : 0.70,
                upi
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;
        }

        // --------------------------------------------------------
        // BANK
        // --------------------------------------------------------

        if (
            field === "bank_name"
        ) {

            const bank =
                detectBank(text);

            setField(
                field,
                bank || text.trim(),
                "user",
                bank ? 0.98 : 0.80,
                bank
                    ? "CONFIRMED"
                    : "NEEDS_CONFIRMATION"
            );

            return;
        }

        // --------------------------------------------------------
        // PLATFORM
        // --------------------------------------------------------

        if (
            field === "communication_platform"
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

        // --------------------------------------------------------
        // SUSPECT PHONE
        // --------------------------------------------------------

        if (
            field === "suspect_phone"
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

        // --------------------------------------------------------
        // EVIDENCE
        // --------------------------------------------------------

        if (
            field === "evidence_available"
        ) {

            if (isYes(text)) {

                setField(
                    field,
                    "YES",
                    "user",
                    1,
                    "CONFIRMED"
                );

            } else if (isNo(text)) {

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
                    "NEEDS_CONFIRMATION"
                );
            }

            return;
        }

        // --------------------------------------------------------
        // DEFAULT
        // --------------------------------------------------------

        setField(
            field,
            text.trim(),
            "user",
            0.90,
            "CONFIRMED"
        );
    }

    // ============================================================
    // NEXT QUESTION
    // ============================================================

    function getNextQuestion() {

        // --------------------------------------------------------
        // DESCRIPTION
        // --------------------------------------------------------

        if (
            !getValue(
                "incident_description"
            )
        ) {

            state.current_field =
                "incident_description";

            return response(

                "Please tell me briefly what happened. You can explain it in your own words.",

                "Please mujhe short mein apne words mein bataiye ki kya hua.",

                "Kripaya tumchya shabdat thodkyat sanga ki nemka kay zala."

            );
        }

        // --------------------------------------------------------
        // CATEGORY
        // --------------------------------------------------------

        if (
            !getValue(
                "incident_category"
            )
        ) {

            state.current_field =
                "incident_category";

            return response(

                "What type of cybercrime do you believe this was?",

                "Aapko kya lagta hai kis type ka cybercrime hua?",

                "Tumhala kontya prakarcha cybercrime zala ase watate?"

            );
        }

        // --------------------------------------------------------
        // DATE
        // --------------------------------------------------------

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

        // --------------------------------------------------------
        // TIME
        // --------------------------------------------------------

        if (
            !getValue(
                "incident_time"
            )
        ) {

            state.current_field =
                "incident_time";

            return response(

                "Do you remember approximately what time it happened? You can say something like 6 PM or around 10 at night.",

                "Approximately kis time hua tha? Aap 6 PM ya raat ke 10 baje jaisa bata sakte hain.",

                "Andaje kiti vajta zala hota? Udaharanarth 6 PM kiwa ratri 10 vajta."

            );
        }

        // ========================================================
        // FINANCIAL FRAUD
        // ========================================================

        const category =
            getValue(
                "incident_category"
            );

        if (
            category ===
            "Online Financial Fraud"
        ) {

            // MONEY

            if (
                !getValue(
                    "financial_loss"
                )
            ) {

                state.current_field =
                    "financial_loss";

                return response(

                    "Approximately how much money was lost?",

                    "Approximately kitne paise ka loss hua?",

                    "Andaje kiti rupayanchा loss zala?"

                );
            }

            // BANK

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

            // TRANSACTION

            if (
                !getValue(
                    "transaction_id"
                )
            ) {

                state.current_field =
                    "transaction_id";

                return response(

                    "Do you have the transaction ID or UTR number? If you don't have it, just say 'I don't know'.",

                    "Kya aapke paas transaction ID ya UTR number hai? Agar nahi hai to 'pata nahi' bol sakte hain.",

                    "Tumchyakade transaction ID kiwa UTR number aahe ka? Nasel tar 'mahiti nahi' asa sanga."

                );
            }

            // UPI

            if (
                !getValue("UPI_ID") &&
                !getValue("suspicious_url")
            ) {

                state.current_field =
                    "UPI_ID";

                return response(

                    "Do you have the UPI ID or payment identifier involved? If not, that's okay.",

                    "Kya aapke paas UPI ID ya payment identifier hai? Nahi hai to koi problem nahi.",

                    "Tumchyakade UPI ID kiwa payment identifier aahe ka? Nasel tari chalel."

                );
            }
        }

        // ========================================================
        // PLATFORM
        // ========================================================

        if (
            !getValue(
                "communication_platform"
            )
        ) {

            state.current_field =
                "communication_platform";

            return response(

                "How did the person contact you — WhatsApp, phone call, SMS, email, or another platform?",

                "Us person ne aapse WhatsApp, phone call, SMS, email ya kisi aur platform se contact kiya tha?",

                "Tya vyaktine WhatsApp, phone call, SMS, email kiwa dusrya platform varun contact kela hota?"

            );
        }

        // ========================================================
        // SUSPECT PHONE
        // ========================================================

        if (
            !getValue(
                "suspect_phone"
            )
        ) {

            state.current_field =
                "suspect_phone";

            return response(

                "Do you have the phone number used by the person? If you don't have it, say 'I don't know'. Do not share any OTP or PIN.",

                "Kya aapke paas us person ka phone number hai? Nahi hai to 'pata nahi' bol sakte hain. OTP ya PIN share mat kijiye.",

                "Tya vyakticha phone number aahe ka? Nasel tar 'mahiti nahi' asa sanga. OTP kiwa PIN share karu naka."

            );
        }

        // ========================================================
        // EVIDENCE
        // ========================================================

        if (
            !getValue(
                "evidence_available"
            )
        ) {

            state.current_field =
                "evidence_available";

            return response(

                "Do you have screenshots, messages, emails, receipts, call records, or other evidence?",

                "Kya aapke paas screenshots, messages, emails, receipts, call records ya koi aur evidence hai?",

                "Tumchyakade screenshots, messages, emails, receipts, call records kiwa kahi evidence aahe ka?"

            );
        }

        // ========================================================
        // FINISHED
        // ========================================================

        state.current_field =
            null;

        return null;
    }

    // ============================================================
    // PROGRESS
    // ============================================================

    function updateProgress() {

        const fields = [

            "incident_description",
            "incident_category",
            "incident_date",
            "incident_time",
            "financial_loss",
            "bank_name",
            "transaction_id",
            "UPI_ID",
            "communication_platform",
            "suspect_phone",
            "evidence_available"
        ];

        let completed = 0;

        fields.forEach(field => {

            if (getValue(field)) {
                completed++;
            }

        });

        let percentage =
            Math.round(
                (completed / fields.length) * 100
            );

        // Keep progress below 100 until final review.

        if (
            !state.final_review_ready &&
            percentage >= 100
        ) {
            percentage = 95;
        }

        if (progressFill) {
            progressFill.style.width =
                `${Math.max(5, percentage)}%`;
        }

        if (progressText) {

            if (state.final_review_ready) {

                progressText.textContent =
                    "Ready for review";

            } else {

                progressText.textContent =
                    `${percentage}% complete`;
            }
        }
    }

    // ============================================================
    // REVIEW
    // ============================================================

    function buildReviewHTML() {

        const category =
            getValue("incident_category") ||
            "Not identified";

        const date =
            getValue("incident_date") ||
            "Not available";

        const time =
            getValue("incident_time") ||
            "Not available";

        const amount =
            getValue("financial_loss");

        const amountDisplay =
            amount !== ""
                ? `₹${Number(amount).toLocaleString("en-IN")}`
                : "Not available";

        const description =
            getValue("incident_description") ||
            "Not available";

        const platform =
            getValue("communication_platform") ||
            "Not available";

        const bank =
            getValue("bank_name") ||
            "Not available";

        const transaction =
            getValue("transaction_id") ||
            "Not available";

        const upi =
            getValue("UPI_ID") ||
            "Not available";

        const suspectPhone =
            getValue("suspect_phone") ||
            "Not available";

        const evidence =
            getValue("evidence_available") ||
            "Not available";

        return `

            <div class="review-item">
                <strong>Incident Category</strong>
                <span>${escapeHTML(category)}</span>
            </div>

            <div class="review-item">
                <strong>Date</strong>
                <span>${escapeHTML(date)}</span>
            </div>

            <div class="review-item">
                <strong>Time</strong>
                <span>${escapeHTML(time)}</span>
            </div>

            <div class="review-item">
                <strong>Financial Loss</strong>
                <span>${escapeHTML(amountDisplay)}</span>
            </div>

            <div class="review-item">
                <strong>Bank / Payment App</strong>
                <span>${escapeHTML(bank)}</span>
            </div>

            <div class="review-item">
                <strong>Transaction ID / UTR</strong>
                <span>${escapeHTML(transaction)}</span>
            </div>

            <div class="review-item">
                <strong>UPI ID</strong>
                <span>${escapeHTML(upi)}</span>
            </div>

            <div class="review-item">
                <strong>Communication Platform</strong>
                <span>${escapeHTML(platform)}</span>
            </div>

            <div class="review-item">
                <strong>Suspect Phone</strong>
                <span>${escapeHTML(suspectPhone)}</span>
            </div>

            <div class="review-item">
                <strong>Evidence Available</strong>
                <span>${escapeHTML(evidence)}</span>
            </div>

            <div class="review-item description">
                <strong>Description</strong>
                <p>${escapeHTML(description)}</p>
            </div>
        `;
    }

    function buildReviewText() {

        const category =
            getValue("incident_category") ||
            "Not identified";

        const date =
            getValue("incident_date") ||
            "Not available";

        const time =
            getValue("incident_time") ||
            "Not available";

        const amount =
            getValue("financial_loss");

        const amountDisplay =
            amount !== ""
                ? `₹${Number(amount).toLocaleString("en-IN")}`
                : "Not available";

        return (

            "COMPLAINT REVIEW\n\n" +

            `Incident Category:\n${category}\n\n` +

            `Date:\n${date}\n\n` +

            `Time:\n${time}\n\n` +

            `Financial Loss:\n${amountDisplay}\n\n` +

            `Bank:\n${
                getValue("bank_name") ||
                "Not available"
            }\n\n` +

            `Transaction ID:\n${
                getValue("transaction_id") ||
                "Not available"
            }\n\n` +

            `UPI ID:\n${
                getValue("UPI_ID") ||
                "Not available"
            }\n\n` +

            `Platform:\n${
                getValue("communication_platform") ||
                "Not available"
            }\n\n` +

            `Description:\n${
                getValue("incident_description") ||
                "Not available"
            }`
        );
    }

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ============================================================
    // SHOW REVIEW
    // ============================================================

    function showReview() {

        state.final_review_ready =
            true;

        state.current_field =
            null;

        saveState();

        updateProgress();

        if (reviewPanel) {

            reviewPanel.style.display =
                "block";
        }

        if (reviewContent) {

            reviewContent.innerHTML =
                buildReviewHTML();
        }
    }

    // ============================================================
    // PREPARE COMPLAINT DATA
    // ============================================================

    function prepareComplaintData() {

        const complaintData = {

            // Incident

            crimeType:
                getValue(
                    "incident_category"
                ),

            incidentType:
                getValue(
                    "incident_type"
                ),

            incidentSubcategory:
                getValue(
                    "incident_subcategory"
                ),

            incidentDate:
                getValue(
                    "incident_date"
                ),

            incidentTime:
                getValue(
                    "incident_time"
                ),

            incidentLocation:
                getValue(
                    "incident_location"
                ),

            description:
                getValue(
                    "incident_description"
                ),

            // Financial

            amount:
                getValue(
                    "financial_loss"
                ),

            transactionId:
                getValue(
                    "transaction_id"
                ),

            transactionDate:
                getValue(
                    "transaction_date"
                ),

            transactionTime:
                getValue(
                    "transaction_time"
                ),

            paymentMethod:
                getValue(
                    "UPI_ID"
                )
                    ? "UPI"
                    : "",

            bank:
                getValue(
                    "bank_name"
                ),

            upiId:
                getValue(
                    "UPI_ID"
                ),

            accountRelated:
                getValue(
                    "account_related_information"
                ),

            // Suspect

            suspectName:
                getValue(
                    "suspect_name"
                ),

            suspectPhone:
                getValue(
                    "suspect_phone"
                ),

            suspectEmail:
                getValue(
                    "suspect_email"
                ),

            suspectProfile:
                getValue(
                    "suspect_social_media_account"
                ),

            // Contact

            platform:
                getValue(
                    "communication_platform"
                ),

            suspiciousUrl:
                getValue(
                    "suspicious_url"
                ),

            // Evidence

            evidenceAvailable:
                getValue(
                    "evidence_available"
                ),

            evidenceDescription:
                getValue(
                    "evidence_description"
                ),

            // Complainant

            fullName:
                getValue(
                    "full_name"
                ),

            mobile:
                getValue(
                    "phone_number"
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
                    "additional_information"
                ),

            generatedAt:
                new Date().toISOString(),

            source:
                "Cyber Sahayak Chatbot"

        };

        // --------------------------------------------------------
        // SAVE MAIN COMPLAINT DATA
        // --------------------------------------------------------

        localStorage.setItem(

            COMPLAINT_STORAGE_KEY,

            JSON.stringify(
                complaintData
            )
        );

        // --------------------------------------------------------
        // COMPLAINANT COMPATIBILITY
        // --------------------------------------------------------

        localStorage.setItem(

            COMPLAINANT_KEY,

            JSON.stringify({

                fullName:
                    complaintData.fullName,

                mobile:
                    complaintData.mobile,

                email:
                    complaintData.email,

                state:
                    complaintData.state,

                district:
                    complaintData.district,

                address:
                    complaintData.address

            })
        );

        // --------------------------------------------------------
        // INCIDENT COMPATIBILITY
        // --------------------------------------------------------

        localStorage.setItem(

            INCIDENT_KEY,

            JSON.stringify({

                crimeType:
                    complaintData.crimeType,

                incidentType:
                    complaintData.incidentType,

                incidentDate:
                    complaintData.incidentDate,

                incidentTime:
                    complaintData.incidentTime,

                platform:
                    complaintData.platform,

                amount:
                    complaintData.amount,

                transactionId:
                    complaintData.transactionId,

                transactionDate:
                    complaintData.transactionDate,

                transactionTime:
                    complaintData.transactionTime,

                bank:
                    complaintData.bank,

                upiId:
                    complaintData.upiId,

                suspectName:
                    complaintData.suspectName,

                suspectPhone:
                    complaintData.suspectPhone,

                suspectProfile:
                    complaintData.suspectProfile,

                suspiciousUrl:
                    complaintData.suspiciousUrl,

                evidenceAvailable:
                    complaintData.evidenceAvailable,

                description:
                    complaintData.description

            })
        );

        saveState();

        return complaintData;
    }

    // ============================================================
    // OPEN COMPLAINT FORM
    // ============================================================

    function openComplaintForm() {

        const data =
            prepareComplaintData();

        if (!data) {
            return;
        }

        state.final_review_ready =
            true;

        state.confirmed =
            true;

        saveState();

        window.location.href =
            "complaint.html?autofill=true";
    }

    // ============================================================
    // CHAT UI
    // ============================================================

    function addMessage(
        message,
        sender = "bot"
    ) {

        if (!chatBox) {
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

    // ============================================================
    // TYPING
    // ============================================================

    function showTyping() {

        if (!chatBox) {
            return;
        }

        removeTyping();

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.id =
            "cyber-chatbot-typing";

        wrapper.className =
            "chat-message bot";

        const bubble =
            document.createElement(
                "div"
            );

        bubble.className =
            "message-bubble";

        bubble.textContent =
            response(
                "Assistant is typing...",
                "Assistant type kar raha hai...",
                "Assistant type karat aahe..."
            );

        wrapper.appendChild(
            bubble
        );

        chatBox.appendChild(
            wrapper
        );

        chatBox.scrollTop =
            chatBox.scrollHeight;
    }

    function removeTyping() {

        const typing =
            document.getElementById(
                "cyber-chatbot-typing"
            );

        if (typing) {
            typing.remove();
        }
    }

    // ============================================================
    // SEND MESSAGE
    // ============================================================

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

        input.value = "";

        setLanguage(text);

        if (
            containsSensitiveCredential(
                text
            )
        ) {

            addMessage(
                sensitiveCredentialResponse(),
                "bot"
            );

            if (statusText) {

                statusText.textContent =
                    "Sensitive credentials were not accepted.";

            }

            return;
        }

        if (statusText) {

            statusText.textContent =
                "Cyber Sahayak is processing your information...";

        }

        showTyping();

        setTimeout(() => {

            removeTyping();

            handleUserMessage(
                text
            );

        }, 500);
    }

    // ============================================================
    // MAIN HANDLER
    // ============================================================

    function handleUserMessage(text) {

        // --------------------------------------------------------
        // CONFIRMATION
        // --------------------------------------------------------

        if (
            state.waiting_for_confirmation
        ) {

            if (isYes(text)) {

                state.waiting_for_confirmation =
                    false;

                state.confirmed =
                    true;

                saveState();

                addMessage(

                    response(

                        "Thank you. The information has been confirmed.",

                        "Thank you. Information confirm ho gayi hai.",

                        "Dhanyavaad. Information confirm zali aahe."

                    ),

                    "bot"
                );

                showReview();

                addMessage(

                    response(

                        "Please review the complaint summary. If everything is correct, click 'Continue to Complaint Form'.",

                        "Complaint summary review kijiye. Agar sab correct hai to 'Continue to Complaint Form' par click kijiye.",

                        "Complaint summary review kara. Sagla barobar asel tar 'Continue to Complaint Form' var click kara."

                    ),

                    "bot"
                );

                if (statusText) {

                    statusText.textContent =
                        "Complaint ready for review.";

                }

                return;
            }

            if (isNo(text)) {

                state.waiting_for_confirmation =
                    false;

                state.final_review_ready =
                    false;

                state.confirmed =
                    false;

                saveState();

                addMessage(

                    response(

                        "Okay. Please tell me what information needs to be corrected.",

                        "Theek hai. Kaunsi information correct karni hai, please bataiye.",

                        "Thik aahe. Konti information correct karaychi aahe te sanga."

                    ),

                    "bot"
                );

                return;
            }

            addMessage(

                response(

                    "Please answer Yes or No so I can confirm the complaint information.",

                    "Please Yes ya No mein answer kijiye taaki main complaint information confirm kar sakun.",

                    "Kripaya Yes kiwa No madhye answer dya, mhanje mi complaint information confirm karu shaken."

                ),

                "bot"
            );

            return;
        }

        // --------------------------------------------------------
        // PROCESS CURRENT FIELD
        // --------------------------------------------------------

        if (
            state.current_field
        ) {

            processAnswer(
                text
            );
        }

        // --------------------------------------------------------
        // EXTRACT MORE INFORMATION
        // --------------------------------------------------------

        extractInformation(
            text
        );

        state.conversation_started =
            true;

        saveState();

        // --------------------------------------------------------
        // ASK NEXT QUESTION
        // --------------------------------------------------------

        const nextQuestion =
            getNextQuestion();

        if (nextQuestion) {

            addMessage(
                nextQuestion,
                "bot"
            );

            updateProgress();

            saveState();

            if (statusText) {

                statusText.textContent =
                    "You can continue by typing or speaking.";

            }

            return;
        }

        // --------------------------------------------------------
        // FINAL CONFIRMATION
        // --------------------------------------------------------

        state.final_review_ready =
            true;

        state.waiting_for_confirmation =
            true;

        state.current_field =
            null;

        saveState();

        addMessage(

            response(

                "I have collected the main information for your complaint. Please review the summary below.",

                "Maine complaint ke liye main information collect kar li hai. Neeche summary review kijiye.",

                "Mi complaint sathi mukhya information collect keli aahe. Khalil summary review kara."

            ),

            "bot"
        );

        showReview();

        setTimeout(() => {

            addMessage(

                response(

                    "Does this information look correct? Please answer Yes or No.",

                    "Kya ye information correct hai? Please Yes ya No mein answer kijiye.",

                    "Hi information barobar aahe ka? Kripaya Yes kiwa No madhye answer dya."

                ),

                "bot"
            );

        }, 400);

        if (statusText) {

            statusText.textContent =
                "Please confirm the information.";
        }
    }

    // ============================================================
    // BUTTON EVENTS
    // ============================================================

    if (sendButton) {

        sendButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                sendMessage();

            }
        );
    }

    // ------------------------------------------------------------
    // PREPARE COMPLAINT
    // ------------------------------------------------------------

    if (continueComplaint) {

        continueComplaint.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openComplaintForm();

            }
        );
    }

    // ------------------------------------------------------------
    // ENTER KEY
    // ------------------------------------------------------------

    if (input) {

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

    // ============================================================
    // VOICE RECOGNITION
    // ============================================================

    let recognition = null;
    let isRecording = false;

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (
        voiceButton &&
        SpeechRecognition
    ) {

        recognition =
            new SpeechRecognition();

        recognition.continuous =
            false;

        recognition.interimResults =
            false;

        recognition.maxAlternatives =
            1;

        // Start with English.
        // Browser will recognize Indian English/Hinglish reasonably.
        recognition.lang =
            "en-IN";

        voiceButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                if (isRecording) {

                    recognition.stop();

                    return;
                }

                try {

                    recognition.lang =
                        state.language === "hi"
                            ? "hi-IN"
                            : state.language === "mr"
                                ? "mr-IN"
                                : "en-IN";

                    recognition.start();

                    isRecording =
                        true;

                    voiceButton.classList.add(
                        "recording"
                    );

                    voiceButton.textContent =
                        "⏹";

                    if (statusText) {

                        statusText.textContent =
                            "Listening... Please speak clearly.";

                    }

                } catch (error) {

                    console.warn(
                        "Speech recognition could not start:",
                        error
                    );

                }

            }
        );

        recognition.onresult =
            event => {

                const transcript =
                    event.results[0][0]
                        .transcript
                        .trim();

                if (input) {

                    input.value =
                        transcript;
                }

                if (statusText) {

                    statusText.textContent =
                        "Voice captured. Processing...";

                }

                if (transcript) {

                    sendMessage();
                }
            };

        recognition.onstart =
            () => {

                isRecording =
                    true;

                voiceButton.classList.add(
                    "recording"
                );

                voiceButton.textContent =
                    "⏹";
            };

        recognition.onend =
            () => {

                isRecording =
                    false;

                voiceButton.classList.remove(
                    "recording"
                );

                voiceButton.textContent =
                    "🎙";

                if (statusText) {

                    statusText.textContent =
                        "You can type or press 🎙 to speak.";

                }
            };

        recognition.onerror =
            event => {

                console.warn(
                    "Voice recognition error:",
                    event.error
                );

                isRecording =
                    false;

                voiceButton.classList.remove(
                    "recording"
                );

                voiceButton.textContent =
                    "🎙";

                if (statusText) {

                    if (
                        event.error ===
                        "not-allowed"
                    ) {

                        statusText.textContent =
                            "Microphone permission was denied. Please allow microphone access.";

                    } else {

                        statusText.textContent =
                            "Voice recognition could not start. You can type your message instead.";
                    }
                }
            };

    } else if (voiceButton) {

        voiceButton.disabled =
            true;

        voiceButton.title =
            "Speech recognition is not supported by this browser.";

        if (statusText) {

            statusText.textContent =
                "Voice recognition is not supported in this browser. You can type your message.";

        }
    }

    // ============================================================
    // RESET CHAT
    // ============================================================

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const confirmed =
                    window.confirm(
                        "Start a new complaint? Your current chatbot information will be cleared."
                    );

                if (!confirmed) {
                    return;
                }

                localStorage.removeItem(
                    CHAT_STORAGE_KEY
                );

                localStorage.removeItem(
                    COMPLAINT_STORAGE_KEY
                );

                localStorage.removeItem(
                    COMPLAINANT_KEY
                );

                localStorage.removeItem(
                    INCIDENT_KEY
                );

                location.reload();

            }
        );
    }

    // ============================================================
    // GLOBAL DEBUG / INTEGRATION API
    // ============================================================

    window.CyberChatbot = {

        getState: () => ({
            ...state
        }),

        save: saveState,

        review: () =>
            buildReviewText(),

        prepareComplaint: () =>
            prepareComplaintData(),

        openComplaint: () =>
            openComplaintForm(),

        reset: () => {

            localStorage.removeItem(
                CHAT_STORAGE_KEY
            );

            localStorage.removeItem(
                COMPLAINT_STORAGE_KEY
            );

            localStorage.removeItem(
                COMPLAINANT_KEY
            );

            localStorage.removeItem(
                INCIDENT_KEY
            );

            location.reload();
        }

    };

    // ============================================================
    // START CONVERSATION
    // ============================================================

    function startConversation() {

        updateProgress();

        // If old conversation exists, don't start again.

        if (
            state.conversation_started &&
            chatBox &&
            chatBox.children.length > 0
        ) {
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

                    "Hello. I'm Cyber Sahayak. I'll help you prepare your cybercrime complaint step by step. Please tell me in your own words what happened.",

                    "Namaste. Main Cyber Sahayak hoon. Main aapki cybercrime complaint step by step prepare karne mein help karunga. Apne words mein bataiye ki kya hua.",

                    "Namaskar. Mi Cyber Sahayak aahe. Mi tumchi cybercrime complaint step by step prepare karayla madat karen. Tumchya shabdat sanga ki kay zala."

                ),

                "bot"
            );

        }, 300);
    }

    startConversation();

});