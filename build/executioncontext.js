export class InputStream {
    constructor(_input) {
        this._input = _input;
        this._current = 0;
    }
    ReadNextCharCode() {
        if (this._current > this._input.length - 1)
            return -1;
        return this._input.charCodeAt(this._current++);
    }
    ReadNextChar() {
        return this.ReadNextCharCode() - 48;
    }
}
export class OutputStream {
    constructor(_convertToAscii) {
        this._convertToAscii = _convertToAscii;
        this._output = '';
    }
    WriteNextCharCode(charCode) {
        return this.WriteNextChar(String.fromCharCode(charCode));
    }
    WriteNextChar(char) {
        if (this._convertToAscii)
            char = String.fromCharCode(char.charCodeAt(0) + 48);
        this._output = this._output.concat(char);
        return this._output;
    }
    GetString() {
        return this._output;
    }
}
export class DebugInfo {
    constructor() {
        this._debugInfo = [];
        this._current = 0;
    }
    AddDebugInfo(memoryCopy) {
        if (memoryCopy)
            this._debugInfo[this._current++] = memoryCopy;
    }
    GetDebugInfo() {
        let info = [];
        for (let debugItem of this._debugInfo)
            info.push(debugItem.AsArray());
        return info;
    }
}
