'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import CSS_COLOR_NAMES from './cssColors';
const { keys } = Object;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  const config = vscode.workspace.getConfiguration('colorAudit') || {};
  const handleGetIncludes = config => {
    const includes = config.get('includes');
    const defaultIncludes = '{**/*.sass,**/*.scss,**/*.css}';
    if (includes) {
      const configKeys = keys(includes);
      return `{${configKeys.join(',')}}`;
    }
    return defaultIncludes;
  };
  const handleGetExcludes = config => {
    const excludes = config.get('excludes');
    if (excludes) {
      const configKeys = keys(excludes);
      return `{${keys(config.get('excludes')).join(',')}}`;
    }
    return '';
  };
  const includes = handleGetIncludes(config);
  const excludes = handleGetExcludes(config);
  const outputChannel = vscode.window.createOutputChannel('Code Audit');
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  vscode.workspace.findFiles(includes, excludes).then(arrayOfFiles => {
    const usageByColor = {};
    arrayOfFiles.forEach(file => {
      const { fsPath } = file;
      const hexMatches = getHexValues(fsPath);
      hexMatches.forEach(match => {
        if (usageByColor[match]) {
          usageByColor[match]++;
        } else {
          usageByColor[match] = 1;
        }
      });
      const colorMatches = getColorMatches(fsPath);
      colorMatches.forEach(match => {
        if (usageByColor[match]) {
          usageByColor[match]++;
        } else {
          usageByColor[match] = 1;
        }
      });
      const rgbaMatches = getRgbaMatches(fsPath);
      rgbaMatches.forEach(match => {
        if (usageByColor[match]) {
          usageByColor[match]++;
        } else {
          usageByColor[match] = 1;
        }
      });
    });
    outputChannel.append(printAudit(usageByColor));
    outputChannel.show();
  });
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Performing a Color Audit!');
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getHexValues(fsPath: string): Array<string> {
  const hexMatch = /(#[0-9A-F]{6})|(#[0-9A-F]{3})/gi;
  const fileContents: String = readFileSync(fsPath).toString();
  const matches = fileContents.match(hexMatch);
  return matches || [];
}

function printAudit(usageByColor: object): string {
  const colorAuditText = keys(
    usageByColor
  ).reduce((stringToPrint, currentHex) => {
    const thisColorQuantity = usageByColor[currentHex];
    const quantityText =
      thisColorQuantity > 1 ? `${thisColorQuantity} times` : '1 time';

    return `${stringToPrint} ${currentHex}: ${quantityText}\n`;
  }, '');
  const statistics = `total colors in your project: ${keys(usageByColor)
    .length}`;
  return `Color Usage:\n${colorAuditText} \n ${statistics}`;
}

function getColorMatches(fsPath: string): Array<string> {
  const fileContents: String = readFileSync(fsPath).toString();
  const matches = [];
  CSS_COLOR_NAMES.forEach(colorName => {
    const colorRegex = new RegExp(colorName, 'gi');
    const thisColorMatches = fileContents.match(colorRegex);
    if (thisColorMatches) {
      matches.push(thisColorMatches);
    }
  });
  return [].concat.apply([], matches);
}

function getRgbaMatches(fsPath: string): Array<string> {
  const rgbaRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/gi;
  const fileContents: String = readFileSync(fsPath).toString();
  const matches = fileContents.match(rgbaRegex);
  return matches || [];
}
