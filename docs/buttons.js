// ==============================
// HEADER BUTTONS (Log In & Sign Up)
// ==============================
document.addEventListener("DOMContentLoaded", function () {
    const headerMeta = document.querySelector('.md-header__inner');

    if (headerMeta) {
        const loginButton = document.createElement('a');
        loginButton.href = '/login/';
        loginButton.innerText = 'Log In';
        loginButton.className = 'header-button login-button';

        const signupButton = document.createElement('a');
        signupButton.href = '/signup/';
        signupButton.innerText = 'Sign Up';
        signupButton.className = 'header-button signup-button';

        headerMeta.appendChild(signupButton);
        headerMeta.appendChild(loginButton);
    }
});

// ==============================
// COLLAPSIBLE H2 SECTIONS
// ==============================
// MkDocs Material dynamic page load support
if (window.hasOwnProperty('document$')) {
    document$.subscribe(function() {
        console.log('Page content loaded/reloaded.');

        const content = document.querySelector('.md-content');
        console.log('Found .md-content:', content);

        if (!content) {
            console.warn('No .md-content found!');
            return;
        }

        const headers = content.querySelectorAll('h2');
        console.log(`Found ${headers.length} H2 headers.`);

        headers.forEach(function(header, i) {
            console.log(`Processing header #${i + 1}:`, header.innerText);

            if (header.parentNode.tagName.toLowerCase() === 'details') {
                console.log('Already wrapped in <details>, skipping.');
                return;
            }

            const details = document.createElement('details');
            const summary = document.createElement('summary');

            summary.innerHTML = header.innerHTML;
            details.appendChild(summary);

            let next = header.nextElementSibling;
            while (next && !(next.tagName === 'H2')) {
                const toMove = next;
                next = next.nextElementSibling;
                details.appendChild(toMove);
            }

            header.parentNode.replaceChild(details, header);
            console.log('Wrapped section in <details>.');
        });
    });
}
