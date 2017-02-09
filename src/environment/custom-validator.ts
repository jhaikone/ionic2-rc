const NUMBER_PATTERN = new RegExp('^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$');

export class CustomValidator {

    static hcp(event, hcp) {
        let newHcp = hcp + event.key;
        let dotIndex = newHcp.indexOf('.');
        let decimalPrecision = 0;

        if (dotIndex > -1) {
            decimalPrecision = newHcp.substr(dotIndex+1).length;
        }

        if (this.isInvalidHcp(hcp, newHcp, decimalPrecision)) {
            event.preventDefault();
        }
    }

    static isInvalidHcp(hcp, newHcp, decimalPrecision) {
        return !NUMBER_PATTERN.test(newHcp) || decimalPrecision > 1 || Number(hcp) === 54 || Number(newHcp) > 54;
    }
}