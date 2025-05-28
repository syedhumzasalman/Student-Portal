
import { GoogleAuthProvider, auth, signInWithPopup, googleProvider,onAuthStateChanged  } from "../fireBase.js"
import {dontChangeCurrentPage} from "/JavaScript/onAuthStateChangedListener.js"

//  Only run this once to check if user is already logged in
dontChangeCurrentPage()


// **********************************************************************************

let loginWithGoogle = () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      
      
      Swal.fire("Welcome!", "Logged in with Google", "success");
      setTimeout(() => window.location.href = "dashboard.html", 2000);
      // console.log(user, token, credential);
      
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      // console.log(errorCode, credential);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage
      });
    });
}

let googleBtn = document.getElementById("google");
googleBtn.addEventListener('click', loginWithGoogle)

// *************************************************************************************


let facebookFun = () => {
  Swal.fire({
    title: "<strong>Facebook Login Not Available</strong>",
    icon: "info",
    html: `
            Facebook login hasn’t been added because it requires a paid service. For now, you can log in using your email or Google.
          `,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: `
            <i class="fa fa-thumbs-up"></i> Great!
          `,
    confirmButtonAriaLabel: "Thumbs up, great!",
    cancelButtonText: `
            <i class="fa fa-thumbs-down"></i>
          `,
    cancelButtonAriaLabel: "Thumbs down",
  });
}


let facebookBtn = document.getElementById("facebook");
facebookBtn.addEventListener('click', facebookFun)

// *************************************************************************************