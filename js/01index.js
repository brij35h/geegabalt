import trash from "./trash.js";
import done from "./done.js";
import pending from "./pending.js";
import utils from "./utils.js";

// Sidebar Selectors
const sidebarContainer = document.querySelector("aside");
const pendingBtn = sidebarContainer.querySelector(".pendingTask");
const doneBtn = sidebarContainer.querySelector(".doneTask");
const allBtn = sidebarContainer.querySelector(".allTask");
const trashBtn = sidebarContainer.querySelector(".trashTask");
const storage = sidebarContainer.querySelector(".storage");

// Form Selectors
const form = document.querySelector("form");
const taskInputName = form.querySelector(".taskInputName");
const taskInputCaption = form.querySelector(".taskInputCaption");
const taskCaptionToggler = form.querySelector(".taskCaptionToggler");

// Task Output Selector
const tasksOutputContainer = document.querySelector(".tasksOutputContainer");

//  local identifier
let holdLengthOfTask = 0;

const empty = () => {
  taskInputCaption.querySelector(".ql-editor").innerHTML = null;
  taskInputName.value = null;
  holdTask = [];
  allBtn.innerText =
    pending.getPendingTaskLength() +
    trash.getTrashTaskLength() +
    done.getDoneTaskLength();
  pendingBtn.innerText = pending.getPendingTaskLength();
  trashBtn.innerText = trash.getTrashTaskLength();
  doneBtn.innerText = done.getDoneTaskLength();
  holdTask.push(...pending.getPendingTaskFromMemory());
  holdTask.push(...done.getDoneTaskFromMemory());
  holdTask.push(...trash.getTrashTaskFromMemory());
  storage.innerText = utils.sizeOfTrashTaskMemory(holdTask);
  holdTask = [];
};

taskCaptionToggler.addEventListener("click", () => {
  taskInputCaption.classList.toggle("hide");
  const taskIcon = taskCaptionToggler.querySelector("ion-icon");
  if (taskIcon.name == "chevron-down-outline") {
    taskIcon.name = "chevron-up-outline";
  } else {
    taskIcon.name = "chevron-down-outline";
  }
});

//  Sidebar toggle Button
const sidebarToggleBtn = document.querySelector(".menuBtn");
sidebarToggleBtn.addEventListener("click", () => {
  sidebarContainer.classList.toggle("sidebarToggle");
  if (sidebarToggleBtn.name == "menu-outline") {
    sidebarToggleBtn.name = "close-outline";
  } else {
    sidebarToggleBtn.name = "menu-outline";
  }
});

// hold a time for Tasks
let holdTask = [];

const handleDeleteTask = () => {
  const tasks = tasksOutputContainer.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.querySelector(".taskDeleteBtn").addEventListener("click", () => {
      if (
        pending.getPendingTaskFromMemory() &&
        pending.getPendingTaskFromMemory() != "undefined"
      ) {
        const tempHoldTasks = pending
          .getPendingTaskFromMemory()
          .filter((taskElement, index) => {
            if (index == task.dataset.key) {
              trash.setTrashTaskInMemory(taskElement);
            }
            return index != task.dataset.key;
          });
        empty();
        holdTask.push(...tempHoldTasks);
        pending.updatePendingTaskInMemory(holdTask);
        loadTaskFromStorage();
      }
    });
  });
};

const handleEditTask = () => {
  const tasks = tasksOutputContainer.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.querySelector(".taskEditBtn").addEventListener("click", () => {
      const tempHoldTasks = holdTask.filter((taskElement, index) => {
        if (index == task.dataset.key) {
          return (
            (taskElement[index].taskName =
              task.querySelector(".taskName").value),
            (taskElement[index].taskCaption =
              task.querySelector(".taskCaption").innerHTML),
            (taskElement[index].taskPublishTime = utils.getCurrentLocalTime())
          );
        }
        return taskElement;
      });
      empty();
      holdTask.push(...tempHoldTasks);
      pending.setPendingTaskInMemory(holdTask);
      empty();
    });
  });
};

const handleDoneTask = () => {
  const tasks = tasksOutputContainer.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.querySelector(".taskDoneCheck").addEventListener("change", () => {
      if (
        pending.getPendingTaskFromMemory() &&
        pending.getPendingTaskFromMemory() != "undefined" &&
        task.querySelector(".taskDoneCheck").checked
      ) {
        const tempHoldTasks = pending
          .getPendingTaskFromMemory()
          .filter((taskElement, index) => {
            if (index == task.dataset.key) {
              done.setDoneTaskInMemory(taskElement);
            }
            return index != task.dataset.key;
          });
        empty();
        holdTask.push(...tempHoldTasks);
        pending.updatePendingTaskInMemory(holdTask);
        loadTaskFromStorage();
      }
    });
  });
};

