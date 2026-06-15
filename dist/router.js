import { runInit } from './commands/init.js';
import { runDev } from './commands/dev.js';
import { runDeploy } from './commands/deploy.js';
import { runDoctor } from './commands/doctor.js';
import { runGit } from './commands/git.js';
import { runCicdInit } from './commands/cicd/init.js';
import { runCicdGenerate } from './commands/cicd/generate.js';
import { runCicdDeploy } from './commands/cicd/deploy.js';
import { runCicdValidate } from './commands/cicd/validate.js';
const COMMANDS = {
    init: runInit,
    dev: runDev,
    deploy: runDeploy,
    doctor: runDoctor,
    git: runGit,
};
const CICD_COMMANDS = {
    init: runCicdInit,
    generate: runCicdGenerate,
    deploy: runCicdDeploy,
    validate: runCicdValidate,
};
export async function route(command, params) {
    if (command === 'cicd') {
        const sub = params[0];
        const subParams = params.slice(1);
        if (!sub) {
            await runCicdInit([]);
            return;
        }
        const handler = CICD_COMMANDS[sub];
        if (!handler) {
            throw new Error(`Unknown cicd subcommand: "${sub}"`);
        }
        await handler(subParams);
        return;
    }
    const handler = COMMANDS[command];
    if (!handler) {
        throw new Error(`Unknown command: "${command}"`);
    }
    await handler(params);
}
//# sourceMappingURL=router.js.map