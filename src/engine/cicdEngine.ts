import fs from 'fs-extra';
import path from 'path';
import { detectProjectType } from './projectDetector.js';
import { generateCIYaml } from './yamlGenerator.js';
import { logger } from './logger.js';

export async function generateCICD(rootPath: string): Promise<void> {
  logger.info('🔍 Detecting project type...');
  // Inalis ang rootPath argument para tumugma sa declaration
  const type = detectProjectType();
  
  logger.success(`Detected project type: ${type}`);

  const yaml = generateCIYaml(type);
  const workflowDir = path.join(rootPath, '.github', 'workflows');

  await fs.ensureDir(workflowDir);
  
  const filePath = path.join(workflowDir, 'dez-ci.yml');
  await fs.writeFile(filePath, yaml.trim());

  logger.success(`✅ GitHub Actions workflow generated at: ${filePath}`);
}
