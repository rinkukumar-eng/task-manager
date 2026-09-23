const $ = selector => document.querySelector(selector);

const $$ = selector => [
  ...document.querySelectorAll(selector)
];

const today = new Date();

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const uid = () =>
  Date.now().toString(36) +
  Math.random().toString(36).slice(2,7);

const isoToday = () =>
  new Date().toISOString().slice(0,10);


/* =========================
   DEFAULT DATA
========================= */

const defaultData = {

  user:{
    name:"Rinku Kumar",
    budget:8000,
    theme:"dark"
  },

  tasks:[

    {
      id:"1",
      title:"Complete DBMS assignment",
      subject:"DBMS",
      priority:"High",
      due:isoToday(),
      estimated:2,
      status:"pending"
    },

    {
      id:"2",
      title:"Practice JavaScript DOM",
      subject:"JavaScript",
      priority:"Medium",
      due:isoToday(),
      estimated:1.5,
      status:"progress"
    },

    {
      id:"3",
      title:"Read Operating System notes",
      subject:"OS",
      priority:"Low",
      due:"2026-09-26",
      estimated:1,
      status:"pending"
    },

    {
      id:"4",
      title:"Workout (1 hour)",
      subject:"Health",
      priority:"High",
      due:isoToday(),
      estimated:1,
      status:"completed"
    }

  ],


  schedule:[

    {
      id:"s1",
      day:"Monday",
      start:"08:00",
      end:"09:00",
      title:"Mathematics",
      type:"Study"
    },

    {
      id:"s2",
      day:"Monday",
      start:"10:00",
      end:"11:00",
      title:"Break",
      type:"Break"
    },

    {
      id:"s3",
      day:"Monday",
      start:"11:00",
      end:"12:30",
      title:"JavaScript",
      type:"Study"
    },

    {
      id:"s4",
      day:"Monday",
      start:"15:00",
      end:"16:30",
      title:"Assignment",
      type:"Study"
    },

    {
      id:"s5",
      day:"Monday",
      start:"18:00",
      end:"19:00",
      title:"FEA Class",
      type:"Class"
    },

    {
      id:"s6",
      day:"Tuesday",
      start:"08:00",
      end:"09:00",
      title:"English",
      type:"Study"
    },

    {
      id:"s7",
      day:"Tuesday",
      start:"11:00",
      end:"12:00",
      title:"Database",
      type:"Study"
    },

    {
      id:"s8",
      day:"Wednesday",
      start:"09:00",
      end:"10:30",
      title:"Programming",
      type:"Study"
    }

  ],


  goals:[

    {
      id:"g1",
      title:"Become a Web Developer",
      target:"Build full-stack skills",
      progress:68,
      date:"2026-12-31"
    },

    {
      id:"g2",
      title:"Improve Academic Performance",
      target:"Complete assignments early",
      progress:52,
      date:"2026-12-15"
    }

  ],


  expenses:[

    {
      id:"e1",
      category:"Food",
      amount:120,
      date:isoToday(),
      description:"Lunch"
    },

    {
      id:"e2",
      category:"Transport",
      amount:60,
      date:isoToday(),
      description:"Metro"
    },

    {
      id:"e3",
      category:"Education",
      amount:800,
      date:"2026-09-10",
      description:"Course"
    }

  ],


  notes:[

    {
      id:"n1",
      title:"JavaScript Concepts",
      tag:"Study",
      content:
        "DOM, events, functions, arrays and async programming."
    },

    {
      id:"n2",
      title:"Web Developer Roadmap",
      tag:"Plan",
      content:
        "HTML → CSS → JavaScript → Git → React → Node → Database."
    },

    {
      id:"n3",
      title:"Important Links",
      tag:"Resources",
      content:
        "Keep useful documentation and learning resources here."
    }

  ],

  logs:[]

};


/* =========================
   LOAD DATA
========================= */

let data = loadData();

let timer = {
  running:false,
  seconds:0,
  interval:null,
  start:0,
  subject:"Study"
};

