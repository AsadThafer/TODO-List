const addTaskModal = document.getElementById("add-modal");
const startAddTaskButton = document.querySelector("#startAddTask");
const cancelAddTaskButton = addTaskModal.querySelector(".btn--passive");
const confirmAddTaskButton = addTaskModal.querySelector(".btn--success");
const userInputs = addTaskModal.querySelectorAll("input"); //array like
const entryTextSection = document.getElementById("entry-text");
const updateTaskModal = document.getElementById("update-modal");
const todoCountSpan = document.getElementById("TO-DO");
const doneCountSpan = document.getElementById("DONE");
const listRoot = document.getElementById("Task-list");
const searchInput = document.getElementById("search-input");
let storage = localStorage.getItem("TasksList");

let Tasks = [];

// visual

const updateUI = () => {
  if (Tasks.length === 0) {
    entryTextSection.style.display = "block";
  } else {
    entryTextSection.style.display = "none";
  }
};

const toggleTaskModal = () => {
  addTaskModal.classList.toggle("visible");
  createBackDrop();
};

const clearTaskInput = () => {
  for (const userInput of userInputs) {
    userInput.value = "";
  }
};

const updateStatus = (TaskId) => {
  console.log(Tasks);
  const IdentifiedIndex = Tasks.findIndex((task) => task.id === TaskId);
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
    createDeleteModal(id);
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

const createBackDrop = () => {
  if (document.getElementById("backdrop")) {
    backdrop.remove();
  } else {
    const backdrop = document.createElement("div");
    backdrop.classList.add("backdrop");
    backdrop.classList.add("visible");
    backdrop.id = "backdrop";
    backdrop.addEventListener("click", () => {
      backdrop.remove();
      addTaskModal.classList.remove("visible");
      if (document.getElementById("delete-modal")) {
        document.getElementById("delete-modal").remove();
      }
    });
    document.body.append(backdrop);
  }
};

const createDeleteModal = (id) => {
  const deleteTaskElement = document.createElement("div");
  deleteTaskElement.classList.add("modal");
  deleteTaskElement.classList.add("visible");
  deleteTaskElement.id = "delete-modal";
  const myh2 = document.createElement("h2");
  myh2.classList.add("modal__title");
  myh2.textContent = "Are you sure?";
  const myp = document.createElement("p");
  myp.classList.add("modal__content");
  myp.textContent = "Are you sure you want to delete this Task?";
  const mydiv = document.createElement("div");
  mydiv.classList.add("modal__actions");
  const mybutton1 = document.createElement("button");
  mybutton1.classList.add("btn");
  mybutton1.classList.add("btn--passive");
  mybutton1.textContent = "Cancel";
  mybutton1.addEventListener("click", () => {
    deleteTaskElement.remove();
    createBackDrop();
  });
  const mybutton2 = document.createElement("button");
  mybutton2.classList.add("btn");
  mybutton2.classList.add("btn--danger");
  mybutton2.textContent = "Delete";
  mybutton2.addEventListener("click", (i) => {
    IdentifiedIndex = Tasks.findIndex((task) => task.id === id);
    Tasks.splice(IdentifiedIndex, 1);
    listRoot.children[IdentifiedIndex].remove();
    i.target.parentElement.parentElement.remove();
    updateUI();
    updateTaskCount();
    saveToLocal();
    createBackDrop();
  });
  mydiv.append(mybutton1);
  mydiv.append(mybutton2);
  deleteTaskElement.append(myh2);
  deleteTaskElement.append(myp);
  deleteTaskElement.append(mydiv);
  createBackDrop();
  document.body.append(deleteTaskElement);
};

// save to local storage
const saveToLocal = () => {
  localStorage.setItem("TasksList", JSON.stringify(Tasks));
};

//add task
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
  toggleTaskModal();
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
  toggleTaskModal();
  clearTaskInput();
};

// update Page content and UI elements after Refresh
const refresh = () => {
  for (const Task of Tasks) {
    renderNewTaskElement(Task.id, Task.title, Task.Assignee, Task.status);
  }
  updateTaskCount();
  updateUI();
  updateButton();
};

// parse the data from local storage
if (storage !== null) {
  Tasks = JSON.parse(storage);
  refresh();
  console.log(Tasks);
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
startAddTaskButton.addEventListener("click", toggleTaskModal);
cancelAddTaskButton.addEventListener("click", cancelAddTaskHandler);
confirmAddTaskButton.addEventListener("click", AddTaskHandler);