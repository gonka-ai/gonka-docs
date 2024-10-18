// Reference to the auth service
const auth = firebase.auth();

// Sign-up function
function signUp() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log("User signed up:", userCredential.user);
    })
    .catch(error => {
      console.error("Error signing up:", error.message);
    });
}

// Login function
function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log("User logged in:", userCredential.user);
    })
    .catch(error => {
      console.error("Error logging in:", error.message);
    });
}
