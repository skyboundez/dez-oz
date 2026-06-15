import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_PATH = path.join(__dirname, '..', '..', 'runtime', 'logs.json');
const RUNTIME_DIR = path.join(__dirname, '..', '..', 'runtime');
function ensureRuntime() {
    if (!fs.existsSync(RUNTIME_DIR)) {
        fs.mkdirSync(RUNTIME_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOGS_PATH)) {
        fs.writeFileSync(LOGS_PATH, JSON.stringify([], null, 2));
    }
}
function appendLog(entry) {
    ensureRuntime();
    let logs = [];
    try {
        logs = JSON.parse(fs.readFileSync(LOGS_PATH, 'utf-8'));
    }
    catch {
        logs = [];
    }
    logs.push(entry);
    if (logs.length > 1000)
        logs = logs.slice(-1000);
    fs.writeFileSync(LOGS_PATH, JSON.stringify(logs, null, 2));
}
const COLORS = {
    info: '\x1b[36m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    success: '\x1b[32m',
    debug: '\x1b[2m',
};
const ICONS = {
    info: '→',
    warn: '⚠',
    error: '✗',
    success: '✓',
    debug: '·',
};
function log(level, message) {
    const ts = new Date().toISOString();
    const color = COLORS[level];
    const icon = ICONS[level];
    console.log(`  ${color}${icon}\x1b[0m \x1b[2m${ts.slice(11, 19)}\x1b[0m  ${message}`);
    appendLog({ ts, level, message });
}
export const logger = {
    info: (msg) => log('info', msg),
    warn: (msg) => log('warn', msg),
    error: (msg) => log('error', msg),
    success: (msg) => log('success', msg),
    debug: (msg) => log('debug', msg),
    step: (n, total, msg) => {
        console.log(`\n  \x1b[36m[${n}/${total}]\x1b[0m ${msg}`);
        appendLog({ ts: new Date().toISOString(), level: 'info', message: `[${n}/${total}] ${msg}` });
    },
    section: (title) => {
        console.log(`\n  \x1b[1m\x1b[36m▸ ${title}\x1b[0m`);
        console.log(`  \x1b[2m${'─'.repeat(40)}\x1b[0m`);
    },
    halt: (reason) => {
        console.error(`\n  \x1b[31m\x1b[1m╔══════════════════════════════════╗\x1b[0m`);
        console.error(`  \x1b[31m\x1b[1m║  DEZ HALT — MANUAL INTERVENTION  ║\x1b[0m`);
        console.error(`  \x1b[31m\x1b[1m╚══════════════════════════════════╝\x1b[0m`);
        console.error(`  \x1b[31m${reason}\x1b[0m\n`);
        appendLog({ ts: new Date().toISOString(), level: 'error', message: `HALT: ${reason}` });
    },
};
//# sourceMappingURL=logger.js.map