let taskFilter = "all";

let selectedDay =
  dayNames[today.getDay()];


/* =========================
   STORAGE
========================= */

function loadData(){

  try{

    return JSON.parse(
      localStorage.getItem("lifedeskData")
    ) || structuredClone(defaultData);

  }

  catch(error){

    return structuredClone(defaultData);

  }

}


function save(){

  localStorage.setItem(
    "lifedeskData",
    JSON.stringify(data)
  );

}


/* =========================
   HELPERS
========================= */

function money(number){

  return "₹" +
    Number(number || 0)
      .toLocaleString("en-IN");

}


function formatDate(date){

  if(!date) return "";

  return new Date(
    date + "T00:00:00"
  ).toLocaleDateString(
    "en-IN",
    {
      day:"2-digit",
      month:"short"
    }
  );

}


function showToast(message){

  const toast = $("#toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(
    () => toast.classList.remove("show"),
    2200
  );

}


function escapeHtml(str){

  return String(str).replace(
    /[&<>"']/g,
    character => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[character])
  );

}


/* =========================
   INIT
========================= */

function init(){

  applyUser();

  $("#todayLabel").textContent =
    today.toLocaleDateString(
      "en-IN",
      {
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
      }
    ).toUpperCase();

  renderAll();

  bindNavigation();

  bindModals();

  bindForms();

  bindSettings();

  bindGlobal();

  renderDayTabs();

}


/* =========================
   USER
========================= */

function applyUser(){

  const name =
    data.user.name || "Student";

  const first =
    name.split(" ")[0];

  $("#sidebarName").textContent = name;

  $("#topName").textContent = first;

  $("#helloName").textContent = first;

  $("#assistantName").textContent = first;

  $("#settingsName").value = name;

  $("#settingsBudget").value =
    data.user.budget || 8000;

  $("#settingsTheme").value =
    data.user.theme || "dark";

  document.documentElement
    .classList
    .toggle(
      "light",
      data.user.theme === "light"
    );

}


/* =========================
   RENDER EVERYTHING
========================= */

function renderAll(){

  renderDashboard();

  renderTasks();

  renderTimetable();

  renderTimerLogs();

  renderGoals();

  renderExpenses();

  renderNotes();

  renderAnalytics();

}


/* =========================
   DASHBOARD
========================= */

function renderDashboard(){

  const completed =
    data.tasks.filter(
      task => task.status === "completed"
    ).length;

  $("#taskStat").textContent =
    `${completed}/${data.tasks.length}`;


  const studyHours =
    data.logs.reduce(
      (sum, log) =>
        sum + log.seconds,
      0
    ) / 3600;


  $("#studyStat").textContent =
    `${Math.floor(studyHours)}h ` +
    `${String(
      Math.round((studyHours % 1) * 60)
    ).padStart(2,"0")}m`;


  const goal =
    data.goals.length
      ? Math.round(
          data.goals.reduce(
            (sum, goal) =>
              sum + Number(goal.progress),
            0
          ) / data.goals.length
        )
      : 0;


  $("#goalStat").textContent =
    goal + "%";


  const todayExpense =
    data.expenses
      .filter(
        expense =>
          expense.date === isoToday()
      )
      .reduce(
        (sum, expense) =>
          sum + Number(expense.amount),
        0
      );


  $("#expenseStat").textContent =
    money(todayExpense);


  $("#budgetTrend").textContent =
    `${money(data.user.budget || 8000)} monthly budget`;


  renderTodaySchedule();

  renderUpcoming();

  renderStudyChart(
    $("#studyChart")
  );

}


/* =========================
   TODAY SCHEDULE
========================= */

