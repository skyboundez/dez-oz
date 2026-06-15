import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import { logger } from './logger.js';
export async function generateDockerCompose(projectPath, name) {
    const compose = `version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    container_name: ${name}_postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ${name}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ${name}_net
  redis:
    image: redis:7-alpine
    container_name: ${name}_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - ${name}_net
  api:
    build: { context: ., dockerfile: apps/api/Dockerfile, target: production }
    container_name: ${name}_api
    restart: unless-stopped
    ports: ["4000:4000"]
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/${name}?schema=public
      REDIS_URL: redis://redis:6379
    networks: ["${name}_net"]
  web:
    build: { context: ., dockerfile: apps/web/Dockerfile, target: production }
    container_name: ${name}_web
    restart: unless-stopped
    ports: ["3000:3000"]
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: http://localhost:4000/api
    networks: ["${name}_net"]
volumes: { postgres_data: {}, redis_data: {} }
networks: { ${name}_net: { driver: bridge } }`;
    await fs.writeFile(path.join(projectPath, 'docker-compose.yml'), compose);
    logger.success('Docker Compose file generated');
}
export async function generateDockerfiles(projectPath) {
    const apiDoc = `FROM node:20-alpine AS base\nRUN npm install -g pnpm\nWORKDIR /app\nEXPOSE 4000\nCMD ["pnpm", "--filter", "api", "start"]`;
    const webDoc = `FROM node:20-alpine AS base\nRUN npm install -g pnpm\nWORKDIR /app\nEXPOSE 3000\nCMD ["pnpm", "--filter", "web", "start"]`;
    await fs.ensureDir(path.join(projectPath, 'apps', 'api'));
    await fs.ensureDir(path.join(projectPath, 'apps', 'web'));
    await fs.writeFile(path.join(projectPath, 'apps', 'api', 'Dockerfile'), apiDoc);
    await fs.writeFile(path.join(projectPath, 'apps', 'web', 'Dockerfile'), webDoc);
    logger.success('App microservice Dockerfiles written');
}
export async function runDockerInfrastructure(projectPath) {
    logger.info('Spinning up Docker infrastructure...');
    try {
        await execa('docker-compose', ['up', '-d', 'postgres', 'redis'], { cwd: projectPath, stdio: 'inherit' });
        logger.success('Docker dependencies tracking complete');
    }
    catch (err) {
        throw new Error(`Failed to run Docker: ${err instanceof Error ? err.message : String(err)}`);
    }
}
//# sourceMappingURL=dockerEngine.js.map