// importer le client prisma
import { PrismaClient } from "@prisma/client";

// Créer une instance du client prisma
const prisma = new PrismaClient();

// let todos = [];

/**
 * Permet d'ajouter une tâche à la liste des tâches
 * @param {*} description
 * @returns
 */
export const addTodo = async (description) => {
    const todo = await prisma.todo.create({
        data: {
            description,
        },
    });
    return todo;
};

/**
 * Pour obtenir la liste de toutes les tâches
 * @returns la liste des tâches
 */
export const getTodos = async () => {
    const todos = await prisma.todo.findMany();
    return todos;
};

/**
 * Pour mettre à jour une tâche
 * @param {*} id
 * @returns
 */
export const updateTodo = async (id) => {
    const todo = await prisma.todo.findUnique({
        where: {
            id,
        },
    });

    const todoUpdated = await prisma.todo.update({
        where: {
            id,
        },
        data: {
            est_faite: !todo.est_faite,
        },
    });

    return todoUpdated;
};