function renderTodaySchedule(){

  const list =
    data.schedule
      .filter(
        schedule =>
          schedule.day ===
          dayNames[today.getDay()]
      )
      .sort(
        (a,b) =>
          a.start.localeCompare(b.start)
      );


  const element =
    $("#todaySchedule");


  if(!list.length){

    element.innerHTML =
      `
      <div class="empty">
        No schedule for today.
        Add your first time block.
      </div>
      `;

    return;
  }


  element.innerHTML =
    list
      .slice(0,6)
      .map(
        schedule =>
          `
          <div class="schedule-row">

            <span class="time">
              ${schedule.start} -
              ${schedule.end}
            </span>

            <span class="schedule-title">
              ${escapeHtml(schedule.title)}
            </span>

            <span class="badge ${
              schedule.type === "Study"
                ? "progress"
                : schedule.type === "Break"
                ? ""
                : "done"
            }">
              ${schedule.type}
            </span>

          </div>
          `
      )
      .join("");

}


/* =========================
   UPCOMING TASKS
========================= */

function renderUpcoming(){

  const element =
    $("#upcomingTasks");


  const tasks =
    data.tasks
      .filter(
        task =>
          task.status !== "completed"
      )
      .sort(
        (a,b) =>
          a.due.localeCompare(b.due)
      )
      .slice(0,5);


  if(!tasks.length){

    element.innerHTML =
      `
      <div class="empty">
        All tasks completed 🎉
      </div>
      `;

    return;
  }


  element.innerHTML =
    tasks
      .map(
        task =>
          `
          <div class="task-mini">

            <button
              class="check"
              onclick="toggleTask('${task.id}')">
            </button>

            <div class="task-info">

              <strong>
                ${escapeHtml(task.title)}
              </strong>

              <small>
                ${escapeHtml(task.subject)}
                •
                ${formatDate(task.due)}
              </small>

            </div>

            <span class="badge ${
              task.priority.toLowerCase()
            }">
              ${task.priority}
            </span>

          </div>
          `
      )
      .join("");

}


/* =========================
   STUDY CHART
========================= */

function renderStudyChart(element){

  const labels = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ];

  const values = [
    2.8,
    3.4,
    2.2,
    4.5,
    3.6,
    1.8,
    2.9
  ];

  const max = 5;


  element.innerHTML =
    labels
      .map(
        (day,index) =>
          `
          <div class="bar-item">

            <div class="bar-stack">

              <i
                class="bar planned"
                style="
                  height:
                  ${Math.max(
                    4,
                    values[index] * .8 /
                    max * 100
                  )}%
                ">
              </i>

              <i
                class="bar"
                style="
                  height:
                  ${Math.max(
                    5,
                    values[index] /
                    max * 100
                  )}%
                ">
              </i>

            </div>

            <span class="bar-value">
              ${values[index]}h
            </span>

            <span class="bar-label">
              ${day}
            </span>

          </div>
          `
      )
      .join("");

}


/* =========================
   NAVIGATION
========================= */

function bindNavigation(){

  $$(".nav-item[data-page]")
    .forEach(
      button =>

        button.addEventListener(
          "click",
          () =>
            navigate(
              button.dataset.page
            )
        )
    );


  $$("[data-page-link]")
    .forEach(
      button =>

        button.addEventListener(
          "click",
          () =>
            navigate(
              button.dataset.pageLink
            )
        )
    );


  $("#mobileMenu").onclick =
    () =>
      $("#sidebar")
        .classList
        .toggle("open");

}


function navigate(page){

  $$(".page")
    .forEach(
      pageElement =>
        pageElement
          .classList
          .remove("active-page")
    );


  $("#page-" + page)
    .classList
    .add("active-page");


  $$(".nav-item")
    .forEach(
      nav =>
        nav.classList.toggle(
          "active",
          nav.dataset.page === page
        )
    );


  $("#sidebar")
    .classList
    .remove("open");


  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}


/* =========================
   MODALS
========================= */

function bindModals(){

  $$("[data-open-modal]")
    .forEach(
      button =>
        button.addEventListener(
          "click",
          () =>
            openModal(
              button.dataset.openModal
            )
        )
    );


  $$(".modal .close")
    .forEach(
      button =>
        button.addEventListener(
          "click",
          () =>
            button
              .closest(".modal")
              .classList
              .remove("open")
        )
    );


  $$(".modal")
    .forEach(
      modal =>

        modal.addEventListener(
          "click",
          event => {

            if(event.target === modal){

              modal.classList.remove("open");

            }

          }
        )
    );

}


