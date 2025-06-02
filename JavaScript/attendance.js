// attendance.js
import {
    doc,
    db,
    collection,
    getDocs,
    updateDoc,
    setDoc,
    getDoc,
    serverTimestamp,
    arrayUnion
} from "../fireBase.js";

// DOM references
const attendanceNav = document.getElementById("attendance");
attendanceNav.addEventListener("click", attendanceSection);

// Main function for Attendance Section
async function attendanceSection() {
    const mainContainer = document.getElementById("main-container");




    mainContainer.innerHTML = `
        <div class="container mt-5">
            <div class="card shadow-sm">
                <div class="card-body">
                    <h2 class="text-center mb-4">Mark Attendance</h2>
                    <div class="mb-3">
                        <label for="studentIdInput" class="form-label">Enter Student ID</label>
                        <input type="text" id="studentIdInput" class="form-control" placeholder="Enter Student ID">
                    </div>
                    <div class="mb-3">
                        <label for="statusSelect" class="form-label fw-bold">Select Status</label>
                        <select id="statusSelect" class="form-select w-auto" value=""></select>
                    </div>
                    <button id="markBtn" class="btn btn-success w-100 mb-4">Mark Attendance</button>
                    <hr />
                    <div id="attendanceHistory"></div>
                </div>
            </div>
        </div>
    `;
    let statusSelect = document.getElementById("statusSelect");

    statusSelect.innerHTML = `
  <option value="Present">Present</option>
  <option value="Absent">Absent</option>
`;

    const studentInput = document.getElementById("studentIdInput");
    const markBtn = document.getElementById("markBtn");

    markBtn.addEventListener("click", async () => {
        const studentId = studentInput.value.trim();
        if (!studentId) {
            return Swal.fire("Missing Info", "Please enter a valid student ID", "warning");
        }
        await markAttendanceHandler(studentId);
        await showAttendanceHistory(studentId);
    });

    studentInput.addEventListener("change", () => {
        const id = studentInput.value.trim();
        if (id) showAttendanceHistory(id);
    });
}

// Function to find user document ID
const findStudentIdByField = async (inputId) => {
    const usersSnap = await getDocs(collection(db, "usersInfo"));

    for (const docSnap of usersSnap.docs) {
        // console.log(docSnap);
        const data = docSnap
        const studentId = data.id?.trim();


        // console.log("Stored:", studentId, "| Input:", inputId.trim());

        if (studentId && studentId.toLowerCase().includes(inputId.trim().toLowerCase())) {
            // console.log("Match →", docSnap.id);
            return docSnap.id;
        }
    }

    return null;
};

// Mark attendance logic
const markAttendanceHandler = async (studentId) => {
    const today = moment().format("YYYY-MM-DD");
    const day = moment().format("dddd");
    const status = document.getElementById("statusSelect").value;

    const attendanceRef = doc(db, "attendance", `${studentId}_${today}`);
    const existingSnap = await getDoc(attendanceRef);

    if (existingSnap.exists()) {
        return Swal.fire("Already Marked", "Attendance already recorded for today.", "info");
    }

    try {
        // Create new attendance record
        await setDoc(attendanceRef, {
            studentId,
            date: today,
            day,
            status: status,
            timestamp: serverTimestamp()
        });

        // Find user's doc ID
        const fullUserDocId = await findStudentIdByField(studentId);
        // console.log("Found user doc ID:", fullUserDocId);

        if (!fullUserDocId) {
            return Swal.fire("Invalid", "Student not found in usersInfo", "error");
        }

        // Update user's attendance history
        const userDocRef = doc(db, "usersInfo", fullUserDocId);

        let attendanceRecord = {
            studentId: studentId,
            date: today,
            day: day,
            status: status,
        };

        await updateDoc(userDocRef, {
            AttendanceDates: arrayUnion(attendanceRecord)
        });

        // console.log("User updated with attendance");
        Swal.fire("Success", `Attendance marked for ${day}`, "success");

    } catch (err) {
        console.error("Error marking attendance:", err);
        Swal.fire("Error", "Failed to mark attendance", "error");
    }
};

// Show attendance history for student
const showAttendanceHistory = async (studentId) => {
    const historyDiv = document.getElementById("attendanceHistory");
    historyDiv.innerHTML = "<p>Loading attendance...</p>";

    const attendanceSnap = await getDocs(collection(db, "attendance"));
    const studentRecords = [];

    attendanceSnap.forEach((doc) => {
        const data = doc.data();
        if (data.studentId === studentId) {
            studentRecords.push(data);
        }
    });

    if (studentRecords.length === 0) {
        historyDiv.innerHTML = "<p>No attendance marked yet.</p>";
        return;
    }

    // Sort records (latest first)
    studentRecords.sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());

    let html = "<h5>Attendance History</h5><ul class='list-group'>";
    studentRecords.forEach(record => {
        const formattedDate = moment(record.date).format("dddd, MMMM Do YYYY");
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${formattedDate}</span>
                <span class="badge bg-${record.status === 'Present' ? 'success' : 'danger'}">${record.status}</span>
            </li>
        `;
    });

    html += "</ul>";
    historyDiv.innerHTML = html;
};
