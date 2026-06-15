import { getActiveProject } from '../engine/state.js';
import { logger } from '../engine/logger.js';
import { execa } from 'execa';

export async function runDeploy(params: string[]): Promise<void> {
  logger.section('PRODUCTION DEPLOYMENT');
  const active = getActiveProject();
  if (!active) throw new Error('No project active workspace root.');
  await execa('pnpm', ['run', 'build'], { cwd: active.path, stdio: 'inherit' });
  await execa('docker-compose', ['up', '-d'], { cwd: active.path, stdio: 'inherit' });
  logger.success('Production containers online.');
}