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

    // Function to switch between steps
    const updateUI = () => {
      steps.forEach((step, index) => {
        if (index === currentStep) {
          step.classList.remove("hidden");
          step.classList.add("active");
        } else {
          step.classList.add("hidden");
          step.classList.remove("active");
        }
      });
      
      indicators.forEach((indicator, index) => {
        if (index <= currentStep) {
          indicator.classList.add("active");
        } else {
          indicator.classList.remove("active");
        }
      });
      
      // Scroll to the top of the form when clicking Next/Prev
      document.querySelector(".progress-indicator").scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Function to validate fields before allowing the user to proceed
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

    // Listen for "Next" button clicks
    nextBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (validateStep(currentStep)) {
          currentStep++;
          updateUI();
        }
      });
    });

    // Listen for "Previous" button clicks
    prevBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        currentStep--;
        updateUI();
      });
    });

    // Simulated Evidence Upload Logic
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
          item.innerHTML = `<span>📎 ${fileName}</span> <span class="remove-file" style="color:red; cursor:pointer;" data-index="${index}">✖</span>`;
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

    // Form Submission Logic
    complaintForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        // Generate a fake reference number
        const refNumber = `NCRP-DEMO-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        
        // Hide the form and show the success message
        document.getElementById("progress-indicator").classList.add("hidden");
        complaintForm.classList.add("hidden");
        
        const resultBox = document.getElementById("complaint-result");
        document.getElementById("generated-ref").textContent = refNumber;
        resultBox.classList.remove("hidden");
        
        resultBox.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});