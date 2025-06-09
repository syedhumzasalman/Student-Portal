import { doc, getDocs, collection, db, getDoc, setDoc, query, where, deleteDoc } from "../fireBase.js"



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
          <div class="">
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
                  <span class="text-truncate">${moment(user.dateOfBirth).format('[🗓️] dddd - MMM Do, YYYY') || 'N/A'}</span>
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
                
                <div class="dropdown">
                  <button class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                          type="button" 
                          data-bs-toggle="dropdown">
                    Actions
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item edit-btn" href="#" data-id="${user.id}" id="uEdit"><i class="fas fa-edit me-2"></i>Edit</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger delete-btn" href="#" data-id="${user.id}" id="uDelete"><i class="fas fa-trash-alt me-2"></i>Delete</a></li>
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
          </div>
        ` : ''}
      </div>
    `;


    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const userId = e.currentTarget.dataset.id;
        editUser(userId);
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const userId = e.currentTarget.dataset.id;
        await deleteUser(userId);
      });
    });

  } catch (err) {
    console.error("Error loading students:", err);
    mainContainer.innerHTML = `<div class="alert alert-danger">Failed to load students.</div>`;
  }
};

totalStudents.addEventListener('click', addStudents)






const editUser = async (userId) => {

  const userRef = doc(db, "usersInfo", userId);
  const userSnap = await getDoc(userRef);
  const user = userSnap.data();


  mainContainer.innerHTML = `
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0"><i class="fas fa-user-plus me-2"></i>Edit User</h4>
          </div>
          <div class="card-body" id="userFormDiv">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="fullName" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="fullName" placeholder="Enter full name" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="dob" class="form-label">Date of Birth</label>
                <input type="date" class="form-control" id="dob" required>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Gender</label>
              <div class="d-flex gap-3">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="gender" id="male" value="male">
                  <label class="form-check-label" for="male">Male</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="gender" id="female" value="female">
                  <label class="form-check-label" for="female">Female</label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="cnic" class="form-label">CNIC</label>
                <input type="text" class="form-control" id="cnic" placeholder="XXXXX-XXXXXXX-X" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <div class="input-group">
                  <span class="input-group-text">+92</span>
                  <input type="tel" class="form-control" id="phone" placeholder="3001234567" required>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label for="address" class="form-label">Address</label>
              <textarea class="form-control" id="address" rows="3"></textarea>
            </div>
            <div class="d-grid gap-2">
              <button id="saveUserBtn" class="btn btn-primary">
                <i class="fas fa-save me-2"></i>Save User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  document.getElementById("userFormDiv").insertAdjacentHTML('afterbegin', `
    <input type="hidden" id="emailInput" value="${user.email || ''}">
  `);

  document.getElementById("saveUserBtn").addEventListener("click", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const dateOfBirth = document.getElementById("dob").value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value || "";
    const CNIC = document.getElementById("cnic").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("emailInput").value.trim();

    if (!fullName || !dateOfBirth || !gender || !CNIC || !phone) {
      swal("Validation Error", "Please fill in all required fields.", "warning");
      return;
    }

    try {
      await setDoc(userRef, {
        fullName,
        dateOfBirth,
        gender,
        CNIC,
        phone,
        address,
        email,
        verify: user.verify || false,
      });

      Swal.fire("Success!", "User data saved successfully.", "success").then(() => {
        clearForm();
        addStudents();
      });
    } catch (error) {
      console.error("Error saving user:", error);
      Swal.fire("Error", "Failed to save user data.", "error");
    }
  });
};

function clearForm() {
  document.getElementById("emailInput").value = "";
  document.getElementById("fullName").value = "";
  document.getElementById("dob").value = "";
  document.getElementById("cnic").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("address").value = "";
  const checkedGender = document.querySelector('input[name="gender"]:checked');
  if (checkedGender) checkedGender.checked = false;
}


const deleteUser = async (userId) => {
  try {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "usersInfo", userId));
      Swal.fire("Deleted!", "User has been deleted.", "success");
      addStudents();  // Refresh UI
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    Swal.fire("Error", "Failed to delete user.", "error");
  }
};