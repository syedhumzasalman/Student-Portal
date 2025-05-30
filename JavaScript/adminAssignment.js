import { auth, onAuthStateChanged, doc, getDocs, collection, db } from "../fireBase.js";

let mainContainer = document.getElementById("main-container");
let showAssignment = document.getElementById("showAssignment");

let clickAssignment = async () => {
    mainContainer.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "usersInfo"));

        // Filter dropdown
        mainContainer.innerHTML += `
      <div class="mb-3">
        <select id="userFilter" class="form-select w-auto">
          <option value="all">Show All Students</option>
        </select>
      </div>`;


        querySnapshot.forEach((docSnap) => {
            let data = docSnap.data();
            let assignments = data.assignments || [];
            let studentName = data.fullName || "Unknown";
            let userId = docSnap.id;


            let assignmentRows = assignments.map((assignment) => {
                let date = assignment.submittedAt?.toDate
                    ? moment(assignment.submittedAt.toDate()).calendar()
                    : "N/A";

                return `
          <tr>
            <td class="ps-3">${assignment.assignmentName}</td>
            <td>${date}</td>
            <td class="text-end pe-3">
              ${assignment.assignmentURL
                    ? `<a href="${assignment.assignmentURL}" target="_blank" class="btn btn-sm btn-outline-primary"><i class="fas fa-eye"></i></a>`
                    : assignment.assignmentFileName
                        ? `<a href="${assignment.assignmentFileName}" target="_blank" class="btn btn-sm btn-outline-primary"><i class="fas fa-eye"></i></a>`
                        : `<button class="btn btn-sm btn-outline-secondary" disabled><i class="fas fa-eye-slash"></i></button>`}
            </td>
          </tr>`;
            }).join("");

            // Render user assignment card
            mainContainer.innerHTML += `
        <div class="card shadow-sm mb-4 user-card" data-user="${userId}">
          <div class="card-header bg-primary bg-gradient text-white d-flex justify-content-between align-items-center py-2">
            <h5 class="mb-0"><i class="fas fa-user-graduate me-2"></i>${studentName}</h5>
            <span class="badge bg-light text-dark"><i class="fas fa-id-card me-1"></i>${userId.substring(0, 8).toUpperCase()}</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="ps-3">Assignment</th>
                    <th>Due Date</th>
                    <th class="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>${assignmentRows}</tbody>
              </table>
            </div>
          </div>
          <div class="card-footer bg-transparent py-2">
            <small class="text-muted"><i class="fas fa-sync-alt me-1"></i>Last updated: ${new Date().toLocaleDateString()}</small>
          </div>
        </div>`;
        });


    } catch (err) {
        console.error("Error getting students count:", err);
    }
};

showAssignment.addEventListener('click', clickAssignment);
