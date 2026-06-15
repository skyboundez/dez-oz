import { runLocalCI } from '../../engine/validationEngine.js';
import { pushToGitHub } from '../../engine/githubEngine.js';
import { logger } from '../../engine/logger.js';

export async function runCicdDeploy(_params: string[]): Promise<void> {
  logger.info('🚀 Starting automated CI/CD deployment...');

  // 1. Validate
  const passed = runLocalCI();
  if (!passed) {
    logger.error('🛑 Deployment blocked: CI validation failed.');
    process.exit(1);
  }

  // 2. Push
  logger.info('📦 CI passed, pushing to GitHub...');
  pushToGitHub("feat: automated DEZ OS CI/CD deployment");
  
  logger.success('✨ Pipeline complete! Changes pushed to GitHub.');
}
