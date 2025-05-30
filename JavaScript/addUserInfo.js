import { auth, onAuthStateChanged, db, doc, getDoc, setDoc } from "../fireBase.js";

let mainContent = document.getElementById("mainContent");
let currentUser = null;

export let getUserData = () => {
    mainContent.innerHTML = ` 
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0"><i class="fas fa-user-plus me-2"></i>Edit Profile</h4>
          </div>
          <div class="card-body">
            <!-- Removed <form> and replaced with div -->
            <div id="userFormDiv">

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
                <div class="d-flex flex-wrap gap-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="gender" id="male" value="male" required>
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
                  <input type="text" class="form-control" id="cnic" placeholder="XXXXX-XXXXXXX-X" pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}" required>
                  <div class="form-text">Format: 12345-1234567-1</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="phone" class="form-label">Phone Number</label>
                  <div class="input-group">
                    <span class="input-group-text">+92</span>
                    <input type="tel" class="form-control" id="phone" placeholder="3001234567" pattern="[0-9]{10}" required>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="address" class="form-label">Address</label>
                <textarea class="form-control" id="address" rows="3" placeholder="Enter full address"></textarea>
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
    </div>
  </div>`;

    const saveBtn = document.getElementById("saveUserBtn");
    let fullName = document.getElementById("fullName").value.trim();
    let dateOfBirth = document.getElementById("dob").value.trim();
    let genderRadio = document.querySelector('input[name="gender"]:checked');
    let gender = genderRadio ? genderRadio.value : "";
    let CNIC = document.getElementById("cnic").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let address = document.getElementById("address").value.trim();


    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;

            const docRef = doc(db, "usersInfo", currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                // console.log(data.fullName);


                fullName = ""
                dateOfBirth = ""
                CNIC = ""
                phone = ""
                address = ""
                if (data.gender) {
                    genderRadio = document.querySelector(`input[name="gender"][value="${data.gender}"]`);
                    if (genderRadio) genderRadio.checked = true;
                }

            } else {

                const checkedGender = document.querySelector('input[name="gender"]:checked');
                if (checkedGender) checkedGender.checked = false;
                document.getElementById("fullName").value = "";
                document.getElementById("dob").value = "";
                document.getElementById("cnic").value = "";
                document.getElementById("phone").value = "";
                document.getElementById("address").value = "";
            }
        } else {
            currentUser = null;
            // Clear inputs when no user
            document.getElementById("fullName").value = "";
            document.getElementById("dob").value = "";
            checkedGender = document.querySelector('input[name="gender"]:checked');
            if (checkedGender) checkedGender.checked = false;
            document.getElementById("cnic").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("address").value = "";
        }
    });

    saveBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        
         fullName = document.getElementById("fullName").value.trim();
         dateOfBirth = document.getElementById("dob").value.trim();
         genderRadio = document.querySelector('input[name="gender"]:checked');
         gender = genderRadio ? genderRadio.value : "";
         CNIC = document.getElementById("cnic").value.trim();
         phone = document.getElementById("phone").value.trim();
         address = document.getElementById("address").value.trim();

        
        if (!fullName || !dateOfBirth || !gender || !CNIC || !phone) {
            swal("Validation Error", "Please fill in all required fields correctly.", "warning");
            return;
        }

        if (!currentUser) {
            swal("Not Logged In", "Please log in to save your data.", "warning");
            return;
        }

        try {
            await setDoc(doc(db, "usersInfo", currentUser.uid), {
                fullName,
                dateOfBirth,
                gender,
                CNIC,
                phone,
                address,
                email: currentUser.email,
                verify: currentUser.emailVerified,
            });

            swal("User Saved!", "User saved successfully.", "success")
            .then(()=>{
                const checkedGender = document.querySelector('input[name="gender"]:checked');
                if (checkedGender) checkedGender.checked = false;
                document.getElementById("fullName").value = "";
                document.getElementById("dob").value = "";
                document.getElementById("cnic").value = "";
                document.getElementById("phone").value = "";
                document.getElementById("address").value = "";
                window.location.replace("/dashboard.html")
            })
        } catch (err) {
            console.error("Error saving user:", err);
            swal("Error!", "Failed to save user.", "error");
        }
    });
};
