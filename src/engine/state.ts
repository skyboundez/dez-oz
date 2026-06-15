import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(__dirname, '..', '..', 'runtime', 'state.json');
const RUNTIME_DIR = path.join(__dirname, '..', '..', 'runtime');

export interface ProjectState {
  name: string;
  path: string;
  createdAt: string;
  lastCommand: string;
  lastCommandAt: string;
  gitInitialized: boolean;
  dockerReady: boolean;
  prismaGenerated: boolean;
  buildCount: number;
  failCount: number;
  lastStableCommit: string | null;
}

export interface DEZState {
  version: string;
  activeProject: string | null;
  projects: Record<string, ProjectState>;
  globalFailCount: number;
  lastUpdated: string;
}

const DEFAULT_STATE: DEZState = {
  version: '1.1.0',
  activeProject: null,
  projects: {},
  globalFailCount: 0,
  lastUpdated: new Date().toISOString(),
};

function ensureRuntime(): void {
  if (!fs.existsSync(RUNTIME_DIR)) {
    fs.mkdirSync(RUNTIME_DIR, { recursive: true });
  }
}

export function loadState(): DEZState {
  ensureRuntime();
  if (!fs.existsSync(STATE_PATH)) {
    fs.writeFileSync(STATE_PATH, JSON.stringify(DEFAULT_STATE, null, 2));
    return { ...DEFAULT_STATE };
  }
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8')) as DEZState;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: DEZState): void {
  ensureRuntime();
  state.lastUpdated = new Date().toISOString();
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

export function getProject(name: string): ProjectState | null {
  const state = loadState();
  return state.projects[name] ?? null;
}

export function upsertProject(project: ProjectState): void {
  const state = loadState();
  state.projects[project.name] = project;
  state.activeProject = project.name;
  saveState(state);
}

export function setActiveProject(name: string): void {
  const state = loadState();
  if (!state.projects[name]) throw new Error(`Project "${name}" not found in state.`);
  state.activeProject = name;
  saveState(state);
}

export function getActiveProject(): ProjectState | null {
  const state = loadState();
  if (!state.activeProject) return null;
  return state.projects[state.activeProject] ?? null;
}

export function incrementFailCount(projectName: string): number {
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

export function resetFailCount(projectName: string): void {
  const state = loadState();
  const proj = state.projects[projectName];
  if (proj) {
    proj.failCount = 0;
    saveState(state);
  }
}