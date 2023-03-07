import path from 'path';

class State {
  private _rootDirectory: string = path.join(
    process.env.HOME!,
    process.env.NODE_ENV === 'production' ? 'Notes' : 'Notes (Testing)'
  );

  get rootDirectory(): string {
    return this._rootDirectory;
  }

  set rootDirectory(rootDirectory: string) {
    this._rootDirectory = rootDirectory;
  }
}

const state = new State();

export default state;
