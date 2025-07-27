const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("fileInput");
const detectBtn = document.getElementById("detectBtn");
const loader = document.getElementById("loader");
const resultCard = document.getElementById("resultCard");
const imagePreview = document.getElementById("imagePreview");

const diseaseName = document.getElementById("diseaseName");
const confidence = document.getElementById("confidence");
const treatment = document.getElementById("treatment");
const downloadBtn = document.getElementById("downloadBtn");

// Drag and drop
uploadArea.addEventListener("click", () => fileInput.click());

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = "#dcedc8";
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.style.backgroundColor = "#f1f8e9";
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
  showImagePreview();
  uploadArea.style.backgroundColor = "#f1f8e9";
});

fileInput.addEventListener("change", showImagePreview);

function showImagePreview() {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    imagePreview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

// Predict disease
detectBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please upload a leaf image!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  loader.style.display = "block";
  resultCard.classList.add("hidden");

  try {
    const res = await fetch("/disease", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    diseaseName.innerText = data.disease;
    confidence.innerText = data.confidence;
    treatment.innerText = data.treatment;

    resultCard.classList.remove("hidden");
  } catch (err) {
    alert("❌ Error: " + err.message);
  } finally {
    loader.style.display = "none";
  }
});

// Download PDF report
downloadBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("AgriSaarthi: Disease Diagnosis Report", 20, 20);

  doc.setFontSize(12);
  doc.text("📅 Date: " + new Date().toLocaleDateString(), 20, 35);
  doc.text("🩺 Disease: " + diseaseName.innerText, 20, 45);
  doc.text("📊 Confidence: " + confidence.innerText, 20, 55);
  doc.text("🌿 Organic Treatment:", 20, 65);
  doc.text(treatment.innerText, 25, 75, { maxWidth: 160 });

  doc.save("AgriSaarthi_Disease_Report.pdf");
});