const handleRecoverTask = (recoverTask) => {
  pending.setPendingTaskInMemory({
    taskName:
      recoverTask.parentElement.parentElement.querySelector(".taskTask")
        .innerText,
    taskCaption:
      recoverTask.parentElement.parentElement.querySelector(".taskCaption")
        .innerHTML,
    taskPublishTime:
      recoverTask.parentElement.parentElement.querySelector(".taskPublishTime")
        .innerText,
  });
  empty();
};

// Create Task Elements
const createTaskElement = (taskObject, key, active) => {
    console.log(active)
  const taskElementClasses =
    "d-flex task mb-2 justify-content-between align-items-center mx-auto p-3 rounded shadow pending";
  let taskElement = document.createElement("div");
  taskElement.setAttribute("class", taskElementClasses);
  taskElement.dataset.key = key;

  taskElement.taskElementTime = `
  <div class="d-flex align-items-center task_time">
      <ion-icon name="calendar-outline" class="me-1 me-md-2"></ion-icon>
      <small>${taskObject.taskPublishTime}</small>
  </div>
  `;

  taskElement.taskElementName = `
  <div class="d-flex align-items-center text-white task_name" >
      <input type="checkbox" class="form-check-input me-2 taskDoneCheck" />
      <span>${taskObject.taskName}</span>
  </div>
  `;

  taskElement.taskElementEditAndDeleteBtn = `
  <div class='d-flex align-items-center task_edit'>
    <ion-icon name="copy-outline" class="btn btn-primary me-2 task_copy_btn"></ion-icon>
    <ion-icon name="pencil-outline" class="btn btn-success me-2 taskEditBtn" ></ion-icon>
    <ion-icon name="trash-bin-outline" class='btn btn-danger taskDeleteBtn'></ion-icon>
  </div>`;

  taskElement.taskElementCaption = `
  <div class='mt-1 new_task_desc rounded shadow text-white p-2'> ${taskObject.taskCaption} </div>
  `;

  taskElement.innerHTML = `${taskElement.taskElementName} ${taskElement.taskElementEditAndDeleteBtn} ${taskElement.taskElementTime} ${taskElement.taskElementCaption}`;
  tasksOutputContainer.prepend(taskElement);
};

// Task Add and get listOfTask parameters
const addTask = (listOfTask, active = false) => {
  for (let index in listOfTask) {
    createTaskElement(listOfTask[index], index, active);
  }
  handleDeleteTask();
  handleEditTask();
  handleDoneTask();
};

// Load Tasks from Memory
const loadTaskFromStorage = () => {
  if (pending.getPendingTaskFromMemory()) {
    empty();
    tasksOutputContainer.innerHTML = null;
    addTask(pending.getPendingTaskFromMemory());
  }
};
loadTaskFromStorage();

/**
 * The function `createTaskObject` creates a task object with a task name, caption, and publish time,
 * and adds it to a list of tasks.
 */
const createTaskObject = () => {
  holdTask.push({
    taskName: taskInputName.value,
    taskCaption: taskInputCaption.querySelector(".ql-editor").innerHTML,
    taskPublishTime: utils.getCurrentLocalTime(),
  });
  addTask(holdTask);
  pending.setPendingTaskInMemory(holdTask);
  empty();
};

// Task input press enter btn on add task
taskInputName.addEventListener("keydown", (events) => {
  if (events.key == "Enter" && events.target.value) {
    createTaskObject();
    empty();
  }
});

// Form submit on  add Task
form.addEventListener("submit", (events) => {
  events.preventDefault();
  if (taskInputName.value) createTaskObject();
  empty();
});

// get all tasks
allBtn.addEventListener("click", () => {
  empty();
  tasksOutputContainer.innerHTML = null;
  addTask(pending.getPendingTaskFromMemory(), true);
  addTask(trash.getTrashTaskFromMemory(), true);
  addTask(done.getDoneTaskFromMemory(), true);
});

// get pending tasks
pendingBtn.addEventListener("click", () => {
  tasksOutputContainer.innerHTML = null;
  addTask(pending.getPendingTaskFromMemory());
  empty();
});

//  get trash tasks
trashBtn.addEventListener("click", () => {
  tasksOutputContainer.innerHTML = null;
  addTask(trash.getTrashTaskFromMemory());
  empty();
});

// get done tasks
doneBtn.addEventListener("click", () => {
  tasksOutputContainer.innerHTML = null;
  addTask(done.getDoneTaskFromMemory());
  empty();
});
