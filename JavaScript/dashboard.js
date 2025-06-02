import { auth, onAuthStateChanged, doc, getDoc, db, getDocs, collection, query, where, } from "../fireBase.js"
import { sendVerification } from "/JavaScript/emilVerification.js"
import { dontChangeCurrentPage2 } from "/JavaScript/onAuthStateChangedListener.js"
import { passwordReset } from "/JavaScript/updatePassword.js"
import { ProfileUpdate } from "/JavaScript/updateProfile.js"
import { getUserData } from "/JavaScript/addUserInfo.js"




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



// *************************************************************

let profileBtn = document.querySelectorAll('.profileBtn');

let currentUser = null;
let currentFirestoreData = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const userPic = document.getElementById("userPic");
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");

    const photoURL = user.photoURL || 'https://www.w3schools.com/howto/img_avatar.png';
    const displayName = user.displayName || "No Name Available";
    const email = user.email || "No Email Available";
    // console.log(photoURL);


    const existsEmail = user.email;


    const usersRef = collection(db, "usersInfo");
    const q = query(usersRef, where("email", "==", existsEmail));
    const querySnapshot = await getDocs(q);



    let firestoreData = null;
    querySnapshot.forEach((doc) => {
      firestoreData = doc.data();
    });

    currentFirestoreData = firestoreData;

    profileBtn.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) {
          profile(currentUser, currentFirestoreData || {});
        }
      });
    })

    if (userPic) userPic.src = photoURL;
    if (userName) userName.innerText = `Welcome!, ${firestoreData?.fullName || displayName}`;
    if (userEmail) userEmail.innerText = email;
  }
  else {
    currentUser = null;
    currentFirestoreData = null;
  }
});


// *************************************************************



