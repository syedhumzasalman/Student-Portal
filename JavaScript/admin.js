import { auth, onAuthStateChanged, doc, getDocs,collection, db } from "../fireBase.js"
import { addStudents } from "./totalStudents.js"


let totalStudent = document.getElementById("totalStudent");



// Total students count function
let countTotalStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "usersInfo"));
    const total = querySnapshot.size;
    totalStudent.textContent = `${total}`;
  } catch (err) {
    console.error("Error getting students count:", err);
    totalStudent.textContent = "Err";
  }
};

countTotalStudents()