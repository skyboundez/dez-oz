import fs from "fs-extra";
import path from "path";

export function detectProjectType(): "fullstack" | "next" | "nest" | "docker" | "node" {
  const cwd = process.cwd();
  
  const hasNext = fs.existsSync(path.join(cwd, "next.config.js")) || fs.existsSync(path.join(cwd, "next.config.mjs"));
  const hasNest = fs.existsSync(path.join(cwd, "nest-cli.json"));
  const hasDocker = fs.existsSync(path.join(cwd, "docker-compose.yml"));

  if (hasNext && hasNest) return "fullstack";
  if (hasNext) return "next";
  if (hasNest) return "nest";
  if (hasDocker) return "docker";

  return "node";
}