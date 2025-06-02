import {
  auth, onAuthStateChanged,
  db, collection, query, where, getDocs
} from "../fireBase.js";

let mainContent = document.getElementById("mainContent");
let attendanceBtn = document.getElementById("attendanceBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  attendanceBtn.addEventListener('click', async () => {
    const userQuery = query(collection(db, "usersInfo"), where("email", "==", user.email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      mainContent.innerHTML = `<div class="alert alert-danger">User not found.</div>`;
      return;
    }

    const userData = userSnapshot.docs[0].data();
    const attendanceArray = userData.AttendanceDates;

    if (!attendanceArray || attendanceArray.length === 0) {
      mainContent.innerHTML = `<div class="alert alert-warning">No attendance data found.</div>`;
      return;
    }

    const present = attendanceArray.filter(a => a.status === "Present").length;
    const absent = attendanceArray.filter(a => a.status === "Absent").length;
    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;


    renderAttendance(attendanceArray, { total, present, absent, percentage });

  });
});





const renderAttendance = (attendanceArray, stats) => {
  const today = moment().format('YYYY-MM-DD');
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  mainContent.innerHTML = `
    <div class="container py-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h1 class="text-center mb-4 border-bottom pb-3">Your Attendance</h1>
          
          <div class="row g-3 mb-4">
            ${renderStatCard('Total Classes', stats.total, 'primary')}
            ${renderStatCard('Present', stats.present, 'success')}
            ${renderStatCard('Absent', stats.absent, 'danger')}
          </div>

          <div class="mb-4">
            <h2 class="h4 mb-3">Attendance Overview</h2>
            <div class="alert alert-success">You have attended ${stats.present} out of ${stats.total} classes.</div>
            <div class="progress mb-2" style="height: 10px">
              <div class="progress-bar bg-success" 
                   role="progressbar" 
                   style="width: ${stats.percentage}%" 
                   aria-valuenow="${stats.percentage}" 
                   aria-valuemin="0" 
                   aria-valuemax="100"></div>
            </div>
            <p class="text-end text-muted">${stats.percentage}% Attendance</p>
          </div>

          <div>
            <h2 class="h4 mb-3">Attendance Details</h2>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-primary">
                  <tr>
                    <th>Student ID</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${attendanceArray.map(item => {
    const statusColor = item.status === 'Absent' ? 'danger'
      : item.status === 'Pending' ? 'secondary'
        : 'success';
    const isToday = item.date === today ? 'table-info' : '';
    return `
                      <tr class="table-${statusColor} ${isToday}">
                          <td>${item.studentId || '-'}</td>
                          <td>${moment(item.date).format('DD MMM YYYY') || '-'}</td>
                          <td><span class="badge bg-${statusColor} text-capitalize">${item.status}</span></td>
                        </tr>
                      `;
  }).join('')
    }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

let renderStatCard = (title, value, variant) => {
  return `
    <div class="col-sm-6 col-md-4">
      <div class="card border-${variant} shadow-sm h-100">
        <div class="card-body text-center">
          <h2 class="display-6 text-${variant}">${value}</h2>
          <p class="text-muted mb-0">${title}</p>
        </div>
      </div>
    </div>
  `;
}
