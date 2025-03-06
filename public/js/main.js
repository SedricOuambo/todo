// Recupuration des elements du DOM
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoTemplate = document.getElementById("todo-template");

//Mettre a jour une tache
const updateTask = async (event) => {
    await fetch(`/api/todo/${event.target.parentElement.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
};

//Fonction pour ajouter une tache a la liste
const addTodoToClient = (tache) => {
    //Clonage du template
    let todoElement = todoTemplate.content.firstElementChild.cloneNode(true);

    //Mise a jour des elements du template
    let checkbox = todoElement.querySelector("input[type=checkbox]");
    todoElement.querySelector(".description").innerText = tache.description;

    todoElement.dataset.id = tache.id;

    checkbox.checked = tache.est_faite;
    checkbox.addEventListener("change", updateTask);

    todoList.appendChild(todoElement);
    todoInput.value = "";
};

//Fonction pour envoyer une requete POST au serveur pour ajouter une tache
const addTodoToServer = async (event) => {
    event.preventDefault();

    //Creation de l'objet a envoyer
    const data = {
        description: todoInput.value,
    };

    //envoie de la requete POST
    const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    //Traitement de la reponse
    if (response.ok) {
        const responseData = await response.json();
        addTodoToClient(responseData.todo);
    } else {
        console.error("Reponse du serveur : ", response.status);
    }
};

//Fonction pour obtenir la liste des taches
const getTodos = async () => {
    const response = await fetch("/api/todos");
    if (response.ok) {
        const todos = await response.json();
        todos.forEach((todo) => {
            addTodoToClient(todo);
        });
    } else {
        console.error("Reponse du serveur : ", response.status);
    }
};

//Ajouter event listener sur le formulaire
todoForm.addEventListener("submit", (event) => {
    addTodoToServer(event);
});

//Permet d'ajouter un event listener sur chaque checkbox
const checkboxes = document.querySelectorAll("input[type=checkbox]");
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateTask);
});

// getTodos();
