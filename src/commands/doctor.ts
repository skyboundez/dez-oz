import { logger } from '../engine/logger.js';
import { execa } from 'execa';

export async function runDoctor(params: string[]): Promise<void> {
  logger.section('DIAGNOSTIC SYSTEM CHECKS');
  const tools: [string, string[]][] = [['node', ['-v']], ['npm', ['-v']], ['docker', ['-v']]];
  for (const [cmd, args] of tools) {
    try {
      const { stdout } = await execa(cmd, args);
      logger.success(`${cmd}: Functional (${stdout.trim()})`);
    } catch {
      logger.error(`${cmd} missing or throwing faults.`);
    }
  }
}
