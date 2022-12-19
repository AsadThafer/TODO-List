const addTaskModal = document.getElementById("add-modal");
const startAddTaskButton = document.querySelector("#startAddTask");
const backdrop = document.getElementById("backdrop");
const cancelAddTaskButton = addTaskModal.querySelector(".btn--passive");
const confirmAddTaskButton = addTaskModal.querySelector(".btn--success");
const userInputs = addTaskModal.querySelectorAll("input"); //array like
const entryTextSection = document.getElementById("entry-text");
const deleteTaskModal = document.getElementById("delete-modal");
const updateTaskModal = document.getElementById("update-modal");
const todoCountSpan = document.getElementById("TO-DO");
const doneCountSpan = document.getElementById("DONE");
const listRoot = document.getElementById("Task-list");
const searchInput = document.getElementById("search-input");
let storage = localStorage.getItem("TasksList");

let Tasks = [];

const toggleBackdrop = () => {
  backdrop.classList.toggle("visible");
};

const updateUI = () => {
  if (Tasks.length === 0) {
    entryTextSection.style.display = "block";
  } else {
    entryTextSection.style.display = "none";
  }
};

const closeTaskDeletionModal = () => {
  toggleBackdrop();
  deleteTaskModal.classList.remove("visible");
};

const deleteTaskHandler = (TaskId) => {
  let IdentifiedIndex = 0;
  for (const Task of Tasks) {
    if (Task.id === TaskId) {
      break;
    }
    IdentifiedIndex++;
  }
  Tasks.splice(IdentifiedIndex, 1);
  listRoot.children[IdentifiedIndex].remove();
  closeTaskDeletionModal();
  updateUI();
  updateTaskCount();
  saveToLocal();
};

// const startUpdateTaskHandler = (TaskId) => {
//   const Task = Tasks.find((t) => t.id === TaskId);
//   const title = Task.title;
//   const Assignee = Task.Assignee;
//   const status = Task.status;
//   const updateTaskModal = document.getElementById("update-modal");
//   const updateTaskTitle = updateTaskModal.querySelector("#update-title");
//   const updateTaskDescription = updateTaskModal.querySelector(
//     "#update-description"
//   );
//   const updateTaskDate = updateTaskModal.querySelector("#update-date");
//   const updateTaskTime = updateTaskModal.querySelector("#update-time");
//   const updateTaskStatus = updateTaskModal.querySelector("#update-status");
//   const updateTaskButton = updateTaskModal.querySelector(".btn--success");
//   const cancelUpdateTaskButton = updateTaskModal.querySelector(".btn--passive");
//   const updateTaskModalBackdrop = document.getElementById("backdrop");
//   const updateTaskModalCloseButton = updateTaskModal.querySelector(
//     ".btn--passive"
//   );
//   updateTaskTitle.value = title;
//   updateTaskAssignee.value = description;
//   updateTaskStatus.value = status;
//   updateTaskButton.addEventListener("click", () => {
//     const updatedTitle = updateTaskTitle.value;
//     const updatedAssignee = updateTaskAssignee.value;
//     const updatedStatus = updateTaskStatus.value;
//     const updatedTask = {
//       id: TaskId,
//       title: updatedTitle,
//       description: updatedAssignee,
//       status: updatedStatus,
//     };
//     Tasks[index] = updatedTask;
//     listRoot.children[index].remove();
//     renderNewTaskElement(updatedTask.id, updatedTask.title, updatedTask.Assignee,updatedTask.status);
//     updateTaskModal.classList.remove("visible");
//     updateTaskModalBackdrop.classList.remove("visible");
//     updateUI();
//     updateTaskCount();
//     saveToLocal();
//   });
//   cancelUpdateTaskButton.addEventListener("click", () => {
//     updateTaskModal.classList.remove("visible");
//     updateTaskModalBackdrop.classList.remove("visible");
//   });
//   updateTaskModalCloseButton.addEventListener("click", () => {
//     updateTaskModal.classList.remove("visible");
//     updateTaskModalBackdrop.classList.remove("visible");
//   });
//   updateTaskModalBackdrop.addEventListener("click", () => {
//     updateTaskModal.classList.remove("visible");
//     updateTaskModalBackdrop.classList.remove("visible");
//   });
//   updateTaskModal.classList.add("visible");
//   updateTaskModalBackdrop.classList.add("visible");
// };

const startdeleteTaskHandler = (TaskId) => {
  deleteTaskModal.classList.add("visible");
  toggleBackdrop();
  const cancelDeletionButton = deleteTaskModal.querySelector(".btn--passive");
  let confirmDeletionButton = deleteTaskModal.querySelector(".btn--danger");
  confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));
  confirmDeletionButton = deleteTaskModal.querySelector(".btn--danger");
  cancelDeletionButton.removeEventListener("click", closeTaskDeletionModal);
  cancelDeletionButton.addEventListener("click", closeTaskDeletionModal);
  confirmDeletionButton.addEventListener(
    "click",
    deleteTaskHandler.bind(null, TaskId)
  );
};

// save to local storage
const saveToLocal = () => {
  localStorage.setItem("TasksList", JSON.stringify(Tasks));
};

