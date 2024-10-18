<div class="login-form" style="max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <form id="loginForm">
        <div style="margin-bottom: 20px;">
            <label for="pemail" style="display: block; font-weight: bold; margin-bottom: 5px;">Email:</label>
            <input type="email" id="pemail" name="pemail" required style="width: 100%; padding: 10px; font-size: 1em; border: 1px solid #ccc; border-radius: 5px;">
        </div>

        <div style="margin-bottom: 20px;">
            <label for="password" style="display: block; font-weight: bold; margin-bottom: 5px;">Password:</label>
            <input type="password" id="password" name="password" required style="width: 100%; padding: 10px; font-size: 1em; border: 1px solid #ccc; border-radius: 5px;">
        </div>

        <div style="text-align: center;">
            <input type="submit" value="Login" style="padding: 10px 20px; font-size: 1em; font-weight: bold; color: white; background-color: #007bff; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">
        </div>
    </form>
    <div id="errorMessage" style="display:none; color: red; margin-top: 10px; text-align: center;">
        The credentials you entered don't match our records.
    </div>
</div>

<script>
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault(); 

        document.getElementById("errorMessage").style.display = "block";
    });
</script>
