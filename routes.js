import { Router } from "express";
import { addTodo, getTodos, updateTodo } from "./model/todo.js";
import { addUser } from "./model/user.js";
import {
    isDescriptionValid,
    isEmailValid,
    isPasswordValid,
} from "./validation.js";

import passport from "passport";

const router = Router();

//Definition des routes

//Route pour la connexion
router.post("/connexion", (request, response, next) => {
    // On vérifie le le courriel et le mot de passe
    // envoyé sont valides
    if (
        isEmailValid(request.body.email) &&
        isPasswordValid(request.body.password)
    ) {
        // On lance l'authentification avec passport.js
        passport.authenticate("local", (erreur, user, info) => {
            if (erreur) {
                // S'il y a une erreur, on la passe
                // au serveur
                next(erreur);
            } else if (!user) {
                // Si la connexion échoue, on envoit
                // l'information au client avec un code
                // 401 (Unauthorized)
                response.status(401).json(info);
            } else {
                // Si tout fonctionne, on ajoute
                // l'utilisateur dans la session et
                // on retourne un code 200 (OK)
                request.logIn(user, (erreur) => {
                    if (erreur) {
                        next(erreur);
                    }
                    // On ajoute l'utilisateur dans la session
                    if (!request.session.user) {
                        request.session.user = user;
                    }
                    response.status(200).json({
                        message: "Connexion réussie",
                        user,
                    });
                });
            }
        })(request, response, next);
    } else {
        response.status(400).json({
            error: "Email ou mot de passe invalide",
        });
    }
});

//Route deconnexion
router.post("/deconnexion", (request, response) => {
    //Protection de la route
    if (!request.session.user) {
        response.status(401).end();
        return;
    }
    // Déconnecter l'utilisateur
    request.logOut((erreur) => {
        if (erreur) {
            next(erreur);
        }
        // Rediriger l'utilisateur vers une autre page
        response.redirect("/");
    });
});

//Route pour ajouter un utilisateur
router.post("/inscription", async (request, response) => {
    const { email, password, nom } = request.body;
    try {
        const user = await addUser(email, password, nom);
        response
            .status(200)
            .json({ user, message: "Utilisateur ajouté avec succès" });
    } catch (error) {
        console.log("error", error.code);
        if (error.code === "P2002") {
            response.status(409).json({ error: "Email déjà utilisé" });
        } else {
            response.status(400).json({ error: error.message });
        }
    }
});

router.get("/", async (request, response) => {
    response.render("index", {
        titre: "Accueil",
        styles: ["css/style.css"],
        scripts: ["./js/main.js", "./js/validation.js"],
        todos: await getTodos(),
        user: request.session.user,
    });
});

router.get("/documents", (request, response) => {
    console.log("id_user", request.session.id_user);
    response.render("documents", {
        titre: "Documents",
        styles: ["css/style.css"],
        scripts: ["./js/main.js"],
    });
});

router.get("/connexion", (request, response) => {
    response.render("connexion", {
        titre: "Connexion",
        styles: ["css/style.css", "css/connexion.css"],
        scripts: ["./js/connexion.js"],
    });
});

//Route pour ajouter une tache
router.post("/api/todo", async (request, response) => {
    if (!request.session.user) {
        response.status(401).json({
            error: "Vous devez être connecté pour ajouter une tâche",
        });
        return;
    }

    if (request.session.user.type !== "ADMIN") {
        response.status(403).json({
            error: "Vous n'avez pas les droits nécessaires pour ajouter une tâche",
        });
        return;
    }
    const { description } = request.body;
    if (isDescriptionValid(description)) {
        try {
            const todo = await addTodo(description);
            response
                .status(200)
                .json({ todo, message: "Tâche ajoutée avec succès" });
        } catch (error) {
            response.status(400).json({ error: error.message });
        }
    } else {
        response.status(400).json({ error: "Description invalide" });
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
