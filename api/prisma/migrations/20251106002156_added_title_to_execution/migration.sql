/*
  Warnings:

  - Added the required column `title` to the `test_executions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_test_executions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "start_date" DATETIME,
    "end_date" DATETIME,
    "test_plan_id" INTEGER,
    "build_id" INTEGER,
    "status" INTEGER DEFAULT 1,
    "comments" TEXT,
    CONSTRAINT "test_executions_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "builds" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "test_executions_test_plan_id_fkey" FOREIGN KEY ("test_plan_id") REFERENCES "test_plans" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_test_executions" ("build_id", "comments", "end_date", "id", "start_date", "status", "test_plan_id") SELECT "build_id", "comments", "end_date", "id", "start_date", "status", "test_plan_id" FROM "test_executions";
DROP TABLE "test_executions";
ALTER TABLE "new_test_executions" RENAME TO "test_executions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
