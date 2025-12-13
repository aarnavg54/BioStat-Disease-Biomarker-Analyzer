document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("analyzeBtn").addEventListener("click", runAnalysis);
    document.getElementById("summaryBtn").addEventListener("click", showSummary);

    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.addEventListener("click", exportResults);
    }
});

function showView(id) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}
