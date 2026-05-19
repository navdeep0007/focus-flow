
// ===== TASK SYSTEM =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (!input || input.value.trim() === "") return;

  tasks.push({ text: input.value, done: false });
  input.value = "";

  saveTasks();
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  if (!list) return;

  list.innerHTML = "";

  tasks.forEach((task, i) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span onclick="toggleTask(${i})">
        ${task.done ? "✔️" : "❌"} ${task.text}
      </span>
      <button onclick="deleteTask(${i})">X</button>
    `;

    list.appendChild(li);
  });

  updateStats();
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  saveTasks();
  renderTasks();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  saveTasks();
  renderTasks();
}

// ===== STATS =====
function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;

  const totalEl = document.getElementById("totalTasks");
  const doneEl = document.getElementById("completedTasks");

  if (totalEl) totalEl.innerText = total;
  if (doneEl) doneEl.innerText = done;
}

// ===== TIMER SYSTEM =====

let time = 1500;

let timer = null;

let focusTimeLeft = 1500;

let isBreak = false;

let sessions =
  parseInt(localStorage.getItem("sessions")) || 0;

// ===== UPDATE DISPLAY =====
function updateDisplay() {

  const min = Math.floor(time / 60);

  const sec = time % 60;

  const timeEl =
    document.getElementById("time");

  if (timeEl) {

    timeEl.innerText =
      `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }
}

// ===== START TIMER =====
function startTimer() {

  if (timer !== null) return;

  timer = setInterval(() => {

    time--;

    updateDisplay();

    if (time <= 0) {

      clearInterval(timer);

      timer = null;

      // ===== BREAK FINISHED =====
      if (isBreak) {

        alert("Break finished ☕");

        isBreak = false;

        time = focusTimeLeft;

        updateDisplay();

        startTimer();

        return;
      }

      // ===== FOCUS SESSION FINISHED =====
      sessions++;

      localStorage.setItem(
        "sessions",
        sessions
      );

      const s =
        document.getElementById("sessions");

      if (s) {
        s.innerText = sessions;
      }

      alert("Focus session complete 🎉");
    }

  }, 1000);
}

// ===== STOP TIMER =====
function stopTimer() {

  clearInterval(timer);

  timer = null;
}

// ===== RESET TIMER =====
function resetTimer() {

  clearInterval(timer);

  timer = null;

  const input =
    document.getElementById("minutesInput");

  const minutes =
    parseInt(input.value) || 25;

  time = minutes * 60;

  focusTimeLeft = time;

  isBreak = false;

  updateDisplay();
}

// ===== MODE SWITCH =====
function setMode(minutes) {

  // ===== BREAK MODE =====
  if (minutes === 5) {

    focusTimeLeft = time;

    clearInterval(timer);

    timer = null;

    isBreak = true;

    time = minutes * 60;

    updateDisplay();

    addBreakToList();

    startTimer();

    return;
  }

  // ===== FOCUS MODE =====
  clearInterval(timer);

  timer = null;

  isBreak = false;

  time = minutes * 60;

  focusTimeLeft = time;

  updateDisplay();
}

// ===== BREAK HISTORY =====
function addBreakToList() {

  const breakList =
    document.getElementById("breakList");

  if (!breakList) return;

  const li =
    document.createElement("li");

  const now = new Date();

  li.innerText =
    `Break taken at ${now.toLocaleTimeString()}`;

  breakList.appendChild(li);
}

// ===== INITIAL LOAD =====
window.onload = () => {

  const s =
    document.getElementById("sessions");

  if (s) {

    s.innerText = sessions;
  }

  updateDisplay();
};


// ===== THEME =====
window.onload = () => {
  renderTasks();
  updateDisplay();
  updateHomeStats();

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.onclick = () => {
      document.body.classList.toggle("dark");
    };
  }
};

function updateHomeStats() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;

  const totalEl = document.getElementById("totalTasks");
  const completedEl = document.getElementById("completedTasks");

  if (totalEl) totalEl.innerText = total;
  if (completedEl) completedEl.innerText = completed;
}