function openModal(id){

  const modal = $("#" + id);

  modal.classList.add("open");

  modal
    .querySelector(
      "input,select,textarea"
    )
    ?.focus();

}


function closeModal(id){

  $("#" + id)
    .classList
    .remove("open");

}


/* =========================
   FORMS
========================= */

function bindForms(){

  /* TASK */

  $("#taskForm").onsubmit =
    event => {

      event.preventDefault();

      const form =
        new FormData(event.target);


      data.tasks.push({

        id:uid(),

        title:form.get("title"),

        subject:form.get("subject"),

        priority:form.get("priority"),

        due:form.get("due"),

        estimated:
          Number(
            form.get("estimated")
          ),

        status:"pending"

      });


      save();

      event.target.reset();

      closeModal("taskModal");

      renderAll();

      showToast(
        "Task added successfully"
      );

    };


  /* SCHEDULE */

  $("#scheduleForm").onsubmit =
    event => {

      event.preventDefault();

      const form =
        new FormData(event.target);


      data.schedule.push({

        id:uid(),

        day:form.get("day"),

        start:form.get("start"),

        end:form.get("end"),

        title:form.get("title"),

        type:form.get("type")

      });


      save();

      event.target.reset();

      closeModal("scheduleModal");

      renderAll();

      renderDayTabs();

      showToast(
        "Schedule added"
      );

    };


  /* GOAL */

  $("#goalForm").onsubmit =
    event => {

      event.preventDefault();

      const form =
        new FormData(event.target);


      data.goals.push({

        id:uid(),

        title:form.get("title"),

        target:form.get("target"),

        progress:
          Number(
            form.get("progress") || 0
          ),

        date:form.get("date")

      });


      save();

      event.target.reset();

      closeModal("goalModal");

      renderAll();

      showToast(
        "Goal created"
      );

    };


  /* EXPENSE */

  $("#expenseForm").onsubmit =
    event => {

      event.preventDefault();

      const form =
        new FormData(event.target);


      data.expenses.push({

        id:uid(),

        category:
          form.get("category"),

        amount:
          Number(
            form.get("amount")
          ),

        date:
          form.get("date"),

        description:
          form.get("description")

      });


      save();

      event.target.reset();

      closeModal("expenseModal");

      renderAll();

      showToast(
        "Expense added"
      );

    };


  /* NOTE */

  $("#noteForm").onsubmit =
    event => {

      event.preventDefault();

      const form =
        new FormData(event.target);


      data.notes.unshift({

        id:uid(),

        title:
          form.get("title"),

        tag:
          form.get("tag") ||
          "General",

        content:
          form.get("content")

      });


      save();

      event.target.reset();

      closeModal("noteModal");

      renderAll();

      showToast(
        "Note saved"
      );

    };

}


/* =========================
   TASKS
========================= */

function toggleTask(id){

  const task =
    data.tasks.find(
      item => item.id === id
    );


  if(!task) return;


  task.status =
    task.status === "completed"
      ? "pending"
      : "completed";


  save();

  renderAll();

  showToast(
    task.status === "completed"
      ? "Task completed ✓"
      : "Task reopened"
  );

}


window.toggleTask =
  toggleTask;


function cycleTask(id){

  const task =
    data.tasks.find(
      item => item.id === id
    );


  if(!task) return;


  task.status = {

    pending:"progress",

    progress:"completed",

    completed:"pending"

  }[task.status];


  save();

  renderAll();

}


window.cycleTask =
  cycleTask;


function deleteItem(type,id){

  data[type] =
    data[type].filter(
      item => item.id !== id
    );


  save();

  renderAll();

  showToast("Deleted");

}


window.deleteItem =
  deleteItem;


/* TASK FILTER */

