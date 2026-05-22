






// =========================================
// TASK SYSTEM
// =========================================

let tasks =
  JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

function addTask(){

  const input =
    document.getElementById("taskInput");

  const category =
    document.getElementById("category");

  const dueDate =
    document.getElementById("dueDate");

  const priority =
    document.getElementById("priority");

  if(input.value.trim() === "") return;

  tasks.push({

    text: input.value,

    category: category.value,

    dueDate: dueDate.value,

    priority: priority.value,

    done:false
  });

  input.value = "";

  saveTasks();

  renderTasks();

  showNotification(
  "Task Added Successfully ✅"
);
}

function renderTasks(filtered = tasks){

  const list =
    document.getElementById("taskList");

  const empty =
    document.getElementById("emptyMsg");

  if(!list) return;

  list.innerHTML = "";

  if(filtered.length === 0){

    empty.style.display = "block";

  } else {

    empty.style.display = "none";
  }

  filtered.forEach((task,index)=>{

    const li =
      document.createElement("li");

    li.className = "task-item";

    li.innerHTML = `

      <div class="task-left">

        <div class="task-name">

          ${task.done ? "✅" : "📌"}

          ${task.text}

        </div>

        <div class="task-meta">

          📂 ${task.category}
          &nbsp;&nbsp;
          📅 ${task.dueDate}

        </div>

        <div class="priority ${task.priority.toLowerCase()}">

          ${task.priority}

        </div>

      </div>

      <div>

        <button onclick="toggleTask(${index})">

          ${task.done ? "Undo" : "Done"}

        </button>

        <button onclick="deleteTask(${index})">

          Delete

        </button>

      </div>
    `;

    list.appendChild(li);
  });

  updateStats();
}

function toggleTask(index){

  tasks[index].done =
    !tasks[index].done;

  saveTasks();

  renderTasks();
}

function deleteTask(index){

  tasks.splice(index,1);

  saveTasks();

  renderTasks();
}

// =========================================
// FILTER TASKS
// =========================================

function filterTasks(type){

  const list =
    document.getElementById("taskList");

  list.innerHTML = "";

  let filteredTasks = [];

  // ALL TASKS
  if(type === "all"){

    filteredTasks = tasks;
  }

  // COMPLETED TASKS
  else if(type === "done"){

    filteredTasks =
      tasks.filter(task => task.done);
  }

  // PENDING TASKS
  else if(type === "pending"){

    filteredTasks =
      tasks.filter(task => !task.done);
  }

  // SHOW EMPTY MESSAGE
  const empty =
    document.getElementById("emptyMsg");

  if(filteredTasks.length === 0){

    empty.style.display = "block";

  } else {

    empty.style.display = "none";
  }

  // RENDER TASKS
  filteredTasks.forEach((task,index)=>{

    const li =
      document.createElement("li");

    li.className = "task-item";

    li.innerHTML = `

      <div class="task-left">

        <div class="task-name">

          ${task.done ? "✅" : "📌"}

          ${task.text}

        </div>

        <div class="task-meta">

          📂 ${task.category}

          &nbsp;&nbsp;

          📅 ${task.dueDate}

        </div>

        <div class="priority ${task.priority.toLowerCase()}">

          ${task.priority}

        </div>

      </div>

      <div class="task-actions">

        <button onclick="toggleTask(${index})">

          ${task.done ? "Undo" : "Done"}

        </button>

        <button onclick="deleteTask(${index})">

          Delete

        </button>

      </div>
    `;

    list.appendChild(li);
  });
}

function searchTasks(){

  const value =
    document
    .getElementById("searchTask")
    .value
    .toLowerCase();

  const filtered =
    tasks.filter(task =>

      task.text
      .toLowerCase()
      .includes(value)
    );

  renderTasks(filtered);
}

function updateStats(){

  const total = tasks.length;

  const done =
    tasks.filter(t=>t.done).length;

  const pending =
    total - done;

  const percent =
    total === 0
      ? 0
      : Math.round((done/total)*100);

  document.getElementById(
    "totalTasks"
  ).innerText = total;

  document.getElementById(
    "doneTasks"
  ).innerText = done;

  document.getElementById(
    "pendingTasks"
  ).innerText = pending;

  document.getElementById(
    "progressText"
  ).innerText =
    percent + "% Completed";

  document.getElementById(
    "progressFill"
  ).style.width =
    percent + "%";
}

