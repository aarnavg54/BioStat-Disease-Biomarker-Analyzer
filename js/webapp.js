console.log("Biomarker Analyzer initialized");

document.addEventListener("DOMContentLoaded", () => {

    const analyzeBtn = document.getElementById("analyzeBtn");
    const summaryBtn = document.getElementById("summaryBtn");
    const saveBtn = document.getElementById("saveBtn");

    analyzeBtn.addEventListener("click", runAnalysis);
    summaryBtn.addEventListener("click", showSummary);
    saveBtn.addEventListener("click", exportResults);

});
