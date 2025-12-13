function renderBiomarkers() {
    const list = document.getElementById("biomarkerList");
    list.innerHTML = "";

    biomarkers.forEach(b => {
        const div = document.createElement("div");
        div.className = "biomarker-item";
        div.innerHTML = `<i class="fas fa-dna"></i> ${b}`;
        div.onclick = () => selectBiomarker(b, div);
        list.appendChild(div);
    });
}

function selectBiomarker(b, el) {
    document.querySelectorAll(".biomarker-item")
        .forEach(i => i.classList.remove("selected"));
    el.classList.add("selected");
    selected = b;
}

function showView(id) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}