export let profile = (user, firestoreData = {}, enrolledCourses = []) => {

  let mainContent = document.getElementById("mainContent");


  const fullName = firestoreData.fullName || user.displayName || "No Name Available";
  const dob = firestoreData.dateOfBirth || "Not Available";
  const gender = firestoreData.gender || "Not Available";
  const cnic = firestoreData.CNIC || "Not Available";
  const phone = firestoreData.phone || user.phoneNumber || "No Number Available";
  const address = firestoreData.address || "Not Available";


  mainContent.innerHTML = `
      <div class="container py-5">

    <!-- Profile Section -->
    <div class="bg-white text-black rounded-4 p-4 mb-4 shadow">
      <div class="row align-items-center">
        <div class="col-md-2 text-center mb-3 mb-md-0">
          <img src="${user.photoURL || 'https://www.w3schools.com/howto/img_avatar.png'}"
              class="rounded-circle border border-3 border-primary"
              style="width: 120px; height: 120px; object-fit: cover;" alt="Profile Picture">
        </div>
        <div class="col-md-10">
          <h2 class="mb-1">${fullName || 'No Name Available'}</h2>
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
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 fw-bold fs-5 py-3">
            <i class="fas fa-id-card me-2 text-primary"></i>Personal Information
          </div>
          <div class="card-body pt-0">
            <ul class="list-unstyled">
              <li class="mb-3 d-flex">
                <span class="me-2 fw-medium fw-bold" style="width: 120px;">Full Name:</span>
                <span>${fullName}</span>
              </li>
              <li class="mb-3 d-flex">
                <span class="me-2 fw-medium fw-bold" style="width: 120px;">Date of Birth:</span>
                <span>${moment(dob).format('MMMM Do YYYY')}</span>
              </li>
              <li class="mb-3 d-flex">
                <span class="me-2 fw-medium fw-bold" style="width: 120px;">Gender:</span>
                <span>${gender}</span>
              </li>
              <li class="d-flex">
                <span class="me-2 fw-medium fw-bold" style="width: 120px;">CNIC:</span>
                <span>${cnic}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>


      <!-- Contact Information -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 fw-bold fs-5 py-3">
            <i class="fas fa-address-book me-2 text-primary"></i>Contact Information
          </div>
          <div class="card-body pt-0">
            <ul class="list-unstyled">
              <li class="mb-3 d-flex">
                <span class="me-2 fw-medium fw-bold" style="width: 120px;">Email:</span>
                <span>${user.email || 'No Email Available'}</span>
              </li>
              <li class="mb-3 d-flex">
                <span class="me-2 fw-medium fw-bold" style="width: 120px;">Phone:</span>
                <span>+92 ${phone}</span>
              </li>
              <li class="mb-3 d-flex">
                <span class="me-2 fw-medium fw-bold" style="width: 120px;">Address:</span>
                <span>${address}</span>
              </li>
              <li class="mb-3 d-flex">
                <span class="me-2 fw-medium fw-bold" style="width: 120px;">ID:</span>
                <span>${user.uid.substring(0, 8).toUpperCase()}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Enrolled Courses Section -->
    <div class="card border-0 shadow-sm mt-4">
      <div class="card-header bg-white border-0 fw-bold fs-5 py-3">
        <i class="fas fa-book me-2 text-primary"></i>Enrolled Courses
      </div>
      <div class="card-body">
        ${enrolledCourses && enrolledCourses.length > 0 ? `
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Instructor</th>
                  <th>Enrollment Date</th>
                </tr>
              </thead>
              <tbody>
                ${enrolledCourses.map(course => `
                  <tr>
                    <td>${course.name || 'N/A'}</td>
                    <td>${course.trainer || 'N/A'}</td>
                    <td>${moment(course.enrollmentDate).format('MMM D, YYYY')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="text-center py-4">
            <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No Courses Enrolled Yet</h5>
            <p class="text-muted">You haven't enrolled in any courses yet.</p>
          </div>
        `}
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="d-flex justify-content-end flex-wrap gap-3 mt-4">
      <button class="btn btn-outline-primary" id="idUpdatePassword">
        <i class="fa-solid fa-unlock"></i> Update Password
      </button>
      <button class="btn btn-outline-primary" id="profileUpdated">
        <i class="fas fa-edit me-2"></i>Edit Picture
      </button>
      <button class="btn btn-outline-primary" id="EditProfile">
        <i class="fas fa-edit me-2"></i>Edit Profile
      </button>
    </div>

  </div>

  <!-- ID Card Section -->
    <div class="row full-download">
      <div class="col-12">
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-0 fw-bold fs-5 py-3">
            <i class="fas fa-id-badge me-2 text-primary"></i>Student ID Card
          </div>
          <div class="card-body">
            <!-- Printable ID Card -->
            <div id="printableIdCard" class="border border-2 rounded-3 p-4 bg-white" style="max-width: 400px;">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-cXFuavrc6SQ1s7DJvs55FQ-BF0bqYSM-iw&s" alt="University Logo" style="height: 40px;">
                <div class="text-end">
                  <small class="text-muted d-block">Valid Until: 12/2025</small>
                  <small class="text-muted">ID: ${user.uid.substring(0, 8).toUpperCase()}</small>
                </div>
              </div>
              
              <div class="text-center mb-3">
                <img src="${user.photoURL || 'https://www.w3schools.com/howto/img_avatar.png'}" 
                    class="rounded-circle border border-2" 
                    style="width: 100px; height: 100px; object-fit: cover;">
              </div>
              
              <div class="text-center mb-3">
                <h4 class="mb-1 fw-bold">${fullName}</h4>
                <div class="text-muted mb-2">${user.email}</div>
                <span class="badge bg-primary">Student</span>
              </div>
              
              <hr>
              
              <div class="row small">
                <div class="col-6">
                  <div class="mb-1"><strong>DOB:</strong> ${moment(dob).format('L')}</div>
                  <div><strong>CNIC:</strong> ${cnic}</div>
                </div>
                <div class="col-6 text-end">
                  <div class="mb-1"><strong>Phone:</strong> +92 ${phone}</div>
                  <div class="text-truncate"><strong>ID:</strong> ${user.uid.substring(0, 8).toUpperCase()}</div>
                </div>
              </div>
              
              <div class="mt-3 text-center">
                <small class="text-muted">This card is property of University</small>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="mt-4 d-flex gap-3">
              <button id="downloadIdCard" class="btn btn-outline-primary px-4">
                <i class="fas fa-download me-2"></i>Download
              </button>
            </div>
          </div>
        </div>
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

  document.getElementById("downloadIdCard").addEventListener("click", () => {
    const profileElement = document.querySelector(".row.full-download");

    html2canvas(profileElement, {
      scale: 3,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "profile-id-card.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });




  // Attach event listeners for buttons
  document.getElementById("idUpdatePassword").addEventListener("click", passwordReset);
  document.getElementById("profileUpdated").addEventListener("click", ProfileUpdate);
  document.getElementById("EditProfile").addEventListener("click", getUserData);

}
















