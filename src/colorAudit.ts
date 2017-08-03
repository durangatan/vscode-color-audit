import CSS_COLOR_NAMES from './cssColors';

export default class ColorParser {
  private _getRgbaMatches(fileContents: string): Array<string> {
    const rgbaRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/gi;
    const matches = fileContents.match(rgbaRegex);
    return matches || [];
  }
  private _getColorWordMatches(fileContents: string): Array<string> {
    const matches = [];
    CSS_COLOR_NAMES.forEach(colorName => {
      const colorRegex = new RegExp(`\\s${colorName}`, 'gi');
      const thisColorMatches = fileContents.match(colorRegex);
      if (thisColorMatches) {
        matches.push(thisColorMatches);
      }
    });
    return [].concat.apply([], matches);
  }
  private _getHexValues(fileContents: string): Array<string> {
    const hexMatch = /(#[0-9A-F]{6})|(#[0-9A-F]{3})/gi;
    const matches = fileContents.match(hexMatch);
    return matches || [];
  }

  private _accumulateMatches(matches: Array<string>): object {
    return matches.reduce((accumulator, match) => {
      if (accumulator[match]) {
        return { ...accumulator, [match]: accumulator[match]++ };
      } else {
        return { ...accumulator, [match]: 1 };
      }
    }, {});
  }

  public generateColorAudit(arrayOfFileContents: Array<string>): object {
    let allMatches = [];
    arrayOfFileContents.forEach(fileAsString => {
      const hexMatches = this._getHexValues(fileAsString);
      const colorMatches = this._getColorWordMatches(fileAsString);
      const rgbaMatches = this._getRgbaMatches(fileAsString);
      allMatches = [
        ...allMatches,
        ...hexMatches,
        ...colorMatches,
        ...rgbaMatches
      ];
    });
    return this._accumulateMatches(allMatches);
  }
}
