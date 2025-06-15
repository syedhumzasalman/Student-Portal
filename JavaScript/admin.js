import { auth, onAuthStateChanged, doc, getDocs, collection, db } from "../fireBase.js"



let activeCourses = document.getElementById("activeCourses");
let totalStudent = document.getElementById("totalStudent");
let totalAssignment = document.getElementById("totalAssignment");

// Total students count function
let countTotalStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "usersInfo"));

    let totalEnrolledCourses = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.enrolledCourses && Array.isArray(data.enrolledCourses)) {
        totalEnrolledCourses += data.enrolledCourses.length;
      }
    });

    const total = querySnapshot.size;
    totalStudent.textContent = `${total}`;
    totalAssignment.textContent = `${totalEnrolledCourses}`;
  } catch (err) {
    console.error("Error getting students count:", err);
    totalStudent.textContent = "Err";
    totalAssignment.textContent = "Err";
  }
};

// Total courses count function
let getCoursesCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const total = querySnapshot.size;
    activeCourses.textContent = `${total}`;
  } catch (err) {
    console.error("Error getting courses count:", err);
    activeCourses.textContent = "Err";
  }
};

// Call functions
getCoursesCount();
countTotalStudents();



let getAssignment = document.getElementById("getAssignment");


let getUserAssignments = async () => {

  try {
    const querySnapshot = await getDocs(collection(db, "usersInfo"));


    querySnapshot.forEach((docSnap) => {
      let data = docSnap.data();
      let assignments = data.assignments || [];

      // console.log(docSnap);


      assignments.forEach((assignment) => {
        let date = assignment.submittedAt?.toDate
          ? moment(assignment.submittedAt.toDate()).calendar()
          : "N/A";

        getAssignment.innerHTML += `
        <tr>
          <td>
              <h6 class="mb-0">${assignment.studentName}</h6>
              <small class="text-muted">${docSnap.id.substring(0, 8).toUpperCase() || "N/A"}</small>
              </div>
            </div>
          </td>
          <td>${assignment.assignmentName}</td>
          <td>${date}</td>
          <td>
            ${assignment.assignmentURL
            ? `<a href="${assignment.assignmentURL}" target="_blank" class="btn btn-sm btn-outline-primary"><i class="fas fa-eye"></i></a>`
            : assignment.assignmentFileName
              ? `<a href="${assignment.assignmentFileName}" target="_blank" class="btn btn-sm btn-outline-primary"><i class="fas fa-eye"></i></a>`
              : `<button class="btn btn-sm btn-outline-secondary" disabled><i class="fas fa-eye-slash"></i></button>`
          }
          </td>
        </tr>`;
      });
    });



  } catch (err) {
    console.error("Error getting students count:", err);

  }




}

getUserAssignments()