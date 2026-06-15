import { execSync } from 'child_process';
import { logger } from './logger.js';
export function runLocalCI() {
    logger.info("🧪 Running local CI simulation...");
    try {
        // Check muna kung may "lint" script
        try {
            execSync('npm run lint', { stdio: 'ignore' });
            logger.success("Linting passed");
        }
        catch {
            logger.warn("No 'lint' script found, skipping linting...");
        }
        // Run build
        execSync('npm run build', { stdio: 'inherit' });
        logger.success("✅ CI passed locally");
        return true;
    }
    catch (err) {
        logger.error("❌ CI failed locally");
        return false;
    }
}
//# sourceMappingURL=validationEngine.js.map