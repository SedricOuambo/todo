//Doit etre en debut de fichier pour charger les variables d'environnement
import "dotenv/config";

//Pour le Https
import https from "node:https";
import { readFile } from "node:fs/promises";

//importer les routes
import routerExterne from "./routes.js";

// Importation des fichiers et librairies
import { engine } from "express-handlebars";
import express, { json } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cspOption from "./csp-options.js";

// Importation de la session
import session from "express-session";
// Importation de la memorystore
import memorystore from "memorystore";

// Importation de passport
import passport from "passport";

import "./authentification.js";

// Crréation du serveur express
const app = express();

//Permet d'initialiser la session
const MemoryStore = memorystore(session);

app.engine("handlebars", engine()); //Pour informer express que l'on utilise handlebars
app.set("view engine", "handlebars"); //Pour dire a express que le moteur de rendu est handlebars
app.set("views", "./views"); //Pour dire a express ou se trouvent les vues

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());

//middleware pour la session
app.use(
    session({
        cookie: { maxAge: 3600000 },
        name: process.env.npm_package_name,
        store: new MemoryStore({ checkPeriod: 3600000 }),
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
    })
);

//middleware pour passport
app.use(passport.initialize());
app.use(passport.session());

//Middeleware integre a express pour gerer la partie static du serveur
//le dossier 'public' est la partie statique de notre serveur
app.use(express.static("public"));

// Ajout des routes
app.use(routerExterne);

// Renvoyer une erreur 404 pour les routes non définies
app.use((request, response) => {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(`${request.originalUrl} Route introuvable.`);
});

//Demarrer le serveur
//Usage du HTTPS
if (process.env.NODE_ENV === "development") {
    let credentials = {
        key: await readFile("./security/localhost.key"),
        cert: await readFile("./security/localhost.cert"),
    };

    https.createServer(credentials, app).listen(process.env.PORT);
    console.info("Serveur démarré avec succès: ");
    console.log("https://localhost:" + process.env.PORT);
} else {
    app.listen(process.env.PORT);
    console.info("Serveur démarré avec succès: ");
    console.info("http://localhost:" + process.env.PORT);
}
