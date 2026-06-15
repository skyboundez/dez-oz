import { getActiveProject } from '../engine/state.js';
import { logger } from '../engine/logger.js';
import { execa } from 'execa';

export async function runGit(params: string[]): Promise<void> {
  const action = params[0];
  const active = getActiveProject();
  const root = active ? active.path : process.cwd();
  if (action === 'init') {
    await execa('git', ['init'], { cwd: root, stdio: 'inherit' });
    logger.success('Git initialization finalized.');
  } else if (action === 'commit') {
    await execa('git', ['add', '.'], { cwd: root });
    await execa('git', ['commit', '-m', params[1] ?? 'DEZ Snapshot'], { cwd: root, stdio: 'inherit' });
  }
}