const updateStatus = (TaskId) => {
  let IdentifiedIndex = 0;
  console.log(Tasks);
  for (const Task of Tasks) {
    if (Task.id === TaskId) {
      break;
    }
    IdentifiedIndex++;
  }
  if (Tasks[IdentifiedIndex].status == "TO-DO") {
    Tasks[IdentifiedIndex].status = "DONE";
    listRoot.children[IdentifiedIndex].className = "Task-element DONE";
    listRoot.children[IdentifiedIndex].querySelector(".btn--done").textContent =
      "Not Done ❌";
    console.log(IdentifiedIndex + " " + Tasks[IdentifiedIndex].status);
  } else if (Tasks[IdentifiedIndex].status == "DONE") {
    Tasks[IdentifiedIndex].status = "TO-DO";
    listRoot.children[IdentifiedIndex].className = "Task-element TO-DO";
    listRoot.children[IdentifiedIndex].querySelector(".btn--done").textContent =
      "Done ✔️";
    console.log(IdentifiedIndex + " " + Tasks[IdentifiedIndex].status);
  }
  updateTaskCount();
  saveToLocal();
};

const updateButton = () => {
  let i = 0;
  for (const Task of Tasks) {
    if (Task.status == "TO-DO") {
      listRoot.children[i].querySelector(".btn--done").textContent = "Done ✔️";
    } else if (Task.status == "DONE") {
      listRoot.children[i].querySelector(".btn--done").textContent =
        "Not Done ❌";
    }
    i++;
  }
};

const renderNewTaskElement = (id, title, Assignee, status) => {
  const newTaskElement = document.createElement("li");
  newTaskElement.className = `Task-element ${status}`;
  newTaskElement.innerHTML = `
        <div class="Task-element__info">
            <h2>${title}</h2>
            <p>${Assignee}</p>
            <div class='Task-Options'>
            <button class="btn btn--done">Done ✔️</button>
            <button class="btn btn--delete">Delete 🗑️</button>
            </div>
        </div>
    `;
  newTaskElement.querySelector(".btn--done").addEventListener("click", () => {
    updateStatus(id);
  });
  newTaskElement.querySelector(".btn--delete").addEventListener("click", () => {
    startdeleteTaskHandler(id);
  });
  const listRoot = document.getElementById("Task-list");
  listRoot.append(newTaskElement);
};

const updateTaskCount = () => {
  let toDoCount = 0;
  let doneCount = 0;
  for (const Task of Tasks) {
    if (Task.status === "TO-DO") {
      toDoCount++;
    } else {
      doneCount++;
    }
  }
  todoCountSpan.textContent = toDoCount;
  doneCountSpan.textContent = doneCount;
};

const closeTaskModal = () => {
  addTaskModal.classList.remove("visible");
};

const showTaskModal = () => {
  addTaskModal.classList.add("visible");
  toggleBackdrop();
};

const clearTaskInput = () => {
  for (const userInput of userInputs) {
    userInput.value = "";
  }
};

const AddTaskHandler = () => {
  const titleValue = userInputs[0].value;
  const AssigneeValue = userInputs[1].value;
  if (titleValue.trim() === "" || AssigneeValue.trim() === "") {
    alert("Please enter valid values (non-empty values).");
    return;
  }
  const newTask = {
    id: Math.random().toString(),
    title: titleValue,
    Assignee: AssigneeValue,
    status: "TO-DO",
  };
  Tasks.push(newTask);
  console.log(Tasks);
  closeTaskModal();
  toggleBackdrop();
  clearTaskInput();
  updateUI();
  renderNewTaskElement(
    newTask.id,
    newTask.title,
    newTask.Assignee,
    newTask.status
  );
  updateTaskCount();
  saveToLocal();
};

const cancelAddTaskHandler = () => {
  closeTaskModal();
  toggleBackdrop();
  clearTaskInput();
};

const backdropClickHandler = () => {
  closeTaskModal();
  closeTaskDeletionModal();
  clearTaskInput();
};

startAddTaskButton.addEventListener("click", showTaskModal);
backdrop.addEventListener("click", backdropClickHandler);
cancelAddTaskButton.addEventListener("click", cancelAddTaskHandler);
confirmAddTaskButton.addEventListener("click", AddTaskHandler);

const refresh = () => {
  for (const Task of Tasks) {
    renderNewTaskElement(Task.id, Task.title, Task.Assignee, Task.status);
    // updateStatus(Task.id);
    // updateStatus(Task.id);
  }
  updateTaskCount();
  updateUI();
  updateButton();
};

// parse the data from local storage
if (storage !== null) {
  Tasks = JSON.parse(storage);
  refresh();
}

// search bar
const searchTasks = () => {
  const searchInput = document.getElementById("search-input");
  const searchValue = searchInput.value;
  const filteredTasks = Tasks.filter((Task) => {
    return Task.title.includes(searchValue);
  });
  listRoot.innerHTML = "";
  for (const Task of filteredTasks) {
    renderNewTaskElement(Task.id, Task.title, Task.Assignee, Task.status);
  }
};

searchInput.addEventListener("input", searchTasks);

console.log(Tasks);
