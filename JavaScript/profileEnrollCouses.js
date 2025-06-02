import {
  onAuthStateChanged,
  auth,
  db,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "../fireBase.js";
import { profile } from './dashboard.js';


async function loadUserProfile(user) {
  const enrolledCourses = [];
  let firestoreData = {};
  
  try {
      const q = query(collection(db, "usersInfo"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const data = userDoc.data();
          firestoreData = data;
          
          const courseIDs = data.enrolledCourses || [];
          
          
          for (const courseId of courseIDs) {
              const courseRef = doc(db, "courses", courseId);
              const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
            const courseData = courseSnap.data();
            
            enrolledCourses.push({
            name: courseData.name || "No Name",
            trainer: courseData.trainer || "Unknown",
            time: courseData.time || "Not Specified"
        });
    }
}
}


profile(user, firestoreData, enrolledCourses);

} catch (error) {
    console.error("Error loading user profile:", error);
}
}


let profileBtn = document.querySelectorAll('.profileBtn');

onAuthStateChanged(auth, async (user) => {

    profileBtn.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (user) {
               loadUserProfile(user);
            }
          });
        })
});