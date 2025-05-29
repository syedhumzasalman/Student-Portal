import { auth, onAuthStateChanged, doc, getDocs, collection, db } from "../fireBase.js"
import { getUserData } from "/JavaScript/addUserInfo.js"


let totalStudents = document.getElementById("totalStudents");
let mainContainer = document.getElementById("main-container");


export const addStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "usersInfo"));
    const users = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      users.push({ id: docSnap.id, ...data });
    });

    mainContainer.innerHTML = `
      <div class="container my-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-3 bg-light rounded-3">
          <div>
            <h3 class="fw-bold">Student Records</h3>
            <div class="d-flex align-items-center">
              <span class="badge bg-primary rounded-pill me-2">
                <i class="fas fa-users me-1"></i> 
                <span id="totalStudents">${users.length}</span> Total
              </span>
            </div>
          </div>
          
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      ${users.map(user => `
        <div class="col">
          <div class="card h-100 border-0 shadow-sm hover-shadow">
            <div class="card-header bg-white border-0 pb-0">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title mb-1 fw-semibold text-truncate">${user.fullName || 'No Name'}</h5>
              </div>
              <p class="text-muted small mb-2">ID: ${user.id.substring(0, 8).toUpperCase()}</p>
            </div>
            <div class="card-body pt-2">
              <ul class="list-unstyled mb-3">
                <li class="mb-2 d-flex">
                  <span class="me-2 text-muted"><i class="fas fa-envelope"></i></span>
                  <span class="text-truncate">${user.email || 'N/A'}</span>
                </li>
                <li class="mb-2 d-flex">
                  <span class="text-truncate">${user.verify == true ? "✅ Email Verified" : "❌ Email Not-Verified"}</span>
                </li>
                <li class="mb-2 d-flex">
                  <span class="me-2 text-muted"><i class="fas fa-phone"></i></span>
                  <span>${user.phone || 'N/A'}</span>
                </li>
                <li class="mb-2 d-flex">
                  <span class="me-2 text-muted"><i class="fas fa-venus-mars"></i></span>
                  <span>${user.gender || 'N/A'}</span>
                </li>
                <li class="d-flex">
                  <span class="me-2 text-muted"><i class="fas fa-id-card"></i></span>
                  <span>${user.CNIC || 'N/A'}</span>
                </li>
              </ul>
            </div>
            <div class="card-footer bg-white border-0 pt-0">
              <div class="d-flex justify-content-between">
                <button class="btn btn-sm btn-outline-primary view-btn" data-id="${user.id}">
                  <i class="fas fa-eye me-1"></i> View
                </button>
                <div class="dropdown">
                  <button class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                          type="button" 
                          data-bs-toggle="dropdown">
                    Actions
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item edit-btn" href="#" data-id="${user.id}"><i class="fas fa-edit me-2"></i>Edit</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger delete-btn" href="#" data-id="${user.id}"><i class="fas fa-trash-alt me-2"></i>Delete</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
        ${users.length === 0 ? `
          <div class="text-center py-5 my-5">
            <i class="fas fa-user-slash fa-3x text-muted mb-3"></i>
            <h4 class="text-muted">No Students Found</h4>
            <p class="text-muted">Add new students to get started</p>
            <button id="addFirstBtn" class="btn btn-primary px-4">
              <i class="fas fa-user-plus me-2"></i>Add First Student
            </button>
          </div>
        ` : ''}
      </div>
    `;

  } catch (err) {
    console.error("Error loading students:", err);
    mainContainer.innerHTML = `<div class="alert alert-danger">Failed to load students.</div>`;
  }
};

totalStudents.addEventListener('click', addStudents)