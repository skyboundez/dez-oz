import { logger } from '../../engine/logger.js';
import { runLocalCI } from '../../engine/validationEngine.js';
import { getActiveProject } from '../../engine/state.js';
import { detectProjectType } from '../../engine/projectDetector.js';

export async function runCicdValidate(_params: string[]): Promise<void> {
  const project = getActiveProject();
  const rootPath = project?.path ?? process.cwd();
  
  const detection = detectProjectType();
  const pm = detection === 'node' ? 'npm' : 'pnpm'; // Simplified for now
  
  const passed = runLocalCI();
  if (!passed) {
    logger.error('CI validation failed');
    process.exit(1);
  }
  logger.success('CI validation passed');
}
