/* ============ Eigi-style Cybercrime Portal Clone — DEMO ONLY ============
   No data here is ever sent to a server. Everything is mock/local logic. */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initDropdowns();
  initAccessibility();
  initFAQ();
  initScrollButtons();
  initComplaintForm();
  initTrackForm();
  initSuspectForm();
});

/* ---------- Toast ---------- */
function showToast(message, type = "") {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
}

/* ---------- Dropdown menus (click on mobile, hover on desktop via CSS) ---------- */
function initDropdowns() {
  document.querySelectorAll(".dropdown > .nav-top").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (window.innerWidth > 720) return; // desktop uses hover
      e.preventDefault();
      const parent = btn.closest(".dropdown");
      document.querySelectorAll(".dropdown.open").forEach((d) => {
        if (d !== parent) d.classList.remove("open");
      });
      parent.classList.toggle("open");
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown.open").forEach((d) => d.classList.remove("open"));
    }
  });
}

/* ---------- Accessibility: font size + language selector (UI only) ---------- */
function initAccessibility() {
  const sizes = ["", "font-lg", "font-xl"];
  let idx = parseInt(localStorage.getItem("eigi-font-idx") || "0", 10);
  applyFontSize();

  document.querySelectorAll("[data-font-increase]").forEach((btn) =>
    btn.addEventListener("click", () => {
      idx = Math.min(idx + 1, sizes.length - 1);
      applyFontSize();
    })
  );
  document.querySelectorAll("[data-font-decrease]").forEach((btn) =>
    btn.addEventListener("click", () => {
      idx = Math.max(idx - 1, 0);
      applyFontSize();
    })
  );
  document.querySelectorAll("[data-font-reset]").forEach((btn) =>
    btn.addEventListener("click", () => {
      idx = 0;
      applyFontSize();
    })
  );

  function applyFontSize() {
    document.body.classList.remove("font-lg", "font-xl");
    if (sizes[idx]) document.body.classList.add(sizes[idx]);
    localStorage.setItem("eigi-font-idx", idx);
  }

  const langSelect = document.querySelector(".lang-select");
  if (langSelect) {
    langSelect.addEventListener("change", () => {
      showToast(
        langSelect.value === "hi"
          ? "Demo: Hindi language content is not available in this prototype."
          : "Language set to English."
      );
    });
  }
}

/* ---------- Smooth scroll-to-section buttons ---------- */
function initScrollButtons() {
  document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.getAttribute("data-scroll-to"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ---------- FAQ accordion ---------- */
function initFAQ() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ---------- Utility: field validation helpers ---------- */
function setFieldError(field, message) {
  field.classList.add("invalid");
  const err = field.querySelector(".error-msg");
  if (err) err.textContent = message;
}
function clearFieldError(field) {
  field.classList.remove("invalid");
}
function validateRequired(fields) {
  let valid = true;
  fields.forEach(({ el, message }) => {
    const field = el.closest(".field");
    if (!el.value || !el.value.trim()) {
      setFieldError(field, message || "This field is required.");
      valid = false;
    } else {
      clearFieldError(field);
    }
  });
  return valid;
}
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidMobile(v) { return /^[6-9]\d{9}$/.test(v.replace(/\D/g, "")); }

/* ---------- Complaint form (complaint.html) ---------- */
function initComplaintForm() {
  const form = document.getElementById("complaint-form");
  if (!form) return;

  const uploadBox = document.getElementById("upload-box");
  const uploadInput = document.getElementById("evidence-input");
  const uploadList = document.getElementById("upload-list");
  const uploadedFiles = [];

  if (uploadBox && uploadInput) {
    uploadBox.addEventListener("click", () => uploadInput.click());
    uploadBox.addEventListener("dragover", (e) => { e.preventDefault(); uploadBox.classList.add("dragover"); });
    uploadBox.addEventListener("dragleave", () => uploadBox.classList.remove("dragover"));
    uploadBox.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadBox.classList.remove("dragover");
      handleFiles(e.dataTransfer.files);
    });
    uploadInput.addEventListener("change", () => handleFiles(uploadInput.files));
  }

  function handleFiles(fileList) {
    Array.from(fileList).forEach((f) => {
      uploadedFiles.push(f.name);
      const row = document.createElement("div");
      row.className = "upload-item";
      row.innerHTML = `<span>${escapeHtml(f.name)}</span><span>${(f.size / 1024).toFixed(1)} KB</span>`;
      uploadList.appendChild(row);
    });
  }

  const resultBox = document.getElementById("complaint-result");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("full-name");
    const mobile = document.getElementById("mobile");
    const email = document.getElementById("email");
    const state = document.getElementById("state");
    const district = document.getElementById("district");
    const crimeType = document.getElementById("crime-type");
    const incidentDate = document.getElementById("incident-date");
    const description = document.getElementById("description");

    let valid = validateRequired([
      { el: name, message: "Please enter your full name." },
      { el: mobile, message: "Please enter a mobile number." },
      { el: state, message: "Please select a state." },
      { el: district, message: "Please enter a district." },
      { el: crimeType, message: "Please select a complaint type." },
      { el: incidentDate, message: "Please select the incident date." },
      { el: description, message: "Please describe the incident." },
    ]);

    if (mobile.value && !isValidMobile(mobile.value)) {
      setFieldError(mobile.closest(".field"), "Enter a valid 10-digit mobile number.");
      valid = false;
    }
    if (email.value && !isValidEmail(email.value)) {
      setFieldError(email.closest(".field"), "Enter a valid email address.");
      valid = false;
    }

    if (!valid) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Complaint";

      const refNumber = generateRefNumber();
      resultBox.classList.remove("hidden");
      resultBox.innerHTML = `
        <span class="demo-tag">⚠ Demo Data — Not a real complaint</span>
        <h3>Demo complaint submitted successfully.</h3>
        <p style="margin:10px 0;color:var(--muted);font-size:13.5px;">
          This is a simulated submission. No data was sent to any server.
        </p>
        <div class="detail-row"><span>Reference Number</span><span class="ref-number">${refNumber}</span></div>
        <div class="detail-row"><span>Complaint Type</span><span>${escapeHtml(crimeType.value)}</span></div>
        <div class="detail-row"><span>State</span><span>${escapeHtml(state.value)}</span></div>
        <div class="detail-row"><span>Evidence Files</span><span>${uploadedFiles.length}</span></div>
      `;
      resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("Demo complaint submitted successfully.", "success");
      form.reset();
      uploadList.innerHTML = "";
      uploadedFiles.length = 0;
    }, 1400);
  });
}

