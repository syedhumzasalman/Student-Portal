import { auth, onAuthStateChanged, doc, getDoc, db, updateDoc, arrayUnion } from "../fireBase.js";

let assignment = document.getElementById("assignment");
let mainContent = document.getElementById("mainContent");


let checkAssignment = () => {
  mainContent.innerHTML = `
<div class="container my-4 p-4 border rounded shadow-sm" style="max-width: 600px;">
  <h3 class="mb-3">Assignment Submission</h3>
  
  <div id="assignmentForm">
    <div class="mb-3">
      <label for="studentName" class="form-label">Student Name</label>
      <input type="text" id="studentName" class="form-control" placeholder="Enter your full name" required>
    </div>
    <div class="mb-3">
      <label for="assignmentName" class="form-label">Assignment Name</label>
      <input type="text" id="assignmentName" class="form-control" placeholder="Enter your Assignment name" required>
    </div>
    
    <div class="mb-3">
      <label for="assignmentUrl" class="form-label">Assignment URL (optional)</label>
      <input type="url" id="assignmentUrl" class="form-control" placeholder="Paste drive or file URL">
      <small class="form-text text-muted">Use this only if you’re not uploading a file.</small>
    </div>

    <div class="mb-3">
      <label for="assignmentFile" class="form-label">Upload Assignment</label>
      <input type="file" id="assignmentFile" class="form-control" accept=".pdf,.doc,.docx,.zip">
      <small class="form-text text-muted">Allowed formats: PDF, DOC, DOCX, ZIP</small>
    </div>
    
    <button type="button" id="submitBtn" class="btn btn-primary">Submit Assignment</button>
  </div>
  
  <div id="submissionStatus" class="mt-3"></div>
</div>`;

  const assignmentForm = document.getElementById('assignmentForm');
  const submissionStatus = document.getElementById('submissionStatus');

  assignmentForm.querySelector('#submitBtn').addEventListener('click', function () {
    let studentName = document.getElementById('studentName').value.trim();
    let assignmentName = document.getElementById('assignmentName').value.trim();
    let assignmentFile = document.getElementById('assignmentFile').files[0];
    let assignmentUrl = document.getElementById('assignmentUrl').value.trim();

    // Basic validation
    if (!studentName) {
      submissionStatus.innerHTML = `<div class="alert alert-danger">Please enter your name.</div>`;
      return;
    }

    if (!assignmentName) {
      submissionStatus.innerHTML = `<div class="alert alert-danger">Please enter your assignment name.</div>`;
      return;
    }

    if (assignmentFile && assignmentUrl) {
      submissionStatus.innerHTML = `<div class="alert alert-danger">Please either upload a file or provide a URL.</div>`;
      return;
    }

    if (assignmentFile && assignmentFile.size > 5 * 1024 * 1024) {
      submissionStatus.innerHTML = `<div class="alert alert-danger">File size must be less than 5MB.</div>`;
      return;
    }

    submissionStatus.innerHTML = `<div class="alert alert-info">Submitting your assignment...</div>`;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "usersInfo", user.uid);
          const userSnap = await getDoc(userDocRef);

          let existingAssignments = [];
          if (userSnap.exists()) {
            existingAssignments = userSnap.data().assignments || [];
          }

          let newAssignment = {
            studentName,
            assignmentName,
            submittedAt: new Date(),
            assignmentFileName: assignmentFile ? assignmentFile.name : null,
            assignmentURL: assignmentUrl || null,
            assignmentNumber: existingAssignments.length + 1,
          };

          await updateDoc(userDocRef, {
            assignments: arrayUnion(newAssignment),
          });



          // console.log(userSnap.data().assignments);


          submissionStatus.innerHTML = `<div class="alert alert-success">Assignment submitted successfully. Thank you, ${studentName}!</div>`;


          document.getElementById('studentName').value = "";
          document.getElementById('assignmentName').value = "";
          document.getElementById('assignmentFile').value = "";
          document.getElementById('assignmentUrl').value = "";

          setTimeout(() => {
            window.location.replace("/dashboard.html");
          }, 2000);

        } catch (error) {
          submissionStatus.innerHTML = `<div class="alert alert-danger">Error submitting assignment: ${error.message}</div>`;
        }
      } else {
        submissionStatus.innerHTML = `<div class="alert alert-danger">You must be logged in to submit assignments.</div>`;
      }
    });
  });
}

assignment.addEventListener('click', checkAssignment);



let assigmentCount = document.getElementById("assigmentCount");

const loadAssignmentCount = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user && assigmentCount) {
      try {
        const userDocRef = doc(db, "usersInfo", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const assignments = userSnap.data().assignments || [];
          assigmentCount.innerText = assignments.length;
        }
      } catch (error) {
        console.error("Error loading assignment count:", error);
      }
    }
  });
};

window.addEventListener("DOMContentLoaded", loadAssignmentCount);