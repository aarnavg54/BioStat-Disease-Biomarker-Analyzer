function runAnalysis() {
    if (!selected || dataset.length === 0) return;

    const values = dataset
        .map(d => Number(d[selected]))
        .filter(v => !isNaN(v));

    if (values.length === 0) {
        alert("No valid numeric values for this biomarker.");
        return;
    }

    const s = stats(values);

    // Save analysis for export
    lastAnalysis = {
        biomarker: selected,
        count: values.length,
        mean: s.mean,
        median: s.median,
        sd: s.sd,
        variance: s.variance,
        q1: s.q1,
        q3: s.q3,
        iqr: s.iqr,
        skew: s.skew,
        outliers: s.outliers,
        range: s.range
    };

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
        document.getElementById("distChart").getContext("2d"),
        {
            type: "line",
            data: {
                labels: values.map((_, i) => i + 1),
                datasets: [{
                    label: selected,
                    data: values,
                    fill: true,
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        }
    );

    // Enable export button
    document.getElementById("saveBtn").disabled = false;

    showView("analysisView");
}

function showSummary() {
    const total = dataset.length * biomarkers.length;
    const missing = calculateMissingValues();

    const completeRows = dataset.filter(row =>
        biomarkers.every(b => !isNaN(row[b]) && row[b] !== null)
    ).length;

    document.getElementById("summaryStats").innerHTML = `
        <div class="stat-card">Patients<strong>${dataset.length}</strong></div>
        <div class="stat-card">Biomarkers<strong>${biomarkers.length}</strong></div>
        <div class="stat-card">Total Values<strong>${total.toLocaleString()}</strong></div>
        <div class="stat-card">Missing Values<strong>${missing}</strong></div>
        <div class="stat-card">Complete Rows<strong>${completeRows}</strong></div>
        <div class="stat-card">Data Quality<strong>${((1 - missing / total) * 100).toFixed(1)}%</strong></div>
    `;

    showView("summaryView");
}

function exportResults() {
    if (!lastAnalysis) {
        alert("No analysis available to export.");
        return;
    }

    const content = `
Biomarker Analysis Export
-------------------------
Biomarker: ${lastAnalysis.biomarker}
Generated: ${new Date().toLocaleString()}
Observations: ${lastAnalysis.count}

Mean: ${lastAnalysis.mean}
Median: ${lastAnalysis.median}
Standard Deviation: ${lastAnalysis.sd}
Variance: ${lastAnalysis.variance}
Q1: ${lastAnalysis.q1}
Q3: ${lastAnalysis.q3}
IQR: ${lastAnalysis.iqr}
Skewness: ${lastAnalysis.skew}
Outliers: ${lastAnalysis.outliers}
Range: ${lastAnalysis.range}
`.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${lastAnalysis.biomarker}_analysis.txt`;
    link.click();

    URL.revokeObjectURL(link.href);
}
