let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")) || []);

const currentDateElement = document.getElementById("currentDate");
const currentDate = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
currentDateElement.textContent = currentDate;

// Function to save tasks to local storage
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to add a task
const addTask = (title, date) => {
    const newTask = {
        id: Date.now().toString(), // Generate a unique ID
        title,
        date,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
};

// Event listener for the task form submission
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");

    if (taskInput.value && taskDate.value) {
        addTask(taskInput.value, taskDate.value);
        taskInput.value = "";
        taskDate.value = "";
    }
});