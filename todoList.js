async function addTask(type) {
  const input = document.getElementById(type + 'Input');
  const task = input.value.trim();
  if (!task) return;

  await fetch('http://localhost:3000/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, type, completed: false })
  });

  input.value = '';
  loadTasks();
}

async function loadTasks() {
  const res = await fetch('http://localhost:3000/tasks');
  const tasks = await res.json();

  ['main', 'priority', 'completed'].forEach(list => {
    document.getElementById(list + 'List').innerHTML = '';
  });

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.task;
    li.className = task.completed ? 'completed' : '';

    if (!task.completed) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', () => markCompleted(task.id));
      li.prepend(checkbox);
    }

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTask(task.id, task.task);
    li.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteTask(task.id);
    li.appendChild(delBtn);

    const listId = task.completed ? 'completedList' : (task.type == 'priority' ? 'priorityList' : 'mainList');
    document.getElementById(listId).appendChild(li);
  });
}

async function markCompleted(id) {
  await fetch(`http://localhost:3000/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true })
  });
  loadTasks();
}

async function deleteTask(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  await fetch(`http://localhost:3000/delete/${id}`, {
    method: 'DELETE'
  });
  loadTasks();
}

async function editTask(id, oldTask) {
  const newTask = prompt("Edit task:", oldTask);
  if (!newTask || newTask.trim() == '') return;

  await fetch(`http://localhost:3000/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: newTask, completed: false })
  });
  loadTasks();
}

window.onload = loadTasks;