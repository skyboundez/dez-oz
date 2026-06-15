#!/usr/bin/env node

import { route } from './router.js';

import { logger } from './engine/logger.js';



const DEZ_BANNER = `\x1b[36m  ██████╗ ███████╗███████╗\x1b[0m

\x1b[36m  ██╔══██╗██╔════╝╚══███╔╝\x1b[0m  \x1b[2mv1.1.0 — DevOps Engine\x1b[0m

\x1b[36m  ██║  ██║█████╗    ███╔╝ \x1b[0m

\x1b[36m  ██║  ██║██╔══╝   ███╔╝  \x1b[0m

\x1b[36m  ██████╔╝███████╗███████╗\x1b[0m

\x1b[36m  ╚═════╝ ╚══════╝╚══════╝\x1b[0m`;



async function main(): Promise<void> {

  const args = process.argv.slice(2);

  const command = args[0];

  const params = args.slice(1);



  if (!command || command === '--help' || command === '-h') {

    console.log(DEZ_BANNER);

    console.log('  \x1b[1mUsage:\x1b[0m  dez  [options]\n');

    console.log('  \x1b[36minit\x1b[0m    Scaffold a new project workspace');

    console.log('  \x1b[36mdev\x1b[0m     Start local development mode');

    console.log('  \x1b[36mdeploy\x1b[0m  Run full production deploy pipeline');

    console.log('  \x1b[36mdoctor\x1b[0m  Validate environment dependencies');

    console.log('  \x1b[36mgit\x1b[0m     Git automation (init|commit|rollback|branch)');

    console.log('');

    process.exit(0);

  }



  console.log(DEZ_BANNER);

  logger.info(`Command: ${command} ${params.join(' ')}`);



  try {

    await route(command, params);

  } catch (err: unknown) {

    const message = err instanceof Error ? err.message : String(err);

    logger.error(`Fatal: ${message}`);

    console.error(`\n  \x1b[31m✗ DEZ HALT — MANUAL INTERVENTION REQUIRED\x1b[0m`);

    console.error(`  \x1b[2m${message}\x1b[0m\n`);

    process.exit(1);

  }

}



main();