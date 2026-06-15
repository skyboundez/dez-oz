import { logger } from '../engine/logger.js';
import { execa } from 'execa';
export async function runDoctor(params) {
    logger.section('DIAGNOSTIC SYSTEM CHECKS');
    const tools = [['node', ['-v']], ['npm', ['-v']], ['docker', ['-v']]];
    for (const [cmd, args] of tools) {
        try {
            const { stdout } = await execa(cmd, args);
            logger.success(`${cmd}: Functional (${stdout.trim()})`);
        }
        catch {
            logger.error(`${cmd} missing or throwing faults.`);
        }
    }
}
//# sourceMappingURL=doctor.js.map