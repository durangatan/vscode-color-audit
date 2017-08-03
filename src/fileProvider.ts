import {
  ExtensionContext,
  WorkspaceConfiguration,
  workspace,
  window,
  commands
} from 'vscode';
const { keys } = Object;
import { readFileSync } from 'fs';

export default class FileProvider {
  constructor() {
    this._config = workspace.getConfiguration('colorAudit');
    this._includes = this.getIncludedFileTypes();
    this._excludes = this.getExcludedFileTypes();
  }

  private _includes: string;
  private _excludes: string;
  private _config: WorkspaceConfiguration;

  private getIncludedFileTypes = () => {
    const includes = this._config.get('includes');
    const defaultIncludes = '{**/*.sass,**/*.scss,**/*.css}';
    if (includes) {
      const configKeys = keys(includes);
      return `{${configKeys.join(',')}}`;
    }
    return defaultIncludes;
  };

  private getExcludedFileTypes = () => {
    const excludes = this._config.get('excludes');
    if (excludes) {
      const configKeys = keys(excludes);
      return `{${keys(this._config.get('excludes')).join(',')}}`;
    }
    return '';
  };

  public getFilesToAudit = () =>
    workspace
      .findFiles(this._includes, this._excludes)
      .then(arrayOfFiles =>
        arrayOfFiles.map(file => readFileSync(file.fsPath).toString())
      );
}
