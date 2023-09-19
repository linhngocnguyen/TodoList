let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")) || []);

const currentDateElement = document.getElementById("currentDate");
const currentDate = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
currentDateElement.textContent = currentDate;

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const displayPendingTasks = () => {
    const today = new Date();
    const pendingTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return (
            taskDate.toDateString() === today.toDateString() &&
            !task.completed
        );
    });
    displayTasks(pendingTasks);
    document.getElementById("todayTasks").dataset.display = "pending";
};

const displayCompletedTasks = () => {
    const today = new Date();
    const completedTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return (
            taskDate.toDateString() === today.toDateString() &&
            task.completed
        );
    });
    displayTasks(completedTasks);
    document.getElementById("todayTasks").dataset.display = "completed";
};

const displayTasks = (tasksToDisplay) => {
    const todayTasksContainer = document.getElementById("todayTasks");
    todayTasksContainer.innerHTML = "";

    if (!tasksToDisplay || tasksToDisplay.length === 0) {
        todayTasksContainer.innerHTML = "<p>No tasks to display.</p>";
    } else {
        const table = document.createElement("table");
        table.classList.add("task-table");

        const tableHeader = document.createElement("tr");
        tableHeader.innerHTML = `
            <th>Task</th>
            <th>Completed</th>
            <th>Action</th>
        `;
        tableHeader.classList.add("table-header");
        table.appendChild(tableHeader);

        tasksToDisplay.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${task.title}</td>
                <td>
                    <div class="checkbox-container">
                        <input type="checkbox" ${task.completed ? "checked" : ""} data-task-id="${task.id}">
                    </div>
                </td>
                <td>
                    <button class="delete-button" data-task-id="${task.id}">X</button>
                </td>
            `;
            row.classList.add("table-row");
            if (task.completed) {
                row.classList.add("completed");
            }
            table.appendChild(row);
        });

        todayTasksContainer.appendChild(table);
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

    // Remove the task from the display and re-render the task list
    const displayState = document.querySelector("#todayTasks").dataset.display;
    if (displayState === "pending") {
        displayPendingTasks();
    } else if (displayState === "completed") {
        displayCompletedTasks();
    }
};

const deleteTask = (taskId) => {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();

  const displayState = document.querySelector("#todayTasks").dataset.display;

  // Update the task display based on the current display state
  if (displayState === "pending") {
      displayPendingTasks();
  } else if (displayState === "completed") {
      displayCompletedTasks();
  }
};

const searchTaskByName = (taskName) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const searchedTasks = tasks.filter(task => {
      const taskDate = new Date(task.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      return taskDate === today && task.title.toLowerCase().includes(taskName.toLowerCase());
  });
  displayTasks(searchedTasks);
  document.getElementById("todayTasks").dataset.display = "searched";
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