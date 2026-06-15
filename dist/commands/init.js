import { scaffoldProject } from '../engine/scaffoldEngine.js';
import { upsertProject } from '../engine/state.js';
import { logger } from '../engine/logger.js';
export async function runInit(params) {
    const name = params[0];
    if (!name)
        throw new Error('Usage: dez init <project-name>');
    const projectPath = await scaffoldProject({ name, workspaceRoot: process.cwd() });
    upsertProject({
        name, path: projectPath, createdAt: new Date().toISOString(),
        lastCommand: 'init', lastCommandAt: new Date().toISOString(),
        gitInitialized: false, dockerReady: true, prismaGenerated: false,
        buildCount: 0, failCount: 0, lastStableCommit: null
    });
    logger.success(`Project ${name} initialized successfully.`);
}
//# sourceMappingURL=init.js.map