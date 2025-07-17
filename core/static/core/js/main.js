document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cover-letter-form");
  const output = document.getElementById("cover-letter-output");
  const responseSection = document.getElementById("response-section");

  // Stripe checkout button handler
  const checkoutBtn = document.getElementById("checkout-button");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = "Redirecting to payment...";
    });
  }
});
  // Form feedback (optional, for generator page)
  if (form) {
    form.addEventListener("submit", function (e) {
      const btn = form.querySelector("button[type='submit']");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Generating...";
      }
    });
  }