$$(".filter")
  .forEach(
    button =>

      button.addEventListener(
        "click",
        () => {

          $$(".filter")
            .forEach(
              item =>
                item.classList
                  .remove("active")
            );


          button.classList.add("active");

          taskFilter =
            button.dataset.filter;

          renderTasks();

        }
      )
  );


function renderTasks(){

  const tasks =
    data.tasks.filter(
      task =>
        taskFilter === "all" ||
        task.status === taskFilter
    );


  $("#taskTable").innerHTML =

    `
    <div class="table-row header">

      <span>Task</span>
      <span>Subject</span>
      <span>Priority</span>
      <span>Due Date</span>
      <span>Status</span>

    </div>
    ` +

    (
      tasks.length

      ?

      tasks
        .map(
          task =>
            `
            <div class="table-row">

              <span>

                <b>
                  ${escapeHtml(task.title)}
                </b>

                <small class="muted">
                  • ${task.estimated}h
                </small>

              </span>


              <span>
                ${escapeHtml(task.subject)}
              </span>


              <span>

                <i class="priority ${
                  task.priority.toLowerCase()
                }">

                  ${task.priority}

                </i>

              </span>


              <span>
                ${formatDate(task.due)}
              </span>


              <span class="row-actions">

                <button
                  onclick="
                    cycleTask('${task.id}')
                  ">

                  ${task.status}

                </button>


                <button
                  onclick="
                    deleteItem(
                      'tasks',
                      '${task.id}'
                    )
                  ">

                  ×

                </button>

              </span>

            </div>
            `
        )
        .join("")

      :

      `
      <div class="empty">
        No tasks in this filter.
      </div>
      `
    );

}


/* =========================
   TIMETABLE
========================= */

function renderDayTabs(){

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];


  $("#dayTabs").innerHTML =
    days
      .map(
        day =>
          `
          <button
            class="week-tab ${
              day === selectedDay
                ? "active"
                : ""
            }"
            data-day="${day}">

            ${day.slice(0,3)}

          </button>
          `
      )
      .join("");


  $$("#dayTabs .week-tab")
    .forEach(
      button =>

        button.onclick =
          () => {

            selectedDay =
              button.dataset.day;

            renderDayTabs();

            renderTimetable();

          }
    );

}


function renderTimetable(){

  const list =
    data.schedule
      .filter(
        schedule =>
          schedule.day === selectedDay
      )
      .sort(
        (a,b) =>
          a.start.localeCompare(b.start)
      );


  $("#fullSchedule").innerHTML =

    list.length

    ?

    list
      .map(
        schedule =>
          `
          <div class="timeline-row">

            <span class="time">

              ${schedule.start}

              <br>

              ${schedule.end}

            </span>


            <div class="timeline-block">

              <strong>
                ${escapeHtml(
                  schedule.title
                )}
              </strong>

              <small>
                ${schedule.type}
              </small>

            </div>


            <span class="badge">
              ${selectedDay}
            </span>

          </div>
          `
      )
      .join("")

    :

    `
    <div class="empty">
      No schedule for this day.
    </div>
    `;

}


/* =========================
   TIMER
========================= */

function renderTimerLogs(){

  const element =
    $("#timerLogs");


  if(!data.logs.length){

    element.innerHTML =
      `
      <div class="empty">
        No sessions yet.
        Start your first timer.
      </div>
      `;

    return;
  }


  element.innerHTML =
    data.logs
      .slice(-7)
      .reverse()
      .map(
        log =>
          `
          <div class="log-row">

            <div class="log-dot">
              ◉
            </div>

            <div>

              <strong>
                ${escapeHtml(log.subject)}
              </strong>

              <small>
                ${formatDate(log.date)}
              </small>

            </div>

            <span class="log-time">
              ${formatSeconds(log.seconds)}
            </span>

          </div>
          `
      )
      .join("");


  renderStudyChart(
    $("#timerChart")
  );

  renderStudyChart(
    $("#analyticsChart")
  );

}


