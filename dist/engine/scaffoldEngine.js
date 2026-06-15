import fs from 'fs-extra';
import path from 'path';
import { logger } from './logger.js';
import { generatePrismaSchema } from './prismaEngine.js';
import { generateDockerCompose, generateDockerfiles } from './dockerEngine.js';
export async function scaffoldProject(opts) {
    const { name, workspaceRoot } = opts;
    const projectPath = path.join(workspaceRoot, name);
    logger.section('Scaffold Engine');
    if (await fs.pathExists(projectPath))
        throw new Error(`Project exists: ${projectPath}`);
    await fs.ensureDir(projectPath);
    await fs.writeJSON(path.join(projectPath, 'package.json'), {
        name, version: '0.1.0', private: true,
        scripts: {
            dev: "pnpm --parallel --filter \"./apps/*\" dev",
            build: "pnpm --filter \"./packages/*\" build && pnpm --parallel --filter \"./apps/*\" build"
        },
        devDependencies: { typescript: '^5.3.3' }
    }, { spaces: 2 });
    await fs.writeFile(path.join(projectPath, 'pnpm-workspace.yaml'), "packages:\n  - 'apps/*'\n  - 'packages/*'\n");
    await fs.ensureDir(path.join(projectPath, 'apps'));
    await fs.ensureDir(path.join(projectPath, 'packages'));
    await generatePrismaSchema(path.join(projectPath, 'packages', 'db'));
    await generateDockerCompose(projectPath, name);
    await generateDockerfiles(projectPath);
    return projectPath;
}
//# sourceMappingURL=scaffoldEngine.js.map