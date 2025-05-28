import { auth, createUserWithEmailAndPassword, updateProfile } from "../fireBase.js"
import {dontChangeCurrentPage} from "/JavaScript/onAuthStateChangedListener.js"



let showPassword = () => {
  let changeIcon = document.getElementById("changeIcon");
  let signupPassword = document.getElementById("signupPassword");

  // console.log(signinPassword);

  if (signupPassword.type === "password") {
    signupPassword.type = "text";
    changeIcon.innerHTML = `<ion-icon name="lock-open-outline"></ion-icon>`;
  } else {
    signupPassword.type = "password";
    changeIcon.innerHTML = `<ion-icon name="lock-closed"></ion-icon>`;
  }
}

let passwordShow = document.querySelector(".passwordShow");
passwordShow.addEventListener('click', showPassword)




//  Only run this once to check if user is already logged in
dontChangeCurrentPage()





let signUp = async () => {

  let userName = document.getElementById("userName");
  let signupEmail = document.getElementById("signupEmail");
  let signupPassword = document.getElementById("signupPassword");
  let name = userName.value.trim();
  let email = signupEmail.value.trim();
  let password = signupPassword.value.trim();


  // Validation
  if (!name || !email || !password) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "All fields are required!",
    });
    return;
  }

  //  check if Email include @gamil.com or not
  if (!/^[^\s@]+@gmail\.com$/.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid Gmail address (e.g., user@gmail.com)!",
    });
    return;
  }

  //  check if Email include.length is above 6
  if (password.length < 6) {
    Swal.fire({
      icon: "error",
      title: "Weak Password",
      text: "Password must be at least 6 characters long!",
    });
    return;
  }




  // Sign up with Firebase

  try {
    // Create User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Profile (Display Name)
    await updateProfile(auth.currentUser, { displayName: name });


    // Success Message
    await Swal.fire({
      icon: "success",
      title: "Account Created!",
      timer: 2000,
      showConfirmButton: false,
    });

    window.location.href = "/dashboard.html";

  } catch (error) {
    let errorMessage = "Something went wrong. Try again.";

    console.log(errorMessage);
    
    // Firebase Error Handling
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "Email already exists. Try logging in.";
        break;
      case "auth/weak-password":
        errorMessage = "Password should be at least 6 characters.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email format.";
        break;
    }

    Swal.fire({
      icon: 'error',
      title: "Sign Up Failed",
      text: errorMessage,
      footer: `<small>Error: ${error.code}</small>`,
      confirmButtonText: 'Go to Login',
      confirmButtonColor: '#00f7ff',
      background: '#333',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) window.location.href = '/signIn.html';
    });
  }


}

document.getElementById("register").addEventListener("click", signUp);

