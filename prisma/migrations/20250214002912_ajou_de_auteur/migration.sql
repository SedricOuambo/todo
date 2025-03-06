/*
  Warnings:

  - Added the required column `auteur` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_todo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "est_faite" BOOLEAN NOT NULL DEFAULT false,
    "auteur" TEXT NOT NULL
);
INSERT INTO "new_todo" ("description", "est_faite", "id") SELECT "description", "est_faite", "id" FROM "todo";
DROP TABLE "todo";
ALTER TABLE "new_todo" RENAME TO "todo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
