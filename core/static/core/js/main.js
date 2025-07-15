document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cover-letter-form');
    const resultBox = document.getElementById('result-box');
    const output = document.getElementById('cover-letter-output');
    const loading = document.getElementById('loading');
    const button = document.getElementById('generate-btn');

    form.addEventListener('submit', function () {
        loading.classList.remove('hidden');
        button.disabled = true;
    });
});

function copyToClipboard() {
    const text = document.getElementById("cover-letter-output").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Cover letter copied to clipboard!");
    });
}
