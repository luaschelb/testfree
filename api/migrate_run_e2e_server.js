import { exec, spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiDir = path.resolve(__dirname, "");
const appDir = path.resolve(__dirname, "app");
const TEST_DB_URL = "file:../dev.test.db";

function run(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      { cwd, env: { ...process.env, DATABASE_URL: TEST_DB_URL } },
      (err, stdout, stderr) => {
        if (err) return reject(err);
        if (stdout && stdout.trim()) console.log(stdout);
        if (stderr && stderr.trim()) console.error(stderr);
        resolve();
      }
    );
  });
}

function spawnBackground(command, args, cwd) {
  return spawn(command, args, {
    cwd,
    env: { ...process.env, DATABASE_URL: TEST_DB_URL },
    stdio: "inherit",
    shell: true,
  });
}

function checkHealth(url) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => resolve(res.statusCode === 200))
      .on("error", () => resolve(false));
  });
}

async function waitForHealth(url, retries = 20, interval = 1000) {
  for (let i = 0; i < retries; i++) {
    if (await checkHealth(url)) {
      console.log("✅ API is healthy!");
      return;
    }
    console.log(`⏳ Waiting for API... (${i + 1}/${retries})`);
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error("API did not become healthy in time");
}

async function main() {
  console.log("⚡ Resetting test database...");
  await run(
    "npx prisma migrate reset --force --skip-generate --schema=./prisma/schema.prisma",
    apiDir
  );

  console.log("🌱 Seeding...");
  await run("npm run seed", apiDir);

  console.log("🌐 Starting API...");
  const apiProcess = spawnBackground("npm", ["run", "start"], apiDir);

  // Wait until API is healthy
  await waitForHealth("http://localhost:8080/health-check");

  // Keep the process alive
  process.stdin.resume();

  // Gracefully handle Ctrl+C
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down...");
    apiProcess.kill("SIGINT");
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("❌ Setup failed:", err);
  process.exit(1);
});