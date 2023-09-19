let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")) || []);

const currentDateElement = document.getElementById("currentDate");
const currentDate = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
currentDateElement.textContent = currentDate;

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const displayPendingTasks = () => {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);

    const weekTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= startOfWeek && taskDate <= endOfWeek && !task.completed;
    });
    displayTasks(weekTasks);
    document.getElementById("weekTasks").dataset.display = "pending";
};

const displayCompletedTasks = () => {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);

    const weekTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= startOfWeek && taskDate <= endOfWeek && task.completed;
    });
    displayTasks(weekTasks);
    document.getElementById("weekTasks").dataset.display = "completed";
};

const displayTasks = (weekTasks) => {
  const weekTasksContainer = document.getElementById("weekTasks");
  weekTasksContainer.innerHTML = "";

  if (!weekTasks || weekTasks.length === 0) {
      weekTasksContainer.innerHTML = "<p>No tasks for this week.</p>";
  } else {
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      const tasksByDay = {};
      weekdays.forEach((weekday, index) => {
          tasksByDay[index] = [];
      });

      weekTasks.forEach(task => {
          const taskDate = new Date(task.date);
          const dayIndex = taskDate.getDay();
          tasksByDay[dayIndex].push(task);
      });

      const table = document.createElement("table");

      weekdays.forEach((weekday, index) => {
          const tasksForWeekday = tasksByDay[index];

          if (tasksForWeekday.length > 0) {
              const dayRow = document.createElement("tr");
              dayRow.classList.add("day-row");
              dayRow.innerHTML = `
                  <th>${weekday}</th>
                  <th>Completed</th>
                  <th>Action</th>
              `;
              table.appendChild(dayRow);

              tasksForWeekday.forEach(task => {
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
                if (task.completed) {
                    row.classList.add("completed");
                }
                table.appendChild(row);
            });
          }
      });

      weekTasksContainer.appendChild(table);
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

    const displayState = document.querySelector("#weekTasks").dataset.display;
  
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

  const displayState = document.querySelector("#weekTasks").dataset.display;

  // Update the task display based on the current display state
  if (displayState === "pending") {
      displayPendingTasks();
  } else if (displayState === "completed") {
      displayCompletedTasks();
  }
};

const searchTaskByName = (taskName) => {
  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);

  const searchedTasks = tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= startOfWeek && taskDate <= endOfWeek && task.title.toLowerCase().includes(taskName.toLowerCase());
  });

  displayTasks(searchedTasks);
  document.getElementById("weekTasks").dataset.display = "searched";
};

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.trim();
  if (searchValue !== "") {
      searchTaskByName(searchValue);
  } else {
    displayTasks([]); 
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