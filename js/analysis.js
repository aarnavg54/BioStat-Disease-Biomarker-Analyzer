function runAnalysis() {
    if (!selected) return;

    const values = dataset.map(d => d[selected]).filter(v => !isNaN(v));
    const s = stats(values);

    document.getElementById("analysisTitle").innerHTML =
        `<i class="fas fa-dna"></i> ${selected}`;
    document.getElementById("analysisSubtitle").textContent =
        `${values.length} observations analyzed`;

    document.getElementById("statsGrid").innerHTML = `
        <div class="stat-card">Mean<strong>${s.mean.toFixed(3)}</strong></div>
        <div class="stat-card">Median<strong>${s.median.toFixed(3)}</strong></div>
        <div class="stat-card">Std Dev<strong>${s.sd.toFixed(3)}</strong></div>
        <div class="stat-card">Variance<strong>${s.variance.toFixed(3)}</strong></div>
        <div class="stat-card">Q1 / Q3<strong>${s.q1.toFixed(2)} / ${s.q3.toFixed(2)}</strong></div>
        <div class="stat-card">IQR<strong>${s.iqr.toFixed(3)}</strong></div>
        <div class="stat-card">Skew<strong>${s.skew.toFixed(3)}</strong></div>
        <div class="stat-card">Outliers<strong>${s.outliers}</strong></div>
        <div class="stat-card">Range<strong>${s.range.toFixed(3)}</strong></div>
    `;

    if (chart) chart.destroy();
    chart = new Chart(
        document.getElementById("distChart").getContext("2d"), {
            type: "line",
            data: {
                labels: values.map((_, i) => i + 1),
                datasets: [{
                    label: selected,
                    data: values,
                    fill: true,
                    tension: 0.2
                }]
            }
        }
    );

    showView("analysisView");
}

function showSummary() {
    const total = dataset.length * biomarkers.length;
    const missing = calculateMissingValues();

    const completeRows = dataset.filter(row =>
        biomarkers.every(b => !isNaN(row[b]) && row[b] !== null)
    ).length;

    document.getElementById("summaryStats").innerHTML = `
        <div class="stat-card">
            Patients
            <strong>${dataset.length}</strong>
        </div>

        <div class="stat-card">
            Biomarkers
            <strong>${biomarkers.length}</strong>
        </div>

        <div class="stat-card">
            Total Values
            <strong>${total.toLocaleString()}</strong>
        </div>

        <div class="stat-card">
            Missing Values
            <strong>${missing}</strong>
        </div>

        <div class="stat-card">
            Complete Rows
            <strong>${completeRows}</strong>
        </div>

        <div class="stat-card">
            Data Quality
            <strong>${((1 - missing / total) * 100).toFixed(1)}%</strong>
        </div>
    `;

    showView("summaryView");
}

function exportResults() {
    const blob = new Blob(
        [`Biomarker: ${selected}\nGenerated: ${new Date().toLocaleString()}`],
        { type: "text/plain" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${selected}_analysis.txt`;
    a.click();
}