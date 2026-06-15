import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import { logger } from './logger.js';
export async function generatePrismaSchema(dbPackagePath) {
    const prismaDir = path.join(dbPackagePath, 'prisma');
    await fs.ensureDir(prismaDir);
    const schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users    User[]
  projects Project[]
  @@map("tenants")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(MEMBER)
  tenantId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tenant   Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  tasks    Task[]
  logs     Log[]
  @@index([tenantId])
  @@map("users")
}

model Project {
  id          String        @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(ACTIVE)
  tenantId    String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  tasks  Task[]
  logs   Log[]
  @@index([tenantId])
  @@map("projects")
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  projectId   String
  assigneeId  String?
  tenantId    String
  dueAt       DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  project  Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignee User?   @relation(fields: [assigneeId], references: [id])
  @@index([tenantId])
  @@index([projectId])
  @@index([assigneeId])
  @@map("tasks")
}

model Log {
  id        String   @id @default(cuid())
  level     LogLevel @default(INFO)
  message   String
  meta      Json?
  projectId String?
  userId    String?
  tenantId  String
  createdAt DateTime @default(now())
  project Project? @relation(fields: [projectId], references: [id])
  user    User?    @relation(fields: [userId], references: [id])
  @@index([tenantId])
  @@index([projectId])
  @@index([createdAt])
  @@map("logs")
}

enum Role { OWNER; ADMIN; MEMBER }
enum ProjectStatus { ACTIVE; ARCHIVED; COMPLETED }
enum TaskStatus { TODO; IN_PROGRESS; IN_REVIEW; DONE; CANCELLED }
enum Priority { LOW; MEDIUM; HIGH; URGENT }
enum LogLevel { DEBUG; INFO; WARN; ERROR }`;
    await fs.writeFile(path.join(prismaDir, 'schema.prisma'), schema);
    logger.success('Prisma schema written');
    await fs.writeFile(path.join(prismaDir, 'seed.ts'), [
        `import { PrismaClient } from '@prisma/client';`,
        `const prisma = new PrismaClient();`,
        `async function main() {`,
        `  const tenant = await prisma.tenant.upsert({`,
        `    where: { slug: 'default' }, update: {},`,
        `    create: { name: 'Default Tenant', slug: 'default' }`,
        `  });`,
        `  const user = await prisma.user.upsert({`,
        `    where: { email: 'admin@example.com' }, update: {},`,
        `    create: { email: 'admin@example.com', name: 'Admin', role: 'OWNER', tenantId: tenant.id }`,
        `  });`,
        `  console.log('Seed complete', { tenant: tenant.id, user: user.id });`,
        `}`,
        `main().catch(console.error).finally(() => prisma.$disconnect());`
    ].join('\n') + '\n');
    logger.success('Prisma seed file written');
}
export async function runPrismaGenerate(projectPath) {
    logger.info('Running prisma generate...');
    try {
        await execa('pnpm', ['--filter', 'db', 'generate'], { cwd: projectPath, stdio: 'inherit' });
        logger.success('Prisma client generated');
    }
    catch (err) {
        throw new Error(`Prisma generate failed: ${err instanceof Error ? err.message : String(err)}`);
    }
}
export async function runPrismaMigrate(projectPath) {
    logger.info('Running prisma migrate dev...');
    try {
        await execa('pnpm', ['--filter', 'db', 'migrate', 'dev', '--name', 'init'], {
            cwd: projectPath,
            stdio: 'inherit',
            env: { ...process.env, PRISMA_SKIP_GENERATE: '1' },
        });
        logger.success('Database migrated');
    }
    catch (err) {
        throw new Error(`Prisma migrate failed: ${err instanceof Error ? err.message : String(err)}`);
    }
}
//# sourceMappingURL=prismaEngine.js.map