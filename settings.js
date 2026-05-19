// THEME
function setTheme(mode) {
  document.body.classList.toggle("dark", mode === "dark");
  localStorage.setItem("theme", mode);
}

// LOAD THEME
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

// TIMER
function saveTimer() {
  const val = document.getElementById("timerInput").value;
  localStorage.setItem("timer", val);
  alert("Timer saved!");
}

// PROFILE
function saveName() {
  const name = document.getElementById("username").value;
  localStorage.setItem("username", name);
  alert("Name saved!");
}

// NOTIFICATIONS
document.getElementById("notifyToggle").addEventListener("change", (e) => {
  localStorage.setItem("notify", e.target.checked);
});

// EXPORT DATA
function exportData() {
  const data = JSON.stringify(localStorage);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "focusflow-data.json";
  a.click();
}

// RESET
function clearData() {
  if (confirm("Are you sure?")) {
    localStorage.clear();
    location.reload();
  }
}