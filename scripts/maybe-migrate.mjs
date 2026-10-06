import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("Skipping prisma migrate deploy (DATABASE_URL not set).");
  process.exit(0);
}

execSync("npx prisma migrate deploy", { stdio: "inherit" });
