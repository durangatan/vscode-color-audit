'use strict';
import { ExtensionContext, workspace, window, commands } from 'vscode';

import CSS_COLOR_NAMES from './cssColors';
import ColorParser from './colorAudit';
import FileProvider from './fileProvider';
import Printer from './printer';

const { keys } = Object;

export function activate(context: ExtensionContext) {
  var disposable = commands.registerCommand('extension.sayHello', () => {
    // The code you place here will be executed every time your command is executed

    const fileProvider = new FileProvider();
    const printer = new Printer();
    const colorParser = new ColorParser();
    const colorAuditController = new ColorAuditController(
      fileProvider,
      printer,
      colorParser
    );
  });
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

class ColorAuditController {
  private _fileProvider: FileProvider;
  private _printer: Printer;
  private _colorParser: ColorParser;

  constructor(
    fileProvider: FileProvider,
    printer: Printer,
    colorParser: ColorParser
  ) {
    this._fileProvider = fileProvider;
    this._printer = printer;
    this._colorParser = colorParser;
    window.showInformationMessage('Performing a Color Audit!');
    this._fileProvider.getFilesToAudit().then(filesAsString => {
      this._printer.printAudit(
        this._colorParser.generateColorAudit(filesAsString)
      );
    });
  }
}
