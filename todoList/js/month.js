let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")) || []);

const currentDateElement = document.getElementById("currentDate");
const currentDate = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
currentDateElement.textContent = currentDate;

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const displayPendingTasks = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= startOfMonth && taskDate <= endOfMonth && !task.completed;
    });
    displayTasks(monthTasks);
    document.getElementById("monthTasks").dataset.display = "pending";
};

const displayCompletedTasks = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= startOfMonth && taskDate <= endOfMonth && task.completed;
    });
    displayTasks(monthTasks);
    document.getElementById("monthTasks").dataset.display = "completed"
};

const displayTasks = (monthTasks) => {
  const monthTasksContainer = document.getElementById("monthTasks");
  monthTasksContainer.innerHTML = "";

  if (!monthTasks || monthTasks.length === 0) {
    monthTasksContainer.innerHTML = "<p>No tasks for this month.</p>";
  } else {
    // Sort tasks by date
    monthTasks.sort((a, b) => new Date(a.date) - new Date(b.date));

    const table = document.createElement("table");
    const tableHeader = document.createElement("tr");
    tableHeader.innerHTML = `
      <th>Task</th>
      <th>Due Date</th>
      <th>Completed</th>
      <th>Action</th>
    `;
    table.appendChild(tableHeader);

    monthTasks.forEach(task => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${task.title}</td>
        <td>${task.date}</td>
        <td>
          <div class="checkbox-container">
            <input type="checkbox" ${task.completed ? "checked" : ""} data-task-id="${task.id}">
          </div>
        </td>
        <td>
            <button class="delete-button" data-task-id="${task.id}">X</button>
        </td>
      `;
      if (task.completed) {
        row.classList.add("completed");
      }
      table.appendChild(row);
    });

    monthTasksContainer.appendChild(table);
  }
};

// Function to update the completed status of a task
const updateTaskCompletedStatus = (taskId, completed) => {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return {
                ...task,
                completed
            };
        }
        return task;
    });
    saveTasks();

    const displayState = document.querySelector("#monthTasks").dataset.display;
  
      // Update the task display based on the current display state
      if (displayState === "pending") {
        displayPendingTasks();
      } else if (displayState === "completed") {
        displayCompletedTasks();
      }
};

const deleteTask = (taskId) => {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();

  const displayState = document.querySelector("#monthTasks").dataset.display;

  // Update the task display based on the current display state
  if (displayState === "pending") {
      displayPendingTasks();
  } else if (displayState === "completed") {
      displayCompletedTasks();
  }
};

const searchTaskByName = (keyword) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const searchedTasks = tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= startOfMonth && taskDate <= endOfMonth && (task.title.toLowerCase().includes(keyword.toLowerCase())||task.date.includes(keyword));
  });

  displayTasks(searchedTasks);
  document.getElementById("monthTasks").dataset.display = "searched";
};

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.trim();
  if (searchValue !== "") {
      searchTaskByName(searchValue);
  } else {
    displayTasks([]); // Pass an empty array to display nothing
  }
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".delete-button[data-task-id]")) {
      const taskId = e.target.getAttribute("data-task-id");
      deleteTask(taskId);
  }
});

document.addEventListener("change", (e) => {
    if (e.target.matches("input[type='checkbox'][data-task-id]")) {
      const taskId = e.target.getAttribute("data-task-id");
      const completed = e.target.checked;
      updateTaskCompletedStatus(taskId, completed);
    }
  });