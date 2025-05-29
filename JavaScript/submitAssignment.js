import { auth, onAuthStateChanged, doc, getDoc, db, updateDoc, arrayUnion, serverTimestamp } from "../fireBase.js"




let assignment = document.getElementById("assignment")
let mainContent = document.getElementById("mainContent");



let checkAssignment = () => {

  mainContent.innerHTML = `
<div class="container my-4 p-4 border rounded shadow-sm" style="max-width: 500px;">
  <h3 class="mb-3">Assignment Submission</h3>
  
  <div id="assignmentForm">
    <div class="mb-3">
      <label for="studentName" class="form-label">Student Name</label>
      <input type="text" id="studentName" class="form-control" placeholder="Enter your full name" required>
    </div>
    <div class="mb-3">
      <label for="assignmentName" class="form-label">Assignment Name</label>
      <input type="text" id="assignmentName" class="form-control" placeholder="Enter your Assigment name" required>
    </div>
    
    <div class="mb-3">
      <label for="assignmentFile" class="form-label">Upload Assignment</label>
      <input type="file" id="assignmentFile" class="form-control" accept=".pdf,.doc,.docx,.zip" required>
      <small class="form-text text-muted">Allowed formats: PDF, DOC, DOCX, ZIP</small>
    </div>
    
    <button type="button" class="btn btn-primary">Submit Assignment</button>
  </div>
  
  <div id="submissionStatus" class="mt-3"></div>
</div>`

  const assignmentForm = document.getElementById('assignmentForm');
  const submissionStatus = document.getElementById('submissionStatus');

  assignmentForm.addEventListener('click', function () {

    let studentName = document.getElementById('studentName').value.trim();
    let assignmentName = document.getElementById('assignmentName').value.trim();
    let assignmentFile = document.getElementById('assignmentFile').files[0];

    if (!studentName) {
      submissionStatus.innerHTML = `<div class="alert alert-danger">Please enter your name.</div>`;
      return;
    }

    if (!assignmentName) {
      submissionStatus.innerHTML = `<div class="alert alert-danger">Please enter your Assignment name.</div>`;
      return;
    }

    if (!assignmentFile) {
      submissionStatus.innerHTML = `<div class="alert alert-danger">Please upload your assignment file.</div>`;
      return;
    }


    const maxFileSize = 5 * 1024 * 1024;
    if (assignmentFile.size > maxFileSize) {
      submissionStatus.innerHTML = `<div class="alert alert-danger">File size must be less than 5MB.</div>`;
      return;
    }

    submissionStatus.innerHTML = `<div class="alert alert-info">Submitting your assignment...</div>`;


    // Get current user
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
         
          const userDocRef = doc(db, "usersInfo", user.uid);

          const newAssignment = {
            studentName,
            assignmentName,
            submittedAt: new Date(),
            assignmentFileName: assignmentFile.name,
          };

          // Update user's assignments array (append new assignment)
          await updateDoc(userDocRef, {
            assignments: arrayUnion(newAssignment),
          });

          submissionStatus.innerHTML = `<div class="alert alert-success">Assignment submitted successfully. Thank you, ${studentName}!</div>`;

          document.getElementById('studentName').value = "";
          document.getElementById('assignmentName').value = "";
          document.getElementById('assignmentFile').value = "";

          window.location.replace("/dashboard.html")

        } catch (error) {
          submissionStatus.innerHTML = `<div class="alert alert-danger">Error submitting assignment: ${error.message}</div>`;
        }
      } else {
        submissionStatus.innerHTML = `<div class="alert alert-danger">You must be logged in to submit assignments.</div>`;
      }
    });


  });

}

assignment.addEventListener('click', checkAssignment)
