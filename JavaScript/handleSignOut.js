import { auth, signOut } from "../fireBase.js"

let handleSignOut = () => {
  signOut(auth).then(() => {
    window.location.replace("/index.html")

  }).catch((error) => {
    console.error("Sign out error:", error);
    alert("Something went wrong while signing out.");

  });
}

let logOutBtn = document.getElementById("logout-btn");
logOutBtn.addEventListener('click', handleSignOut)

