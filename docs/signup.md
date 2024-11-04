# Sign Up

Join the waitlist! Sign up, and we’ll keep you in the loop when we launch to the wider audience

<div class="signup-form" style="max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <!-- New HubSpot Contact Form -->
    <div id="hubspot-form" style="margin-bottom: 20px;"></div>

<!-- HubSpot Form Script -->
<script>
  var script = document.createElement('script');
  script.src = "https://js.hsforms.net/forms/v2.js";
  script.onload = function() {
    if (window.hbspt) {
      window.hbspt.forms.create({
        portalId: "21332124",
        formId: "bb643442-f16c-415c-904e-0af99c759f09",
        target: "#hubspot-form"
      });
    }
  };
  document.body.appendChild(script);
</script>


<script>
    // JavaScript for existing email sign up form (optional if you keep the form)
    document.getElementById("signupForm").addEventListener("submit", function(event) {
        event.preventDefault(); 

        document.getElementById("errorMessage").style.display = "block";
    });
</script>
