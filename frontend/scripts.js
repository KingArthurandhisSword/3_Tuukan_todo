

document.getElementById("todo-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const taskInput = document.getElementById("todo-input");
    const task = taskInput.value.trim();

    if (task) {
        addTaskToList(task);
        taskInput.value = "";
    }
});

// Lisää tehtävän listalle
function addTaskToList(task, completed = false) {
    const todoList = document.getElementById("todo-list");
    const li = document.createElement("li");
    li.className = "todo-item";
    if (completed) li.classList.add("completed");

    // Luo "Done"-nappi
    const doneButton = document.createElement("button");
    doneButton.className = "done-button";
    if (completed) doneButton.classList.add("completed");
    doneButton.onclick = () => {
        const isCompleted = li.classList.contains("completed");
        li.classList.toggle("completed", !isCompleted);
        doneButton.classList.toggle("completed", !isCompleted);
        saveTasks();

        doneButton.onclick = () => {
            const isCompleted = li.classList.contains("completed");
            li.classList.toggle("completed", !isCompleted); // Lisää tai poista luokka "completed"
            doneButton.classList.toggle("completed", !isCompleted);
            saveTasks(); // Tallenna tila
        };
        
    };

    // Luo "Delete"-nappi
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "x";
    deleteButton.onclick = () => {
        li.remove();
        saveTasks();
    };

    // Lisää elementit listaelementtiin
    li.appendChild(doneButton);
    li.appendChild(document.createTextNode(task));
    li.appendChild(deleteButton);

    // Lisää listaelementti tehtävälistaan
    todoList.appendChild(li);
    saveTasks();
}

// Tallentaa tehtävät localStorageen
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#todo-list li").forEach(li => {
        tasks.push({
            text: li.childNodes[1].textContent.trim(),
            completed: li.classList.contains("completed"),
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* document.addEventListener("DOMContentLoaded", () => {
    loadTasks(); // Lataa tallennetut tehtävät, kun DOM latautuu
});
*/

// Lataa tallennetut tehtävät
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToList(task.text, task.completed));
}

// Lataa tehtävät DOM:n latautuessa
document.addEventListener("DOMContentLoaded", loadTasks);

// 1. Kuuntele sijainnin muutoksia
window.onmove = () => {
    const position = window.getBounds(); // Saa ikkunan sijainnin
    savePosition(position.x, position.y); // Tallenna sijainti
};

// 2. Tallenna sijainti tiedostoon
function savePosition(x, y) {
    const fs = require('fs');
    fs.writeFileSync('position.json', JSON.stringify({ x, y }));
}

// 3. Aseta sijainti käynnistyksen yhteydessä
function setPosition() {
    const fs = require('fs');
    if (fs.existsSync('position.json')) {
        const { x, y } = JSON.parse(fs.readFileSync('position.json', 'utf-8'));
        window.setBounds({ x, y });
    }
}

// Käynnistyksessä kutsutaan:
setPosition();
