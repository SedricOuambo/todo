-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_todo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "est_faite" BOOLEAN NOT NULL DEFAULT false,
    "auteur" TEXT
);
INSERT INTO "new_todo" ("auteur", "description", "est_faite", "id") SELECT "auteur", "description", "est_faite", "id" FROM "todo";
DROP TABLE "todo";
ALTER TABLE "new_todo" RENAME TO "todo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
