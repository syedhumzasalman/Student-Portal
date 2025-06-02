import {
    doc,
    db,
    collection,
    getDocs,
    updateDoc,
    arrayUnion,
    query,
    where
} from "../fireBase.js";





const mainContainer = document.getElementById("main-container");
const courses = document.getElementById("courses");

let coursesFun = () => {
    mainContainer.innerHTML = `
        <div class="container mt-5">
            <div class="card shadow-sm">
                <div class="card-body p-4">
                    <h1 class="text-center mb-4">Enroll Courses</h1>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="email" class="form-label">Email</label>
                            <select id="email" class="form-select">
                                <option value="">Select Student Email</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="course" class="form-label">Course</label>
                            <select id="course" class="form-select">
                                <option value="">Select Course</option>
                            </select>
                        </div>
                        <div class="col-12 mt-2">
                            <button id="enrollBtn" class="btn btn-primary w-100 py-2">Enroll Student</button>
                        </div>
                    </div>
                    <hr class="my-4">
                    <div class="row">
                        <div class="col mb-3 mb-md-0">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="card-title mb-0">Enrolled Students</h5>
                                </div>
                                <div id="enrolled" class="card-body"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const selectEmail = document.getElementById("email");
    const courseSelect = document.getElementById("course");
    const enrollBtn = document.getElementById("enrollBtn");

    loadData(selectEmail, courseSelect);

    enrollBtn.addEventListener("click", () => enrollStudent(selectEmail, courseSelect));
    selectEmail.addEventListener("change", e => {
        showEnrolled(e.target.value);
    });
};

courses.addEventListener('click', coursesFun);

async function loadData(selectEmail, courseSelect) {
    const studentSnap = await getDocs(collection(db, "usersInfo"));
    studentSnap.forEach(doc => {
        const data = doc.data();
        const opt = document.createElement("option");
        opt.value = data.email;
        opt.textContent = data.email;
        selectEmail.appendChild(opt);
    });

    const courseSnap = await getDocs(collection(db, "courses"));
    courseSnap.forEach(doc => {
        const opt = document.createElement("option");
        opt.value = doc.id;
        opt.textContent = doc.data().name;
        courseSelect.appendChild(opt);
    });
}

// Enroll student in course
async function enrollStudent(selectEmail, courseSelect) {
    const studentEmail = selectEmail.value;
    const courseId = courseSelect.value;

    if (!studentEmail || !courseId) {
        Swal.fire({
            icon: "warning",
            title: "Missing Fields",
            text: "Select student and course"
        });
        return;
    }

    // Get studentId using email
    const studentQuery = query(collection(db, "usersInfo"), where("email", "==", studentEmail));
    const studentSnap = await getDocs(studentQuery);

    if (studentSnap.empty) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Student not found"
        });
        return;
    }

    const studentDoc = studentSnap.docs[0];
    const studentId = studentDoc.id;
    const studentRef = doc(db, "usersInfo", studentId);

    await updateDoc(studentRef, {
        enrolledCourses: arrayUnion(courseId)
    });

    Swal.fire({
        icon: "success",
        title: "Success",
        text: "Enrolled successfully"
    });

    showEnrolled(studentEmail);
}

// Show student enrolled courses
async function showEnrolled(studentEmail) {
    const studentQuery = query(collection(db, "usersInfo"), where("email", "==", studentEmail));
    const studentSnap = await getDocs(studentQuery);

    const enrolledDiv = document.getElementById("enrolled");

    if (studentSnap.empty) {
        enrolledDiv.innerHTML = "<p class='text-danger'>No student found with this email.</p>";
        return;
    }

    const studentDoc = studentSnap.docs[0];
    const studentData = studentDoc.data();
    const studentId = studentDoc.id;

    const allCoursesSnap = await getDocs(collection(db, "courses"));

    const enrolledCourses = (studentData.enrolledCourses || []).map(courseId => {
        const courseDoc = allCoursesSnap.docs.find(c => c.id === courseId);
        if (!courseDoc) return null;
        const course = courseDoc.data();
        return `
            <div class="mb-3 p-2 border rounded shadow-sm">
                <strong>${course.name}</strong> (${course.days.join(", ")})<br>
                <small>${course.trainer} - ${course.time}</small><br>
            </div>
        `;
    }).filter(Boolean).join("");

    enrolledDiv.innerHTML = `
        <h6>${studentData.name || studentEmail}'s Enrolled Courses</h6>
        ${enrolledCourses || "<p>No enrolled courses found.</p>"}
    `;

}


