const toggle = document.getElementById("toggle-auth");
const title = document.getElementById("auth-title");
const subtitle = document.getElementById("auth-subtitle");
const nameField = document.getElementById("name-field");
const button = document.querySelector(".auth-btn");

const authForm = document.getElementById("authForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const urlParams = new URLSearchParams(window.location.search);
let mode = urlParams.get("mode") || "signup";

function setMode(mode) {

    if (mode === "signup") {

        title.textContent = "Create Your Account";
        subtitle.textContent = "Join us today!";

        nameField.style.display = "block";

        button.textContent = "Sign Up";

        toggle.textContent = "Login";

        toggle.parentElement.firstChild.textContent =
            "Already have an account? ";

    } else {

        title.textContent = "Welcome Back!";
        subtitle.textContent = "Sign in to continue.";

        nameField.style.display = "none";

        button.textContent = "Login";

        toggle.textContent = "Sign Up";

        toggle.parentElement.firstChild.textContent =
            "Don't have an account? ";

    }

}

setMode(mode);

toggle.addEventListener("click", () => {

    mode = mode === "signup"
        ? "login"
        : "signup";

    setMode(mode);

    window.history.replaceState(
        {},
        "",
        `?mode=${mode}`
    );

});

authForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        let endpoint = "";
        let bodyData = {};

        if (mode === "signup") {

            endpoint =
                "http://localhost:5000/api/auth/signup";

            bodyData = {
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            };

        } else {

            endpoint =
                "http://localhost:5000/api/auth/login";

            bodyData = {
                email: emailInput.value,
                password: passwordInput.value
            };

        }

        if (
            !emailInput.value ||
            !passwordInput.value
        ) {
            alert("Fill all fields");
            return;
        }

        if (
            mode === "signup" &&
            !nameInput.value
        ) {
            alert("Enter your name");
            return;
        }

        const response = await fetch(endpoint, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(bodyData)

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        if (mode === "login") {

            localStorage.setItem(
                "token",
                data.token
            );
            localStorage.setItem(
                "userId",
                data.user.id
            );

            localStorage.setItem(
                "userName",
                data.user.name
            );

            alert("Login Successful");
            
            window.location.replace(
              "notes.html"
            );
            

            return;

        } else {

            alert(
                "Signup Successful. Please Login."
            );

            mode = "login";

            setMode(mode);

            authForm.reset();

        }

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});