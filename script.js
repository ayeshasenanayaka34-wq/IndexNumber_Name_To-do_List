let tasks = [];
let currentFilter = "all";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const remaining = document.getElementById("remaining");
const message = document.getElementById("message");

// Add a new task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addTask();
});

function addTask() {
    const taskName = taskInput.value.trim();

    if (taskName === "") {
        message.textContent = "Please enter a task.";
        taskInput.focus();
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        name: taskName,
        completed: false
    });

    taskInput.value = "";
    message.textContent = "";

    displayTasks();
    taskInput.focus();
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;

    document.querySelectorAll(".filter-btn").forEach(function(button) {
        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );
    });

    displayTasks();
}

// Complete or activate a task
function toggleTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (task) {
        task.completed = !task.completed;
    }

    displayTasks();
}

// Delete one task
function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    displayTasks();
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    displayTasks();
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    const remainingCount = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    remaining.textContent = remainingCount + " remaining";

    const filteredTasks = tasks.filter(function(task) {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";

        if (currentFilter === "all" && tasks.length === 0) {
            emptyMessage.textContent =
                "No tasks yet. Add your first task!";
        } else if (currentFilter === "active") {
            emptyMessage.textContent = "No active tasks!";
        } else if (currentFilter === "completed") {
            emptyMessage.textContent = "No completed tasks!";
        }

        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach(function(task) {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("done");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Complete task");

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });

        // Task name
        const taskName = document.createElement("span");
        taskName.className = "task-name";
        taskName.textContent = task.name;

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskName);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
    });
}

// Initial display
displayTasks();