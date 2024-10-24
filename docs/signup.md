# Sign Up

Join the waitlist! Sign up, and we’ll keep you in the loop when we launch to the wider audience

<div class="signup-form" style="max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <!-- New HubSpot Contact Form -->
    <div id="hubspot-form" style="margin-bottom: 20px;"></div>

    <!-- Existing Email Sign Up Form (optional: remove if you only want HubSpot form) -->
    <form id="signupForm">
        <div style="margin-bottom: 20px;">
            <label for="pemail" style="display: block; font-weight: bold; margin-bottom: 5px;">Email:</label>
            <input type="email" id="pemail" name="pemail" required style="width: 100%; padding: 10px; font-size: 1em; border: 1px solid #ccc; border-radius: 5px;">
        </div>

        <div style="text-align: center;">
            <input type="submit" value="Sign Up" style="padding: 10px 20px; font-size: 1em; font-weight: bold; color: white; background-color: #007bff; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">
        </div>
    </form>
    <div id="errorMessage" style="display:none; color: green; margin-top: 10px; text-align: center;">
        You’re on the list! We’ll reach out as soon as we’re ready to roll out the service to everyone.
    </div>
</div>

<!-- HubSpot Form Script -->
<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    portalId: "21332124",
    formId: "bb643442-f16c-415c-904e-0af99c759f09",
    target: "#hubspot-form"
  });
</script>

<script>
    // JavaScript for existing email sign up form (optional if you keep the form)
    document.getElementById("signupForm").addEventListener("submit", function(event) {
        event.preventDefault(); 

        document.getElementById("errorMessage").style.display = "block";
    });
</script>
