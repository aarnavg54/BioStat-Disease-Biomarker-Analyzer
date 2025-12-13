function stats(values) {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;

    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(n / 2)];
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];

    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    const sd = Math.sqrt(variance);
    const skew = (mean - median) / sd;
    const iqr = q3 - q1;
    const outliers = values.filter(
        v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr
    ).length;

    const range = sorted[n - 1] - sorted[0];

    return {
        mean, median, q1, q3,
        variance, sd, skew, iqr,
        outliers,
        min: sorted[0],
        max: sorted[n - 1],
        range,
        count: n
    };
}

function calculateMissingValues() {
    let missing = 0;
    dataset.forEach(row => {
        biomarkers.forEach(b => {
            if (isNaN(row[b]) || row[b] == null) missing++;
        });
    });
    return missing;
}
