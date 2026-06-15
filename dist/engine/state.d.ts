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
export declare function loadState(): DEZState;
export declare function saveState(state: DEZState): void;
export declare function getProject(name: string): ProjectState | null;
export declare function upsertProject(project: ProjectState): void;
export declare function setActiveProject(name: string): void;
export declare function getActiveProject(): ProjectState | null;
export declare function incrementFailCount(projectName: string): number;
export declare function resetFailCount(projectName: string): void;
//# sourceMappingURL=state.d.ts.map