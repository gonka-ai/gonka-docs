document.addEventListener("DOMContentLoaded", function () {
    const headerMeta = document.querySelector('.md-header__inner');

    if (headerMeta) {
        // Create "Log In" button
        const loginButton = document.createElement('a');
        loginButton.href = '/login/';
        loginButton.innerText = 'Log In';
        loginButton.className = 'header-button login-button';

        // Create "Sign Up" button
        const signupButton = document.createElement('a');
        signupButton.href = '/signup/';
        signupButton.innerText = 'Sign Up';
        signupButton.className = 'header-button signup-button';

        // Append buttons to the header
        headerMeta.appendChild(signupButton);
        headerMeta.appendChild(loginButton);
    }
});
