const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    // retrieve redirect page from URL parameters
    const params = new URLSearchParams(window.location.search);
    const nextStop = params.get("redirect");

    if (username === "admin" && password === "toor") {
        alert("Admin Login Successful!");

        // redirect admin to specified page or index.html
        if (nextStop) {
            window.location.href = nextStop;
        } else {
            window.location.href = "index.html";
        }

    } else if (username === "customer" && password === "bank123") {
        alert("Customer Login Successful!");

        if (nextStop) {
            window.location.href = nextStop;
        } else {
            window.location.href = "index.html";
        }

    } else {
        loginErrorMsg.style.opacity = 1; // error message

        // redirect to index.html after 5 seconds
        setTimeout(() => {
            window.location.href = "index.html";
        }, 5000); // 5000 milliseconds = 5 seconds
    }
});