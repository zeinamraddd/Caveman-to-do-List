# Caveman To-Do List

Assignment 03: an interactive to-do list using HTML, CSS and vanilla JavaScript.


## Features

- Add a task by clicking Add task or pressing Enter.
- Reject empty or whitespace-only input with a message.
- Complete a task with Done and change it back with Undo.
- Delete tasks.
- Keep tasks and their completion status after a reload using localStorage.
- Show the completed and total task counts.

## Code and notes

`index.html` contains the form and an empty list. `style.css` controls the appearance. `script.js` stores the tasks in an array and updates the page.

`renderTasks()` clears the list and uses a regular `for` loop to create each task. It uses `createElement()`, `textContent`, `classList`, `dataset` and `append()` from the notes. User input is displayed with `textContent`, so it is treated as text.

`addTask()` uses `preventDefault()` to stop the form from reloading the page. `deleteTask()` uses `filter()` to create an array without the selected task. `toggleTask()` changes the task's completed value.

Event listeners handle form submission, typing, and list clicks. Event delegation puts one click listener on the list. `closest()` finds the clicked task and `dataset.id` connects it to the array.

`saveTasks()` uses `JSON.stringify()` and `localStorage.setItem()`. `loadTasks()` uses `getItem()` and `JSON.parse()`. The `try/catch` blocks prevent invalid saved data or blocked storage from crashing the page.

Console logs show additions, deletions, completion changes, rendering, and saving. Open the browser developer tools and select Console to see them.

