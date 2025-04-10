// importer le client prisma
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

// Créer une instance du client prisma
const prisma = new PrismaClient();

//Pour recuperer un utilisateur par son email
export const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
};

//Pour ajouter un utilisateur
export const addUser = async (email, password, nom) => {
    const user = await prisma.user.create({
        data: {
            email,
            password: await bcrypt.hash(password, 10),
            nom,
            type: "USER",
        },
    });
    return user;
};
