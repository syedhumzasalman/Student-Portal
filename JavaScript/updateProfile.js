import { auth, updateProfile } from "../fireBase.js";

let mainContent = document.getElementById("mainContent");
let profileUpdated = document.getElementById("profileUpdated");


export let ProfileUpdate = () => {
    const user = auth.currentUser;

    if (!user) {
        swal("Error", "User not signed in.", "error");
        return;
    }



    mainContent.innerHTML = `
         <div class="card shadow-lg border-0 rounded-4 p-4" style="width: 24rem; margin-left: 2rem;">
  <!-- Header with profile preview -->
  <div class="text-center mb-4">
    <h3 class="fw-bold text-primary mb-1">Update Profile</h3>
    <p class="text-muted small">Keep your information current</p>
  </div>

  <!-- Display Name Field -->
  <div class="mb-3">
    <label for="updateName" class="form-label fw-semibold text-secondary mb-1">Display Name</label>
    <div class="input-group">
      <span class="input-group-text bg-light">
        <i class="bi bi-person text-muted"></i>
      </span>
      <input type="text" 
             class="form-control py-2" 
             id="updateName" 
             placeholder="Enter your name"
             oninput="updateAvatarPreview()">
    </div>
  </div>

  <!-- Photo URL Field -->
  <div class="mb-4">
    <label for="updatePhoto" class="form-label fw-semibold text-secondary mb-1">Profile Photo URL</label>
    <div class="input-group">
      <span class="input-group-text bg-light">
        <i class="bi bi-image text-muted"></i>
      </span>
      <input type="url" 
             class="form-control py-2" 
             id="updatePhoto" 
             placeholder="Paste image URL"
             oninput="updateAvatarPreview()">
    </div>
    <div class="form-text">Leave blank to use generated avatar</div>
  </div>

  <!-- Update Button -->
  <button id="update-profile-btn" class="btn btn-primary w-100 py-2 fw-semibold">
    <span class="spinner-border spinner-border-sm d-none" id="updateSpinner"></span>
    <span id="updateText">Update Profile</span>
  </button>

  <!-- Success Message -->
  <div class="alert alert-success mt-3 mb-0 d-none d-flex align-items-center" id="updateSuccess">
    <i class="bi bi-check-circle-fill me-2"></i>
    <span>Profile updated successfully!</span>
  </div>
</div>

`



    document.getElementById("update-profile-btn").addEventListener("click", () => {
        let name = document.getElementById("updateName").value.trim();
        let url = document.getElementById("updatePhoto").value.trim();

        if (!name && !url) {
            swal("Warning", "At Least one field Must Required name and photo URL.", "warning");
            return;
        }

        updateProfile(user, {
            displayName: name,
            photoURL: url
        }).then(() => {
            swal("Success", "Profile updated successfully.", "success")
                .then(() => location.reload());
        }).catch((error) => {
            swal("Error", error.message, "error");
        });
    });


}

