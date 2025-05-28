import { auth, signInWithEmailAndPassword } from "../fireBase.js";
import { dontChangeCurrentPage } from "/JavaScript/onAuthStateChangedListener.js"

//  Only run this once to check if user is already logged in
dontChangeCurrentPage()


let showPassword = () => {
  let changeIcon = document.getElementById("changeIcon");
  let signinPassword = document.getElementById("signinPassword");

  // console.log(signinPassword);

  if (signinPassword.type === "password") {
    signinPassword.type = "text";
    changeIcon.innerHTML = `<ion-icon name="lock-open-outline"></ion-icon>`;
  } else {
    signinPassword.type = "password";
    changeIcon.innerHTML = `<ion-icon name="lock-closed"></ion-icon>`;
  }
}

let passwordShow = document.querySelector(".passwordShow");
passwordShow.addEventListener('click', showPassword)




//  Sign In Function
export let SignIn = () => {
  let signinEmail = document.getElementById("signinEmail");
  let signinPassword = document.getElementById("signinPassword");

  let loginEmail = signinEmail.value.trim();
  let loginPassword = signinPassword.value.trim();

  // Check if empty
  if (!loginEmail || !loginPassword) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "All fields are required!",
    });
    return;
  }
  //  check if Email include @gamil.com or not
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(loginEmail)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid Gmail address!",
    });
    return;
  }
  
  //  Firebase Sign In
  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      const user = userCredential.user;

      Swal.fire("Logged In", "Welcome!", "success");
      window.location.href = "/dashboard.html";
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: "Login Failed",
        text: "Invalid email or password.",
        footer: `<code>${error.code}</code>`,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#00f7ff',
        background: '#333',
        color: '#fff',
        backdrop: `rgba(0, 0, 0, 0.8)`
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/index.html';
        }
      });
    });
}
document.getElementById("login").addEventListener("click", SignIn);
