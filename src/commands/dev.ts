import { getActiveProject } from '../engine/state.js';
import { runDockerInfrastructure } from '../engine/dockerEngine.js';
import { logger } from '../engine/logger.js';
import { execa } from 'execa';

export async function runDev(params: string[]): Promise<void> {
  logger.section('DEZ STARTING LOCAL DEVELOPMENT');
  const active = getActiveProject();
  if (!active) throw new Error('No active project tracking located. Run "dez init <name>".');
  await runDockerInfrastructure(active.path);
  logger.info('Launching operational threads...');
  await execa('pnpm', ['dev'], { cwd: active.path, stdio: 'inherit' });
}
