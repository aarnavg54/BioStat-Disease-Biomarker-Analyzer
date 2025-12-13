document.getElementById("csvInput").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const statusBox = document.getElementById("statusText");
    statusBox.textContent = "Loading dataset...";
    statusBox.className = "status-box loading";

    const reader = new FileReader();
    reader.onload = () => parseCSV(reader.result);
    reader.readAsText(file);
});

function parseCSV(text) {
    try {
        const rows = text.trim().split("\n").map(r => r.split(","));
        const headers = rows[0];

        biomarkers = headers.slice(1);
        dataset = rows.slice(1).map(r => {
            const obj = {};
            biomarkers.forEach((b, i) => obj[b] = parseFloat(r[i + 1]));
            return obj;
        });

        const statusBox = document.getElementById("statusText");
        statusBox.innerHTML = `
            <i class="fas fa-check-circle" style="color: var(--medical-green);"></i>
            Loaded <strong>${dataset.length}</strong> patients with
            <strong>${biomarkers.length}</strong> biomarkers
        `;
        statusBox.className = "status-box";

        document.getElementById("analyzeBtn").disabled = false;
        document.getElementById("summaryBtn").disabled = false;

        renderBiomarkers();
    } catch {
        const statusBox = document.getElementById("statusText");
        statusBox.textContent = "Error loading CSV file.";
        statusBox.className = "status-box error";
    }
}
