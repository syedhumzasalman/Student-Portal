import { auth, onAuthStateChanged } from "../fireBase.js"
import { sendVerification } from "/JavaScript/emilVerification.js"
import { dontChangeCurrentPage2 } from "/JavaScript/onAuthStateChangedListener.js"
import { passwordReset } from "/JavaScript/updatePassword.js"
import { ProfileUpdate } from "/JavaScript/updateProfile.js"

//  Only run this once to check if user is already logged in
dontChangeCurrentPage2()


// Sidebar Toggle
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.add("show");
  overlay.style.display = "block";
});

sidebarClose.addEventListener("click", () => {
  sidebar.classList.remove("show");
  overlay.style.display = "none";
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("show");
  overlay.style.display = "none";
});

// *************************************************************

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


// *************************************************************



let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    const userPic = document.getElementById("userPic");
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");

    const photoURL = user.photoURL || 'https://www.w3schools.com/howto/img_avatar.png';
    const displayName = user.displayName || "No Name Available";
    const email = user.email || "No Email Available";
    // console.log(currentUser);

    if (userPic) userPic.src = photoURL;
    if (userName) userName.innerText = `Welcome!, ${displayName}`;
    if (userEmail) userEmail.innerText = email;
  } else {
    currentUser = null;
  }
});


// *************************************************************

let profileBtn = document.querySelectorAll('.profileBtn');

let profile = (user) => {

  let mainContent = document.getElementById("mainContent");


  mainContent.innerHTML = `
    <div class="container py-5">

  <!-- Profile Section -->
  <div class="bg-white text-black rounded-4 p-4 mb-4 shadow">
    <div class="row align-items-center">
      <div class="col-md-2 text-center mb-3 mb-md-0">
        <img src="${user.photoURL || 'https://www.w3schools.com/howto/img_avatar.png'}"
             class="rounded-circle border border-white"
             style="width: 120px; height: 120px; object-fit: cover;" alt="Profile Picture">
      </div>
      <div class="col-md-10">
        <h2 class="mb-1">${user.displayName || 'No Name Available'}</h2>
        <p class="mb-1"><i class="fas fa-envelope me-2"></i>${user.email || 'No Email Available'}</p>
        <span class="badge bg-light text-dark fs-6"><i class="fas fa-user-graduate me-1"></i>Student</span>
        <button id="emailVerification"
              class="small fw-medium text-decoration-underline emailVerified">
        </button>
      </div>
    </div>
  </div>

  <!-- Info Cards Row -->
  <div class="row g-4">

    <!-- Personal Information -->
    <div class="col-lg-6">
      <div class="card shadow-sm h-100">
        <div class="card-header bg-white fw-bold">
          <i class="fas fa-id-card me-2"></i>Personal Information
        </div>
        <div class="card-body">
          <div class="mb-2"><strong>Full Name:</strong> ${user.displayName || 'No Name Available'}</div>
          <div class="mb-2"><strong>Date of Birth:</strong> Not Available</div>
          <div class="mb-2"><strong>Gender:</strong> Not Available </div>
          <div class="mb-2"><strong>CNIC:</strong> Not Available </div>
          <div><strong>Qualification:</strong> Not Available</div>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="col-lg-6">
      <div class="card shadow-sm h-100">
        <div class="card-header bg-white fw-bold">
          <i class="fas fa-address-book me-2"></i>Contact Information
        </div>
        <div class="card-body">
          <div class="mb-2"><strong>Email: </strong>${user.email || 'No Email Available'}</div>
          <div class="mb-2"><strong>Phone:</strong>${user.phoneNumber || ' No Number Available'}</div>
          <div><strong>Address:</strong> Not Available</div>
        </div>
      </div>
    </div>

  </div>


  <!-- Action Buttons -->
  <div class="d-flex justify-content-end gap-3 mt-4">
  <button class="btn btn-outline-primary" id="idUpdatePassword">
      <i class="fa-solid fa-unlock"></i> Update Password
    </button>
    <button class="btn btn-outline-primary" id="profileUpdated">
      <i class="fas fa-edit me-2"></i>Edit Profile
    </button>
    <button class="btn btn-primary">
      <i class="fas fa-download me-2"></i>Download ID Card
    </button>
  </div>

</div>
`
  // ****************************************************************
  const emailVerifiedEl = document.querySelector(".emailVerified");

  if (user.emailVerified) {
    emailVerifiedEl.innerText = "✅ Email Verified";
    emailVerifiedEl.classList.add("text-green-500");
  } else {
    emailVerifiedEl.innerText = "❌ Email Not Verified";
    emailVerifiedEl.classList.add("text-red-500");
  }

  emailVerifiedEl.addEventListener("click", sendVerification);
  // ****************************************************************

  let myupdatePassword = document.getElementById("idUpdatePassword")
  myupdatePassword.addEventListener("click", passwordReset);

  // ****************************************************************


  let profileUpdated = document.getElementById("profileUpdated");
  profileUpdated.addEventListener("click", ProfileUpdate);


}

profileBtn.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser) {
      profile(currentUser);
    }
  });
})











