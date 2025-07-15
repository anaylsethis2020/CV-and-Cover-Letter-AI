document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cover-letter-form");
  const output = document.getElementById("cover-letter-output");
  const responseSection = document.getElementById("response-section");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Optional: Add loading message
    output.textContent = "Generating your cover letter...";
    responseSection.classList.remove("hidden");

    // Simulate delay or trigger server endpoint later
    setTimeout(() => {
      output.textContent = "✅ This is where your AI-generated cover letter will appear (after OpenAI API is wired in).";
    }, 1000);
  });
});