function formatSeconds(seconds){

  const hours =
    Math.floor(
      seconds / 3600
    );

  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );

  const sec =
    seconds % 60;


  return `${String(hours).padStart(2,"0")}:` +
         `${String(minutes).padStart(2,"0")}:` +
         `${String(sec).padStart(2,"0")}`;

}


function updateTimer(){

  timer.seconds =
    Math.floor(
      (Date.now() -
        timer.start) / 1000
    );


  $("#timerDisplay")
    .textContent =
      formatSeconds(
        timer.seconds
      );

}


$("#timerBtn").onclick = () => {

  if(!timer.running){

    timer.running = true;

    timer.start =
      Date.now() -
      timer.seconds * 1000;

    timer.interval =
      setInterval(
        updateTimer,
        1000
      );

    $("#timerBtn")
      .textContent =
      "Stop & Save";

    $("#timerBtn")
      .style.background =
      "#f05d75";

    showToast(
      "Timer started"
    );

  }

  else{

    timer.running = false;

    clearInterval(
      timer.interval
    );


    timer.subject =
      $("#timerSubject").value;


    data.logs.push({

      id:uid(),

      subject:
        timer.subject,

      seconds:
        timer.seconds,

      date:
        isoToday()

    });


    save();


    timer.seconds = 0;


    $("#timerDisplay")
      .textContent =
      "00:00:00";


    $("#timerBtn")
      .textContent =
      "Start Timer";


    $("#timerBtn")
      .style.background =
      "#20c994";


    renderAll();


    showToast(
      "Study session saved"
    );

  }

};


/* =========================
   GOALS
========================= */

function renderGoals(){

  $("#goalGrid").innerHTML =

    data.goals.length

    ?

    data.goals
      .map(
        goal =>
          `
          <div class="card goal-card">

            <div class="goal-title">

              <div class="goal-icon">
                ◎
              </div>


              <div>

                <strong>
                  ${escapeHtml(
                    goal.title
                  )}
                </strong>

                <small>
                  ${escapeHtml(
                    goal.target
                  )}
                </small>

              </div>


              <button
                class="text-btn"
                style="margin-left:auto"
                onclick="
                  deleteItem(
                    'goals',
                    '${goal.id}'
                  )
                ">

                Delete

              </button>

            </div>


            <div class="goal-percent">
              ${goal.progress}%
            </div>


            <div class="progress">

              <i
                style="
                  width:${goal.progress}%
                ">
              </i>

            </div>


            <div class="between">

              <span>
                Progress
              </span>

              <span>
                ${
                  goal.date
                    ? formatDate(goal.date)
                    : "No deadline"
                }
              </span>

            </div>

          </div>
          `
      )
      .join("")

    :

    `
    <div class="empty">
      Create your first goal.
    </div>
    `;

}


/* =========================
   EXPENSES
========================= */

function renderExpenses(){

  const total =
    data.expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );


  const budget =
    Number(
      data.user.budget || 8000
    );


  const percent =
    Math.min(
      100,
      total / budget * 100
    );


  $("#monthSpent")
    .textContent =
      money(total);


  $("#budgetProgress")
    .style.width =
      percent + "%";


  $("#budgetPercent")
    .textContent =
      Math.round(percent) +
      "% used";


  $("#budgetRemaining")
    .textContent =
      money(
        Math.max(
          0,
          budget - total
        )
      ) +
      " remaining";


  const categories = [
    "Food",
    "Transport",
    "Education",
    "Entertainment",
    "Other"
  ];


  const colors = [
    "#6673ff",
    "#25d49b",
    "#f4a23a",
    "#f05d75",
    "#9c72ff"
  ];


  $("#expenseBreakdown")
    .innerHTML =

      categories
        .map(
          (category,index) => {

            const amount =
              data.expenses
                .filter(
                  expense =>
                    expense.category ===
                    category
                )
                .reduce(
                  (sum,expense) =>
                    sum +
                    Number(
                      expense.amount
                    ),
                  0
                );


            return `

              <div class="breakdown-row">

                <i
                  style="
                    background:
                    ${colors[index]}
                  ">
                </i>

                <span>
                  ${category}
                </span>

                <small>
                  ${
                    total
                      ? Math.round(
                          amount /
                          total *
                          100
                        )
                      : 0
                  }%
                </small>

                <b>
                  ${money(amount)}
                </b>

              </div>

            `;

          }
        )
        .join("");


  $("#expenseTable")
    .innerHTML =

      data.expenses
        .slice()
        .reverse()
        .map(
          expense =>
            `
            <div class="table-row">

              <span>
                <b>
                  ${escapeHtml(
                    expense.description ||
                    expense.category
                  )}
                </b>
              </span>

              <span>
                ${expense.category}
              </span>

              <span>
                ${money(expense.amount)}
              </span>

              <span>
                ${formatDate(expense.date)}
              </span>

              <span>

                <button
                  class="text-btn"
                  onclick="
                    deleteItem(
                      'expenses',
                      '${expense.id}'
                    )
                  ">

                  Delete

                </button>

              </span>

            </div>
            `
        )
        .join("")

      ||

      `
      <div class="empty">
        No expenses yet.
      </div>
      `;

}


