import { OutputChannel, window } from 'vscode';
const { keys } = Object;
export default class ColorAuditView {
  private _outputChannel: OutputChannel;

  constructor() {
    this._outputChannel = window.createOutputChannel('Code Audit');
  }
  public printAudit(usageByColor: object) {
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
    this._outputChannel.append(
      `Color Usage:\n${colorAuditText} \n ${statistics}`
    );
    this._outputChannel.show();
  }
}
