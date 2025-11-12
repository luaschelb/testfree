/*
  Warnings:

  - You are about to drop the column `failed` on the `test_executions_test_cases` table. All the data in the column will be lost.
  - You are about to drop the column `passed` on the `test_executions_test_cases` table. All the data in the column will be lost.
  - You are about to drop the column `skipped` on the `test_executions_test_cases` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_test_executions_test_cases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME,
    "comment" TEXT,
    "status" INTEGER DEFAULT 0,
    "test_execution_id" INTEGER,
    "test_case_id" INTEGER,
    CONSTRAINT "test_executions_test_cases_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "test_cases" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "test_executions_test_cases_test_execution_id_fkey" FOREIGN KEY ("test_execution_id") REFERENCES "test_executions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_test_executions_test_cases" ("comment", "created_at", "id", "test_case_id", "test_execution_id") SELECT "comment", "created_at", "id", "test_case_id", "test_execution_id" FROM "test_executions_test_cases";
DROP TABLE "test_executions_test_cases";
ALTER TABLE "new_test_executions_test_cases" RENAME TO "test_executions_test_cases";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
