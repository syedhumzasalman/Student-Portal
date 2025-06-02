import {
    doc,
    db,
    collection,
    setDoc,
} from "../fireBase.js";



const mainContainer = document.getElementById("main-container");
const enterCourses = document.getElementById("enterCourses");

let showEnterCourses = () => {


    mainContainer.innerHTML = `

  <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-10">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">Add New Course</h4>
                    </div>
                    <div class="card-body">
                        <div id="courseForm">
                            <div class="mb-3">
                                <label for="courseName" class="form-label">Course Name</label>
                                <input type="text" class="form-control" id="courseName" placeholder="e.g. JavaScript Bootcamp" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="trainer" class="form-label">Trainer</label>
                                <input type="text" class="form-control" id="trainer" placeholder="e.g. Sir Ghouse" required>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Days</label>
                                <div class="d-flex flex-wrap gap-3">
                                    <div class="form-check">
                                        <input class="form-check-input day" type="checkbox" value="Mon" id="dayMon">
                                        <label class="form-check-label" for="dayMon">Monday</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input day" type="checkbox" value="Tue" id="dayTue">
                                        <label class="form-check-label" for="dayTue">Tuesday</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input day" type="checkbox" value="Wed" id="dayWed">
                                        <label class="form-check-label" for="dayWed">Wednesday</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input day" type="checkbox" value="Thu" id="dayThu">
                                        <label class="form-check-label" for="dayThu">Thursday</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input day" type="checkbox" value="Fri" id="dayFri">
                                        <label class="form-check-label" for="dayFri">Friday</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input day" type="checkbox" value="Sat" id="daySat">
                                        <label class="form-check-label" for="daySat">Saturday</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input day" type="checkbox" value="Sun" id="daySun">
                                        <label class="form-check-label" for="daySun">Sunday</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <label for="time" class="form-label">Time</label>
                                <input type="text" class="form-control" id="time" placeholder="e.g. 6PM - 8PM" required>
                            </div>
                            
                            <button id="addCourseBtn" class="btn btn-primary w-100 py-2">
                                Add Course
                            </button>
                        <div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;

    
    document.getElementById("addCourseBtn").addEventListener("click", async () => {
        const name = document.getElementById("courseName").value.trim();
        const trainer = document.getElementById("trainer").value.trim();
        const time = document.getElementById("time").value.trim();
        const days = Array.from(document.querySelectorAll(".day:checked")).map(d => d.value);


        if (!name || !trainer || !time || days.length === 0) {
            console.log(days.length);

            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please fill all fields and select at least one day."
            });
            return;
        }

        try {
            const courseRef = doc(collection(db, "courses"));
            await setDoc(courseRef, {
                name,
                trainer,
                days,
                time
            });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Course added successfully!"
            });
            // Optionally, clear fields
            document.getElementById("courseName").value = "";
            document.getElementById("trainer").value = "";
            document.getElementById("time").value = "";
            document.querySelectorAll(".day:checked").forEach(cb => cb.checked = false);

        } catch (err) {
            console.error("Error adding course:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save course. Please try again."
            });
        }
    });


}


enterCourses.addEventListener('click', showEnterCourses)


