const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const message = document.querySelector('#message');
const storageMessage = document.querySelector('#storage-message');
const counter = document.querySelector('#counter');
const emptyMessage = document.querySelector('#empty-message');
const storageKey = 'my-todo-tasks';

let tasks = loadTasks();
let nextId = 1;

// Start after the largest saved ID so tasks keep separate IDs.
for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id >= nextId) {
        nextId = tasks[i].id + 1;
    }
}

function loadTasks() {
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved === null) {
            return [];
        }

        const loadedTasks = JSON.parse(saved);
        if (!Array.isArray(loadedTasks)) {
            throw new Error('Saved tasks must be an array.');
        }

        // check saved data before using it to build the list.
        const ids = [];
        for (let i = 0; i < loadedTasks.length; i++) {
            const task = loadedTasks[i];
            if (!task || !Number.isSafeInteger(task.id) || task.id < 1 ||
                task.id >= Number.MAX_SAFE_INTEGER || ids.includes(task.id) ||
                typeof task.title !== 'string' || task.title.trim() === '' ||
                typeof task.completed !== 'boolean') {
                throw new Error('Invalid saved task.');
            }
            ids.push(task.id);
        }
        console.log('Tasks loaded:', loadedTasks);
        return loadedTasks;
    } catch (error) {
        console.log('Could not load tasks:', error.message);
        storageMessage.textContent = 'Saved tasks could not be loaded. Starting with an empty list.';
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        storageMessage.textContent = '';
        console.log('Tasks saved:', tasks);
    } catch (error) {
        console.log('Could not save tasks:', error.message);
        storageMessage.textContent = 'Tasks work for now, but could not be saved. They may be lost when you reload.';
    }
}

function renderTasks() {
    list.innerHTML = '';
    let completedCount = 0;

    // build every task from the array using a loop.
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const li = document.createElement('li');
        li.classList.add('task');
        li.dataset.id = task.id;

        const text = document.createElement('span');
        text.classList.add('task-text');
        text.textContent = task.title;

        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.classList.add('toggle');
        toggleButton.textContent = 'Done';
        toggleButton.setAttribute('aria-label', 'Complete task: ' + task.title);

        if (task.completed) {
            li.classList.add('done');
            toggleButton.textContent = 'Undo';
            toggleButton.setAttribute('aria-label', 'Mark incomplete: ' + task.title);
            completedCount++;
        }

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.classList.add('delete');
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('aria-label', 'Delete task: ' + task.title);

        li.append(text, toggleButton, deleteButton);
        list.append(li);
    }

    emptyMessage.hidden = tasks.length !== 0;
    counter.textContent = completedCount + ' of ' + tasks.length + ' tasks completed';
    console.log('List rendered. Number of tasks:', tasks.length);
}

function addTask(event) {
    event.preventDefault();
    const title = input.value.trim();

    if (title === '') {
        message.textContent = 'Please enter a task first.';
        message.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        console.log('Empty task rejected.');
        return;
    }

    const task = { id: nextId, title: title, completed: false };
    nextId++;
    tasks.push(task);
    console.log('Task added:', task);
    saveTasks();
    renderTasks();
    input.value = '';
    input.removeAttribute('aria-invalid');
    message.classList.remove('error');
    message.textContent = 'Task added.';
    input.focus();
}

function deleteTask(id) {
    // filter keeps every task except the one being deleted.
    tasks = tasks.filter(task => task.id !== id);
    console.log('Task deleted. ID:', id);
    saveTasks();
    renderTasks();
    message.classList.remove('error');
    message.textContent = 'Task deleted.';
    input.focus();
}

function toggleTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed;
            console.log('Task updated:', tasks[i]);
            break;
        }
    }
    saveTasks();
    renderTasks();

    // eestore keyboard focus after recreating the buttons.
    const button = list.querySelector('[data-id="' + id + '"] .toggle');
    if (button) {
        button.focus();
    }
}

// submitting the form handles both the add button and enter.
form.addEventListener('submit', addTask);

input.addEventListener('input', function () {
    message.textContent = '';
    message.classList.remove('error');
    input.removeAttribute('aria-invalid');
});

// one listener handles clicks on all current and future task buttons.
list.addEventListener('click', function (event) {
    const li = event.target.closest('li');
    if (!li) {
        return;
    }

    const id = Number(li.dataset.id);
    console.log('Clicked element:', event.target);

    if (event.target.closest('.delete')) {
        deleteTask(id);
        return;
    }
    if (event.target.closest('.toggle')) {
        toggleTask(id);
    }
});

renderTasks();
