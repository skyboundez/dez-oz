import { generateCICD } from '../../engine/cicdEngine.js';
import { getActiveProject } from '../../engine/state.js';
import { logger } from '../../engine/logger.js';

export async function runCicdGenerate(_params: string[]): Promise<void> {
  const project = getActiveProject();
  const rootPath = project?.path ?? process.cwd();
  
  logger.info(`Generating CI/CD for: ${project?.name ?? rootPath}`);
  await generateCICD(rootPath);
}
