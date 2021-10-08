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
    get BlockSize() {
        var _a, _b;
        return (_b = (_a = this._debugInfo[0]) === null || _a === void 0 ? void 0 : _a.BlockSize) !== null && _b !== void 0 ? _b : 1;
    }
    AddDebugInfo(memoryCopy) {
        if (memoryCopy)
            this._debugInfo[this._current++] = memoryCopy;
    }
    AsArray() {
        let info = [];
        for (let debugItem of this._debugInfo)
            info.push(debugItem.AsArray());
        return info;
    }
}
