import { auth, onAuthStateChanged } from "../fireBase.js";


export let dontChangeCurrentPage = ()=>{
    //  Only run this once to check if user is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If user is logged in, go to dashboard
    window.location.replace("dashboard.html");
  } else {
    document.getElementById("custom-loader").style.display = "none";
    document.body.style.display = "block";
  }
});
}


export let dontChangeCurrentPage2 = ()=>{
//  Only run this once to check if user is already logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // If user is logged in, go to dashboard
    window.location.replace("/index.html");
  } else {
    document.getElementById("custom-loader").style.display = "none";
    document.body.style.display = "block";
  }
});
}




