import { Router } from "express";
import { addTodo, getTodos, updateTodo } from "./model/todo.js";

const router = Router();

//Definition des routes

router.get("/", async (request, response) => {
    response.render("index", {
        titre: "Accueil",
        styles: ["css/style.css"],
        scripts: ["./js/main.js"],
        todos: await getTodos(),
    });
});

console.log('test')

router.get("/documents", (request, response) => {
    response.render("documents", {
        titre: "Documents",
        styles: ["css/style.css"],
        scripts: ["./js/main.js"],
    });
});

//Route pour ajouter une tache
router.post("/api/todo", async (request, response) => {
    const { description } = request.body;
    try {
        const todo = await addTodo(description);
        response
            .status(200)
            .json({ todo, message: "Tâche ajoutée avec succès" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

//Route pour obtenir la liste des taches
router.get("/api/todos", async (request, response) => {
    console.log("toutes les taches");
    try {
        const todos = await getTodos();
        response.status(200).json(todos);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

//Route pour mettre a jour une tache
router.patch("/api/todo/:id", async (request, response) => {
    const { id } = request.params;
    try {
        const todo = await updateTodo(parseInt(id));
        if (todo) {
            response
                .status(200)
                .json({ todo, message: "Tâche mise à jour avec succès" });
        } else {
            response.status(404).json({ message: "Tâche non trouvée" });
        }
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

//Route pour mettre a jour une tache avec le prtotocole PUT
router.put("/api/todo", (request, response) => {
    const { id } = request.query;
    try {
        const todo = updateTodo(parseInt(id));
        if (todo) {
            response
                .status(200)
                .json({ todo, message: "Tâche mise à jour avec succès" });
        } else {
            response.status(404).json({ message: "Tâche non trouvée" });
        }
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

export default router;