renderTasks();



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

        showNotification(
  "Break Finished ☕"
);
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

      showNotification(
  "Focus Session Complete 🎉"
);
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

// =========================================
// INITIAL LOAD
// =========================================

window.onload = () => {

  // TASKS
  renderTasks();

  // TIMER
  updateDisplay();

  // HOME PAGE STATS
  updateHomeStats();

  // notifications
  randomQuote();

  // SESSIONS
  const s =
    document.getElementById("sessions");

  if(s){

    s.innerText = sessions;
  }

  // THEME BUTTON
  const btn =
    document.getElementById("themeToggle");

  if(btn){

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


// =========================================
// DEMO POPUP
// =========================================

function openDemoPopup(){

  document
    .getElementById("demoPopup")
    .style.display = "flex";
}

function closeDemoPopup(){

  document
    .getElementById("demoPopup")
    .style.display = "none";
}

function submitDemo(){

  const name =
    document
    .getElementById("demoName")
    .value;

  const email =
    document
    .getElementById("demoEmail")
    .value;

  if(!name || !email){

    alert("Please fill all fields");

    return;
  }

  showNotification(
  "Demo Booked Successfully 🚀"
);

  closeDemoPopup();
}


// FIRST RENDER
renderTasks();


// logout button
function logout(){

  localStorage.removeItem("loggedIn");

  alert("Logged out successfully");

  window.location.href = "login.html";
}

// live clock
function updateClock(){

  const now = new Date();

  const clock =
    document.getElementById("liveClock");

  if(clock){

    clock.innerText =
      now.toLocaleTimeString();
  }
}

setInterval(updateClock,1000);




const quotes = [

  "Success starts with focus 🚀",

  "Small progress is still progress ✨",

  "Consistency beats motivation 💪",

  "Stay focused and never quit 🔥"
];
function randomQuote(){

  const quoteEl =
    document.getElementById("quoteText");

  if(quoteEl){

    const random =
      Math.floor(Math.random()*quotes.length);

    quoteEl.innerText = quotes[random];
  }
}

// =========================================
// NOTIFICATION SYSTEM
// =========================================

function showNotification(message){

  // CREATE DIV
  const note =
    document.createElement("div");

  // MESSAGE
  note.innerText = message;

  // STYLE
  note.style.position = "fixed";

  note.style.top = "25px";

  note.style.right = "25px";

  note.style.padding = "16px 28px";

  note.style.background =
    "linear-gradient(135deg,#8b5cf6,#3b82f6)";

  note.style.color = "white";

  note.style.borderRadius = "16px";

  note.style.fontWeight = "bold";

  note.style.fontSize = "16px";

  note.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.25)";

  note.style.zIndex = "999999";

  note.style.opacity = "0";

  note.style.transform =
    "translateY(-20px)";

  note.style.transition =
    "all 0.4s ease";

  // ADD TO BODY
  document.body.appendChild(note);

  // SHOW ANIMATION
  setTimeout(()=>{

    note.style.opacity = "1";

    note.style.transform =
      "translateY(0)";

  },100);

  // REMOVE AFTER 3 SEC
  setTimeout(()=>{

    note.style.opacity = "0";

    note.style.transform =
      "translateY(-20px)";

    setTimeout(()=>{

      note.remove();

    },400);

  },3000);
}

// EXPORT DATA in timer  page
function exportData() {
  const data = JSON.stringify(localStorage);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "focusflow-data.json";
  a.click();
}

/* =========================================
   ABOUT PAGE BUTTONS
========================================= */

// GET STARTED BUTTON

const getStartedBtn =
document.getElementById("getStartedBtn");

if(getStartedBtn){

  getStartedBtn.addEventListener("click", () => {

    // OPEN TASK PAGE

    window.location.href = "tasks.html";

  });

}


// LEARN MORE BUTTON

const learnMoreBtn =
document.getElementById("learnMoreBtn");

if(learnMoreBtn){

  learnMoreBtn.addEventListener("click", () => {

    // SCROLL TO FEATURES SECTION

    const featuresSection =
    document.querySelector(".features-section");

    if(featuresSection){

      featuresSection.scrollIntoView({

        behavior: "smooth"

      });

    }

  });

}