function generateRefNumber() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `NCRP-DEMO-2026-${rand}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Track complaint (track.html) ---------- */
const MOCK_COMPLAINTS = {
  "NCRP-DEMO-2026-123456": { status: "Under Review", state: "Maharashtra", category: "Financial Fraud" },
  "NCRP-DEMO-2026-654321": { status: "Assigned to Officer", state: "Karnataka", category: "Social Media Crime" },
  "NCRP-DEMO-2026-111222": { status: "Resolved", state: "Delhi", category: "Hacking" },
};

function initTrackForm() {
  const form = document.getElementById("track-form");
  if (!form) return;
  const resultBox = document.getElementById("track-result");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const refInput = document.getElementById("track-ref");
    const mobileInput = document.getElementById("track-mobile");

    const valid = validateRequired([
      { el: refInput, message: "Please enter your complaint reference number." },
      { el: mobileInput, message: "Please enter your registered mobile number." },
    ]);
    if (!valid) return;

    const key = refInput.value.trim().toUpperCase();
    const loading = document.getElementById("track-loading");
    resultBox.classList.add("hidden");
    loading.classList.remove("hidden");

    setTimeout(() => {
      loading.classList.add("hidden");
      const data = MOCK_COMPLAINTS[key] || {
        status: "Not Found",
        state: "—",
        category: "—",
      };
      const pillClass = data.status === "Resolved" ? "status-safe" : data.status === "Not Found" ? "status-risk" : "status-review";

      resultBox.classList.remove("hidden");
      resultBox.innerHTML = `
        <span class="demo-tag">⚠ Demo Data — For illustration only</span>
        <div class="detail-row"><span>Reference Number</span><span class="ref-number">${escapeHtml(key)}</span></div>
        <div class="detail-row"><span>Status</span><span class="status-pill ${pillClass}">${data.status}</span></div>
        <div class="detail-row"><span>State</span><span>${data.state}</span></div>
        <div class="detail-row"><span>Category</span><span>${data.category}</span></div>
        ${data.status === "Not Found" ? `<p style="margin-top:12px;font-size:13px;color:var(--muted);">Try <strong>NCRP-DEMO-2026-123456</strong> for a sample record.</p>` : ""}
      `;
    }, 900);
  });
}

/* ---------- Suspect checker (suspect.html) ---------- */
const MOCK_SUSPECTS = new Set([
  "9876543210", "scammer@example.com", "example-bank-verification.com", "fraud@upi", "1234567890123456",
]);

function initSuspectForm() {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.add("hidden"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.remove("hidden");
      document.getElementById("suspect-result")?.classList.add("hidden");
    });
  });

  const form = document.getElementById("suspect-form");
  if (!form) return;
  const resultBox = document.getElementById("suspect-result");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const activeTab = document.querySelector(".tab-btn.active");
    const input = document.querySelector(`#${activeTab.dataset.tab} input`);

    const valid = validateRequired([{ el: input, message: "Please enter a value to check." }]);
    if (!valid) return;

    const value = input.value.trim().toLowerCase();
    const suspicious = MOCK_SUSPECTS.has(value) || value.includes("scam") || value.includes("fraud");

    resultBox.classList.remove("hidden");
    resultBox.innerHTML = suspicious
      ? `
        <span class="demo-tag">⚠ Demo Result</span>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span class="status-pill status-risk">Suspicious identifier found</span>
        </div>
        <p style="font-size:13.5px;color:var(--muted);">Demo result: this identifier appears in the mock suspect database. In a real deployment, exercise caution and avoid sharing OTPs or payments with this identifier.</p>
      `
      : `
        <span class="demo-tag">⚠ Demo Result</span>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span class="status-pill status-safe">No suspicious record found</span>
        </div>
        <p style="font-size:13.5px;color:var(--muted);">Demo result: no match was found in the mock suspect database. This does not guarantee the identifier is safe.</p>
      `;
  });
}
// --- Complaint Form Multi-Step & Validation Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const complaintForm = document.getElementById("complaint-form");
  
  if (complaintForm) {
    const steps = Array.from(document.querySelectorAll(".form-step"));
    const indicators = Array.from(document.querySelectorAll(".step-indicator"));
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    const uploadBox = document.getElementById("upload-box");
    const evidenceInput = document.getElementById("evidence-input");
    const uploadList = document.getElementById("upload-list");
    let currentStep = 0;
    let filesArray = [];

    // Navigation functions
    const updateUI = () => {
      steps.forEach((step, index) => {
        step.classList.toggle("hidden", index !== currentStep);
        step.classList.toggle("active", index === currentStep);
      });
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index <= currentStep);
      });
      // Scroll to top of form
      document.querySelector(".progress-indicator").scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const validateStep = (stepIndex) => {
      const step = steps[stepIndex];
      const inputs = step.querySelectorAll("input[required], select[required], textarea[required]");
      let isValid = true;

      inputs.forEach(input => {
        const errorSpan = input.parentElement.querySelector(".error-msg") || document.getElementById(`${input.id}-error`);
        input.classList.remove("error");
        if (errorSpan) errorSpan.textContent = "";

        if (!input.value.trim() || (input.type === 'checkbox' && !input.checked)) {
          input.classList.add("error");
          if (errorSpan) errorSpan.textContent = "This field is required.";
          isValid = false;
        } else if (input.type === "tel" && !/^\d{10}$/.test(input.value)) {
          input.classList.add("error");
          if (errorSpan) errorSpan.textContent = "Enter a valid 10-digit mobile number.";
          isValid = false;
        } else if (input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input.classList.add("error");
          if (errorSpan) errorSpan.textContent = "Enter a valid email address.";
          isValid = false;
        }
      });
      return isValid;
    };

    nextBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (validateStep(currentStep)) {
          currentStep++;
          updateUI();
        }
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        currentStep--;
        updateUI();
      });
    });

    // Evidence Upload Simulation
    if (uploadBox && evidenceInput) {
      uploadBox.addEventListener("click", () => evidenceInput.click());
      
      uploadBox.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadBox.classList.add("dragover");
      });
      
      uploadBox.addEventListener("dragleave", () => {
        uploadBox.classList.remove("dragover");
      });
      
      uploadBox.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadBox.classList.remove("dragover");
        handleFiles(e.dataTransfer.files);
      });

      evidenceInput.addEventListener("change", (e) => handleFiles(e.target.files));

      function handleFiles(files) {
        Array.from(files).forEach(file => {
          filesArray.push(file.name);
        });
        renderFileList();
      }

      function renderFileList() {
        uploadList.innerHTML = "";
        filesArray.forEach((fileName, index) => {
          const item = document.createElement("div");
          item.className = "upload-item";
          item.innerHTML = `<span>📎 ${fileName}</span> <span class="remove-file" data-index="${index}">✖</span>`;
          uploadList.appendChild(item);
        });

        document.querySelectorAll(".remove-file").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            filesArray.splice(index, 1);
            renderFileList();
          });
        });
      }
    }

    // Form Submission (Simulated)
    complaintForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        // Generate Mock Data
        const refNumber = `NCRP-DEMO-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        
        // Hide Form, Show Result Screen
        document.getElementById("progress-indicator").classList.add("hidden");
        complaintForm.classList.add("hidden");
        
        const resultBox = document.getElementById("complaint-result");
        document.getElementById("generated-ref").textContent = refNumber;
        resultBox.classList.remove("hidden");
        
        // Scroll to success screen
        resultBox.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});