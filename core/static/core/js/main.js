
// main.js: Handles interactivity for generator and payment buttons
document.addEventListener("DOMContentLoaded", () => {
  // Get form and output elements
  const form = document.getElementById("cover-letter-form");
  const output = document.getElementById("cover-letter-output");
  const responseSection = document.getElementById("response-section");

  // Stripe checkout button handler
  // When user clicks 'Pay with Stripe', disable button and show feedback
  const checkoutBtn = document.getElementById("checkout-button");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = "Redirecting to payment...";
    });
  }

  // Form feedback for generator page
  // When user submits the form, disable button and show 'Generating...'
  if (form) {
    form.addEventListener("submit", function (e) {
      const btn = form.querySelector("button[type='submit']");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Generating...";
      }
    });
  }
});