/* =========================
   NOTES
========================= */

function renderNotes(){

  $("#notesGrid").innerHTML =

    data.notes.length

    ?

    data.notes
      .map(
        note =>
          `
          <div class="card note-card">

            <span class="tag">
              ${escapeHtml(note.tag)}
            </span>

            <h3>
              ${escapeHtml(note.title)}
            </h3>

            <p>
              ${escapeHtml(note.content)}
            </p>

            <button
              class="text-btn"
              onclick="
                deleteItem(
                  'notes',
                  '${note.id}'
                )
              ">

              Delete

            </button>

          </div>
          `
      )
      .join("")

    :

    `
    <div class="empty">
      No notes yet.
    </div>
    `;

}


/* =========================
   ANALYTICS
========================= */

function renderAnalytics(){

  const planned =
    data.tasks.reduce(
      (sum,task) =>
        sum +
        Number(
          task.estimated || 0
        ),
      0
    );


  const actual =
    data.logs.reduce(
      (sum,log) =>
        sum + log.seconds,
      0
    ) / 3600;


  const completed =
    data.tasks.filter(
      task =>
        task.status ===
        "completed"
    ).length;


  const goalProgress =
    data.goals.length
      ?

        data.goals.reduce(
          (sum,goal) =>
            sum +
            Number(
              goal.progress
            ),
          0
        ) /
        data.goals.length

      :

        0;


  $("#compareList")
    .innerHTML =

      [
        [
          "Study",
          Math.max(
            10,
            planned
          ),
          actual
        ],

        [
          "Tasks",
          data.tasks.length,
          completed
        ],

        [
          "Goals",
          100,
          goalProgress
        ]

      ]

      .map(
        item =>
          `
          <div class="compare-row">

            <div>

              <span>
                ${item[0]}
              </span>

              <b>
                ${
                  Math.round(
                    item[2] * 10
                  ) / 10
                }
                /
                ${item[1]}
              </b>

            </div>


            <div class="compare-bars">

              <i
                style="
                  width:
                  ${
                    Math.min(
                      100,
                      item[1] /
                      Math.max(
                        item[1],
                        item[2]
                      ) *
                      100
                    )
                  }%
                ">
              </i>


              <i
                class="actual"
                style="
                  width:
                  ${
                    Math.min(
                      100,
                      item[2] /
                      Math.max(
                        item[1],
                        item[2]
                      ) *
                      100
                    )
                  }%
                ">
              </i>

            </div>

          </div>
          `
      )
      .join("");


  $("#summaryStats")
    .innerHTML =

      `

      <div class="summary-stat">

        <span>
          Task completion
        </span>

        <strong>
          ${
            data.tasks.length
              ? Math.round(
                  completed /
                  data.tasks.length *
                  100
                )
              : 0
          }%
        </strong>

      </div>


      <div class="summary-stat">

        <span>
          Study hours
        </span>

        <strong>
          ${actual.toFixed(1)}h
        </strong>

      </div>


      <div class="summary-stat">

        <span>
          Active goals
        </span>

        <strong>
          ${data.goals.length}
        </strong>

      </div>


      <div class="summary-stat">

        <span>
          Total expenses
        </span>

        <strong>
          ${
            money(
              data.expenses.reduce(
                (sum,expense) =>
                  sum +
                  Number(
                    expense.amount
                  ),
                0
              )
            )
          }
        </strong>

      </div>

      `;

}


