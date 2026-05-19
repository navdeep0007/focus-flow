// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;

  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  document.getElementById("totalTasks").innerText = total;
  document.getElementById("doneTasks").innerText = done;
  document.getElementById("pendingTasks").innerText = pending;

  document.getElementById("progressText").innerText = percent + "%";
  document.getElementById("progressFill").style.width = percent + "%";

  // sessions from timer
  const sessions = localStorage.getItem("sessions") || 0;
  document.getElementById("focusSessions").innerText = sessions;
}

updateStats();