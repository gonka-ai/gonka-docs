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
// COLLAPSIBLE H2 SECTIONS
document.addEventListener('DOMContentLoaded', function() {
    const content = document.querySelector('.md-content');
    const headers = content.querySelectorAll('h2');

    headers.forEach(function(header) {
        // Skip if already wrapped
        if (header.parentNode.tagName.toLowerCase() === 'details') return;

        // Create <details> and <summary>
        const details = document.createElement('details');
        const summary = document.createElement('summary');

        // Move the header text into <summary>
        summary.innerHTML = header.innerHTML;
        details.appendChild(summary);

        // Move all content until the next H2 into <details>
        let next = header.nextElementSibling;
        while (next && !(next.tagName === 'H2')) {
            const toMove = next;
            next = next.nextElementSibling;
            details.appendChild(toMove);
        }

        // Replace the original H2 with <details>
        header.parentNode.replaceChild(details, header);
    });
});
