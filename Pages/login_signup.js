const toggle = document.getElementById("toggle-auth");
const title = document.getElementById("auth-title");
const subtitle = document.getElementById("auth-subtitle");
const nameField = document.getElementById("name-field");
const button = document.querySelector(".auth-btn");
const urlParams = new URLSearchParams(window.location.search);
var mode = urlParams.get('mode') || 'signup';



function setMode(mode) {
  if (mode === "signup") {
    title.textContent = "Create Your Account";
    subtitle.textContent = "Join us today!";
    nameField.style.display = "block";
    button.textContent = "Sign Up";
    toggle.textContent = "Login";
    toggle.parentElement.firstChild.textContent = "Already have an account? ";
  } else {
    title.textContent = "Welcome Back!";
    subtitle.textContent = "Sign in to continue.";
    nameField.style.display = "none";
    button.textContent = "Login";
    toggle.textContent = "Sign Up";
    toggle.parentElement.firstChild.textContent = "Don't have an account? ";
  }
}
setMode(mode);

toggle.addEventListener("click", () => {
  const newMode = mode === "signup" ? "login" : "signup";
  console.log(newMode);
  mode = newMode;
  setMode(newMode);
});