/* =========================
   SMART ASSISTANT
========================= */

$("#generatePlan").onclick = () => {

  const hours =
    Number(
      $("#availableHours").value ||
      3
    );


  const minutes =
    Math.round(
      hours * 60
    );


  const tasks =
    data.tasks

      .filter(
        task =>
          task.status !==
          "completed"
      )

      .sort(
        (a,b) =>

          (
            {
              High:0,
              Medium:1,
              Low:2
            }[a.priority]
          )

          -

          (
            {
              High:0,
              Medium:1,
              Low:2
            }[b.priority]
          )
      );


  let used = 0;

  let clock = 9;

  let html = "";


  for(const task of tasks){

    if(used >= minutes)
      break;


    const duration =
      Math.min(
        Math.round(
          Number(
            task.estimated
          ) * 60
        ) || 30,

        minutes - used
      );


    const start =
      clock;


    const end =
      clock +
      duration / 60;


    html += `

      <div class="plan-row">

        <small>
          ${String(
            Math.floor(start)
          ).padStart(2,"0")}:00
        </small>


        <span>

          <strong>
            ${escapeHtml(
              task.title
            )}
          </strong>

          <small>
            ${escapeHtml(
              task.subject
            )}
            •
            ${duration} min
          </small>

        </span>


        <span class="badge ${
          task.priority.toLowerCase()
        }">

          ${task.priority}

        </span>

      </div>

    `;


    used += duration;

    clock = end;

  }


  $("#smartPlan").innerHTML =

    html ||

    `
    <div class="empty">

      You have no pending tasks.
      Enjoy your free time!

    </div>
    `;

};


/* =========================
   SETTINGS
========================= */

function bindSettings(){

  $("#saveSettings").onclick = () => {

    data.user.name =
      $("#settingsName")
        .value
        .trim() ||
      "Student";


    data.user.budget =
      Number(
        $("#settingsBudget").value
      ) ||
      8000;


    data.user.theme =
      $("#settingsTheme").value;


    save();

    applyUser();

    renderAll();

    showToast(
      "Settings saved"
    );

  };


  $("#settingsTheme").onchange =
    event => {

      document.documentElement
        .classList
        .toggle(
          "light",
          event.target.value ===
          "light"
        );

    };

}


/* =========================
   GLOBAL
========================= */

function bindGlobal(){

  $("#themeBtn").onclick = () => {

    data.user.theme =
      data.user.theme === "light"
        ? "dark"
        : "light";

    save();

    applyUser();

  };


  $("#logoutBtn").onclick =
    () =>
      showToast(
        "Demo logout — connect backend authentication here"
      );


  $("#notifyBtn").onclick =
    () =>
      showToast(
        "You're all caught up 🎉"
      );


  $("#globalSearch").oninput =
    event => {

      const query =
        event.target.value
          .toLowerCase()
          .trim();


      if(!query)
        return;


      const found =
        [
          ...data.tasks,
          ...data.notes,
          ...data.goals
        ]
        .find(
          item =>
            JSON.stringify(item)
              .toLowerCase()
              .includes(query)
        );


      if(found){

        showToast(
          `Found: ${
            found.title ||
            found.name ||
            "item"
          }`
        );

      }

      else{

        showToast(
          "No matching item"
        );

      }

    };


  $("#profileChip").onclick =
    () =>
      navigate("settings");

}


/* =========================
   START APPLICATION
========================= */

init();