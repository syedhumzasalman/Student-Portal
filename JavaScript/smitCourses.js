import { auth, db, collection, setDoc, updateDoc, addDoc, getDocs, query, where, onAuthStateChanged } from "../fireBase.js";

const smitCourses = [
  {
    course: "Web & Mobile App Development",
    trainer: "@codewithlari",
    btn: "Enroll",
    level: "Intermediate",
    youtube: "https://www.youtube.com/watch?v=2esQdKzRUCw"
  },
  {
    course: "Python Programming",
    trainer: "freeCodeCamp.org",
    btn: "Enroll",
    level: "Beginner",
    youtube: "https://www.youtube.com/watch?v=eWRfhZUzrAc"
  },
  {
    course: "Graphic Designing",
    trainer: "Ubaid UR Rehman",
    btn: "Enroll",
    level: "Beginner",
    youtube: "https://www.youtube.com/watch?v=e_dv7GBHka8"
  },
  {
    course: "Video Editing & Animation",
    trainer: "Justin Brown - Primal Video",
    btn: "Enroll",
    level: "Intermediate",
    youtube: "https://www.youtube.com/watch?v=sNjyOSADDxE"
  },
  {
    course: "AI & Chatbot Development",
    trainer: "freeCodeCamp.org",
    btn: "Enroll",
    level: "Advanced",
    youtube: "https://www.youtube.com/watch?v=jCoH82LPgdk"
  },
  {
    course: "Mobile App Development (Flutter)",
    trainer: "freeCodeCamp.org",
    btn: "Enroll",
    level: "Intermediate",
    youtube: "https://www.youtube.com/watch?v=VPvVD8t02U8"
  },
  {
    course: "Cyber Security",
    trainer: "Edureka",
    btn: "Enroll",
    level: "Advanced",
    youtube: "https://www.youtube.com/playlist?list=PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_"
  },
  {
    course: "CCO (Certified Computer Operator)",
    trainer: "Learn More",
    btn: "Enroll",
    level: "Beginner",
    youtube: "https://www.youtube.com/watch?v=yjyWI9wDYNs"
  },
  {
    course: "Cloud Computing (AWS)",
    trainer: "Simplilearn",
    btn: "Enroll",
    level: "Advanced",
    youtube: "https://www.youtube.com/watch?v=HK_q1lH5x5M"
  },
  {
    course: "Blockchain Development",
    trainer: "Simplilearn",
    btn: "Enroll",
    level: "Advanced",
    youtube: "https://www.youtube.com/watch?v=3fUZENyWpB0"
  },
  {
    course: "UI/UX Designing",
    trainer: "Intellipaat",
    btn: "Enroll",
    level: "Intermediate",
    youtube: "https://www.youtube.com/watch?v=BU_afT-aIn0"
  },
  {
    course: "Data Science",
    trainer: "Edureka",
    btn: "Enroll",
    level: "Advanced",
    youtube: "https://www.youtube.com/watch?v=-ETQ97mXXF0"
  },
  {
    course: "Networking (CCNA)",
    trainer: "Flackbox",
    btn: "Enroll",
    level: "Intermediate",
    youtube: "https://www.youtube.com/watch?v=H8W9oMNSuwo"
  },
  {
    course: "SEO & Digital Marketing",
    trainer: "Simplilearn",
    btn: "Enroll",
    level: "Intermediate",
    youtube: "https://www.youtube.com/watch?v=VFvgbsrTeqQ"
  },
  {
    course: "Amazon FBA VA",
    trainer: "Carter Maxwell",
    btn: "Enroll",
    level: "Beginner",
    youtube: "https://www.youtube.com/watch?v=ldmOBbmwgcQ"
  },
  {
    course: "3D Modeling & Animation",
    trainer: "Flutter Mapp",
    btn: "Enroll",
    level: "Intermediate",
    youtube: "https://www.youtube.com/watch?v=3kaGC_DrUnw"
  },
  {
    course: "Laravel PHP",
    trainer: "freeCodeCamp.org",
    btn: "Enroll",
    level: "Intermediate",
    youtube: "https://www.youtube.com/watch?v=ImtZ5yENzgE"
  },
  {
    course: "MERN Stack Development",
    trainer: "freeCodeCamp.org",
    btn: "Enroll",
    level: "Advanced",
    youtube: "https://www.youtube.com/watch?v=4Z2Z23SAFVA"
  },
  {
    course: "Java Programming",
    trainer: "freeCodeCamp.org",
    btn: "Enroll",
    level: "Intermediate",
    youtube: "https://www.youtube.com/watch?v=grEKMHGYyns"
  },
  {
    course: "ASP.NET Core",
    trainer: "freeCodeCamp.org",
    btn: "Enroll",
    level: "Advanced",
    youtube: "https://www.youtube.com/watch?v=C5cnZ-gZy2I"
  },
  {
    course: "WordPress Development",
    trainer: "freeCodeCamp.org",
    btn: "Enroll",
    level: "Beginner",
    youtube: "https://www.youtube.com/watch?v=8AZ8GqW5iak"
  },
  {
    course: "Dynamo + Revit",
    trainer: "BIM it",
    btn: "Enroll",
    level: "Intermediate",
    youtube: "https://www.youtube.com/watch?v=1sP0Oa3u3xE"
  }
];




