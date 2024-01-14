import trash from "./trash.js";
(function () {
  // Selecting form and its elements
  const form = document.querySelector("form");
  const taskInput = form.querySelector("input");
  const taskDesc = form.querySelector(".task_description");
  const toggleTaskDescBtn = form.querySelector(".toggle_description_btn");

  // Sidebar elements
  const asideContainer = document.querySelector("aside");
  const TasksOutput = asideContainer.querySelector(".tasks");
  const pendingTaskOutput = asideContainer.querySelector(".pending_task");
  const doneTaskOutput = asideContainer.querySelector(".done_task");
  const memorySizeOutput = asideContainer.querySelector(".storage");

  // Selecting tasks container and menu button
  const tasksContainer = document.querySelector(".tasks");
  const menuBtn = document.querySelector(".menu_btn");

  // Navigate Task Link
  pendingTaskOutput.parentElement.parentElement.addEventListener("click", () => {
    
  })

  // CSS class for task styling
  const taskClass =
    "d-flex task mb-2 justify-content-between align-items-center mx-auto p-3 rounded shadow";


  menuBtn.addEventListener("click", () => {
    asideContainer.classList.toggle("toggle_aside");
    if (menuBtn.name == "menu-outline") {
      menuBtn.name = "close-outline";
    } else {
      menuBtn.name = "menu-outline";
    }
  });

  //   task description toggler btn
  toggleTaskDescBtn.addEventListener("click", () => {
    taskDesc.classList.toggle("hide");
    taskIcon = toggleTaskDescBtn.querySelector("ion-icon");
    if (taskIcon.name == "chevron-down-outline") {
      taskIcon.name = "chevron-up-outline";
    } else {
      taskIcon.name = "chevron-down-outline";
    }
  });

  const calculateStorageSize = () => {
    const resSize = parseFloat(trash.sizeOfTrashTaskMemory(tempTaskStorage)+trash.sizeOfTrashTaskMemory(trash.getTrashTaskFromMemory()) / 1.7 / 1024).toFixed(2);
    asideContainer.querySelector(".storage").innerText = `${resSize}KB / 5.0MB`;
  };

  //   current time
  const getCurrentDate = () => {
    return new Date().toLocaleDateString();
  };
  const handleTaskDeletion = () => {
    const tasks = tasksContainer.querySelectorAll(".task");
    tasks.forEach((task) => {
      task.querySelector(".task_delete_btn").addEventListener("click", () => {
        const res = tempTaskStorage.filter((Element, index) => {
          if (index == task.dataset.key) {
            trash.setTrashTaskInMemory(Element);
          }
          return index != task.dataset.key;
        });

        tempTaskStorage = [];
        tempTaskStorage.push(...res);
        taskSetLocalStorage();
      });
    });
  };

  const handleTaskEditing = () => {
    const tasks = tasksContainer.querySelectorAll(".task");
    tasks.forEach((task) => {
      const taskEditBtn = task.querySelector(".task_edit_btn");

      taskEditBtn.addEventListener("click", () => {
        taskName = task.querySelector("span");
        editTaskDesc = task.querySelector(".new_task_desc");

        if (taskName.contentEditable == "true") {
          taskEditBtn.name = "pencil-outline";
          taskName.classList.remove("bg-primary");
          taskName.contentEditable = "false";
          editTaskDesc.contentEditable = "false";
          res = tempTaskStorage.filter((Element, index) => {
            if (index == task.dataset.key) {
              return (
                (Element.taskName = taskName.innerText),
                (Element.taskDesc = editTaskDesc.innerHTML)
              );
            }
            return Element;
          });
          tempTaskStorage = [];
          tempTaskStorage.push(...res);
          taskSetLocalStorage();
        } else {
          taskEditBtn.name = "checkmark-outline";
          taskName.contentEditable = "true";
          editTaskDesc.contentEditable = "true";
          taskName.classList.add("bg-primary");
        }
      });
    });
  };
  const handleTaskCopyingBtn = () => {
    const tasks = tasksContainer.querySelectorAll(".task");
    tasks.forEach((task) => {
      const taskCopyBtn = task.querySelector(".task_copy_btn");
      taskCopyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(
          task.querySelector(".new_task_desc").innerText
        );
      });
    });
  };

  //   create task elements
  const createTaskElement = (tasks, key) => {
    let newTask = document.createElement("div");
    newTask.setAttribute("class", taskClass);
    newTask.dataset.key = key;
    const newTaskTime = `
    <div class="d-flex align-items-center task_time">
        <ion-icon name="calendar-outline" class="me-1 me-md-2"></ion-icon>
        <small>${tasks.taskDate}</small>
    </div>
    `;
    const newTaskName = `
    <div class="d-flex align-items-center text-white task_name" >
        <input type="checkbox" class="form-check-input me-2" />
        <span>${tasks.taskName}</span>
    </div>
    `;
    const newTaskEditBTNs = `
    <div class='d-flex align-items-center task_edit'>
    <ion-icon name="copy-outline" class="btn btn-primary me-2 task_copy_btn"></ion-icon>
        <ion-icon name="pencil-outline" class="btn btn-success me-2 task_edit_btn" ></ion-icon>
        <ion-icon name="trash-bin-outline" class='btn btn-danger task_delete_btn'></ion-icon>
    </div>`;
    const newTaskDesc = `
    <div class='mt-1 new_task_desc rounded shadow text-white p-2'>
    ${tasks.taskDesc}
    </div>
    `;
    newTask.innerHTML = `${newTaskName}${newTaskEditBTNs}${newTaskTime}${newTaskDesc}`;
    tasksContainer.prepend(newTask);
  };

  //   select task
  const handleTaskSelect = () => {
    const tasks = tasksContainer.querySelectorAll(".task");
    tasks.forEach((task) => {
      const taskChecked = task.querySelector(".task_name input");
      taskChecked.addEventListener("change", () => {
        if (taskChecked.checked) {
          task
            .querySelector(".task_name span")
            .classList.add("text-decoration-line-through");
          setTimeout(() => {
            res = tempTaskStorage.filter((Element, index) => {
              return index != task.dataset.key;
            });
            tempTaskStorage = [];
            tempTaskStorage.push(...res);
            taskSetLocalStorage();
          }, 3000);
        } else {
          task
            .querySelector(".task_name span")
            .classList.remove("text-decoration-line-through");
        }
      });
    });
  };

  //   show tasks
  const showTasks = (tasks) => {
    tasksContainer.innerHTML = null;
    for (let index in tasks) {
      createTaskElement(tasks[index], index);
    }
    handleTaskDeletion();
    handleTaskEditing();
    handleTaskCopyingBtn();
    handleTaskSelect();
  };

  //   load tasks from local storage
  let tempTaskStorage = [];
  const loadTaskFromStorage = () => {
    tempTaskStorage = [];
    asideContainer.querySelector(".trash_trash").innerText =
      trash.getTrashTaskFromMemory().length;
    const response = JSON.parse(localStorage.getItem("tasks"));
    if (response) {
      tempTaskStorage.push(...response);
      asideContainer.querySelector("a .pending_task").innerText =
        response.length;
      asideContainer.querySelector("a .all_task").innerText =
        response.length + trash.getTrashTaskFromMemory().length;

      calculateStorageSize();
      showTasks(tempTaskStorage);
    }
  };
  loadTaskFromStorage();

  //   empty input and description container
  const emptyToInput = () => {
    const response = {
      taskName: taskInput.value,
      taskDesc: taskDesc.querySelector(".ql-editor").innerHTML,
      taskDate: getCurrentDate(),
    };
    taskInput.value = null;
    taskDesc.querySelector(".ql-editor").innerHTML = null;
    return response;
  };

  const taskSetLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tempTaskStorage));
    tempTaskStorage = [];
    loadTaskFromStorage();
  };

  //    create new task
  const createNewTask = () => {
    if (taskInput.value.length >= 1 && taskInput.value.length <= 80) {
      tempTaskStorage.push(emptyToInput());
      taskSetLocalStorage();
    }
  };

  //   input in enter key press add new task
  taskInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      createNewTask();
    }
  });

  //   click add on add new task
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    createNewTask();
  });
})();
