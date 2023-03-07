import Store from 'electron-store';
import os from 'os';
import path from 'path';

// Keys
const CURRENT_WORKSPACE = 'currentWorkspace';

const initialWorkspace =
  process.env.NODE_ENV === 'production'
    ? path.join(os.homedir(), 'Notes')
    : path.join(os.homedir(), 'Developer', 'Notes');

class State {
  private currentWorkspace: string;

  private store: Store;

  constructor() {
    this.store = new Store();
    this.currentWorkspace = (this.store.get(CURRENT_WORKSPACE) as string) ?? initialWorkspace;
  }

  get workspace(): string {
    return this.currentWorkspace;
  }

  set workspace(workspace: string) {
    this.store.set(CURRENT_WORKSPACE, workspace);
    this.currentWorkspace = workspace;
  }
}

const state = new State();

export default state;
