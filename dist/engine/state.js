import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(__dirname, '..', '..', 'runtime', 'state.json');
const RUNTIME_DIR = path.join(__dirname, '..', '..', 'runtime');
const DEFAULT_STATE = {
    version: '1.1.0',
    activeProject: null,
    projects: {},
    globalFailCount: 0,
    lastUpdated: new Date().toISOString(),
};
function ensureRuntime() {
    if (!fs.existsSync(RUNTIME_DIR)) {
        fs.mkdirSync(RUNTIME_DIR, { recursive: true });
    }
}
export function loadState() {
    ensureRuntime();
    if (!fs.existsSync(STATE_PATH)) {
        fs.writeFileSync(STATE_PATH, JSON.stringify(DEFAULT_STATE, null, 2));
        return { ...DEFAULT_STATE };
    }
    try {
        return JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
    }
    catch {
        return { ...DEFAULT_STATE };
    }
}
export function saveState(state) {
    ensureRuntime();
    state.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}
export function getProject(name) {
    const state = loadState();
    return state.projects[name] ?? null;
}
export function upsertProject(project) {
    const state = loadState();
    state.projects[project.name] = project;
    state.activeProject = project.name;
    saveState(state);
}
export function setActiveProject(name) {
    const state = loadState();
    if (!state.projects[name])
        throw new Error(`Project "${name}" not found in state.`);
    state.activeProject = name;
    saveState(state);
}
export function getActiveProject() {
    const state = loadState();
    if (!state.activeProject)
        return null;
    return state.projects[state.activeProject] ?? null;
}
export function incrementFailCount(projectName) {
    const state = loadState();
    const proj = state.projects[projectName];
    if (proj) {
        proj.failCount = (proj.failCount ?? 0) + 1;
        state.globalFailCount = (state.globalFailCount ?? 0) + 1;
        saveState(state);
        return proj.failCount;
    }
    return 0;
}
export function resetFailCount(projectName) {
    const state = loadState();
    const proj = state.projects[projectName];
    if (proj) {
        proj.failCount = 0;
        saveState(state);
    }
}
//# sourceMappingURL=state.js.map