let mainContent = document.getElementById("mainContent");
let saylaniCourses = document.getElementById("saylaniCourses");



let courses = () => {
  const courseTable = `
    <div class="card border-0 shadow-sm my-4 mx-2">
  <div class="card-header bg-white border-0 py-3">
    <h5 class="mb-0"><i class="fas fa-book-open me-2"></i>Available Courses</h5>
    <p class="text-muted small mb-0 mt-1">${smitCourses.length} courses available</p>
  </div>
  <div class="card-body p-0">
    <div class="table-responsive">
      <table class="table table-hover mb-0 align-middle">
        <thead class="table-light">
          <tr>
            <th>Course</th>
            <th>Instructor</th>
            <th>Level</th>
            <th class="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          ${smitCourses.map(smit => `
            <tr>
              <td>
                <div class="d-flex align-items-center">
                  <div class="course-icon me-3">
                    <i class="fas fa-laptop-code text-primary"></i>
                  </div>
                  <div class="text-truncate" style="max-width: 150px;">
                    <h6 class="mb-0">${smit.course}</h6>
                  </div>
                </div>
              </td>
              <td>${smit.trainer}</td>
              <td>
                <span class="badge bg-light text-dark">
                  <i class="far fa-clock me-1"></i>${smit.level}
                </span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm enroll-btn btn-outline-primary">
                  ${smit.btn}
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>

  `;
  mainContent.innerHTML = courseTable;



  setTimeout(async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first to see your enrollments.");
      return;
    }

    const enrollButtons = document.querySelectorAll(".enroll-btn");

    // Fetch user's enrolled courses from Firestore
    const q = query(collection(db, "enrollments"), where("userEmail", "==", user.email));
    const querySnapshot = await getDocs(q);

    // Create a Set of enrolled course names for quick lookup
    const enrolledCourses = new Set();
    querySnapshot.forEach(doc => {
      enrolledCourses.add(doc.data().courseName);
    });

    enrollButtons.forEach((btn, index) => {
      const courseName = smitCourses[index].course;

      // If already enrolled, disable and style button
      if (enrolledCourses.has(courseName)) {
        btn.textContent = "Enrolled";
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-success");
        btn.disabled = true;
        return;
      }


      btn.addEventListener("click", async () => {
        try {
          await addDoc(collection(db, "enrollments"), {

            userEmail: user.email,
            courseName: courseName,
            trainer: smitCourses[index].trainer,
            level: smitCourses[index].level,
            youtube: smitCourses[index].youtube,
            status: "NotComplete",
            timestamp: new Date()
          });

          btn.textContent = "Enrolled";
          btn.classList.remove("btn-outline-primary");
          btn.classList.add("btn-success");
          btn.disabled = true;
        } catch (error) {
          console.error("Error adding enrollment: ", error);
          alert("Failed to enroll, try again.");
        }
      });
    });
  }, 0);

}


saylaniCourses.addEventListener("click", courses)




onAuthStateChanged(auth, (user) => {
  if (user) {
    dashboardCourse();
  } else {
    let dashCourses = document.getElementById("dashCourses");
    dashCourses.innerHTML = `<tr><td colspan="5" class="text-center">Please login to see your courses.</td></tr>`;
  }
});



const dashboardCourse = async () => {
  let dashCourses = document.getElementById("dashCourses");
  const user = auth.currentUser;

  dashCourses.innerHTML = `<tr><td colspan="5" class="text-center">Loading...</td></tr>`;

  try {
    const q = query(collection(db, "enrollments"), where("userEmail", "==", user.email));
    const querySnapshot = await getDocs(q);

    const enrolledCoursesMap = new Map();

    querySnapshot.forEach(doc => {
      const data = doc.data();
      enrolledCoursesMap.set(data.courseName, data.status || "enrolled");
    });

    const filteredCourses = smitCourses.filter(course => enrolledCoursesMap.has(course.course));

    if (filteredCourses.length === 0) {
      dashCourses.innerHTML = `<tr><td colspan="5" class="text-center">You have not enrolled in any courses yet.</td></tr>`;
      return;
    }

    const enrolledCoursesCount = document.getElementById("enrolledCoursesCount");
    if (enrolledCoursesCount) {
      enrolledCoursesCount.innerText = filteredCourses.length;
    }

    let completedCount = 0;

    dashCourses.innerHTML = `
      ${filteredCourses.map((smit, index) => {
        const status = enrolledCoursesMap.get(smit.course);
        const isCompleted = status === "completed";
        if (isCompleted) completedCount++;

        return `
          <tr>
            <td>
              <div class="d-flex align-items-center">
                <div class="course-icon me-3">
                  <i class="fas fa-laptop-code text-primary"></i>
                </div>
                <div>
                  <h6 class="mb-0">${smit.course}</h6>
                </div>
              </div>
            </td>
            <td>${smit.trainer}</td>
            <td>
              <span class="badge bg-light text-dark">
                <i class="far fa-clock me-1"></i>${smit.level}
              </span>
            </td>
            <td>
              <a href="${smit.youtube}" target="_blank" class="btn btn-sm btn-link p-0 view-course" data-index="${index}">
                View Course
              </a>
            </td>
            <td class="text-end">
              <button class="btn btn-sm ${isCompleted ? 'btn-success' : 'btn-secondary'} course-status-btn" disabled>
                ${isCompleted ? 'Completed' : 'Enrolled'}
              </button>
            </td>
          </tr>
        `;
      }).join('')}
    `;

    const completeCourseCounter = document.getElementById("completeCourse");
    if (completeCourseCounter) {
      completeCourseCounter.innerText = completedCount;
    }

    const viewLinks = document.querySelectorAll(".view-course");
    const statusButtons = document.querySelectorAll(".course-status-btn");

    viewLinks.forEach((link, index) => {
      link.addEventListener("click", async () => {
        const courseName = filteredCourses[index].course;
        const q = query(
          collection(db, "enrollments"),
          where("userEmail", "==", user.email),
          where("courseName", "==", courseName)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const statusBtn = statusButtons[index];
          const docRef = querySnapshot.docs[0].ref;

          await updateDoc(docRef, { status: "completed" });

          statusBtn.innerText = "Completed";
          statusBtn.classList.remove("btn-secondary");
          statusBtn.classList.add("btn-success");

          // Update completed counter
          completedCount++;
          if (completeCourseCounter) {
            completeCourseCounter.innerText = completedCount;
          }
        }
      });
    });

  } catch (error) {
    console.error("Error loading dashboard:", error);
    dashCourses.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Failed to load courses.</td></tr>`;
  }
};
