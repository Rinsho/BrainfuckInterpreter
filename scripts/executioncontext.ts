import { Pointer, Memory, IReadOnlyMemory } from './memory.js';

export interface IExecutionContext {
    Memory: IReadOnlyMemory,
    Pointer: Pointer,
    Input: InputStream,
    Output: OutputStream,
    Debug: DebugInfo
}

export class InputStream {
    private _current: number = 0;

    constructor(private _input: string) { }

    public ReadNextCharCode(): number {
        if (this._current > this._input.length - 1)
            return -1;
        return this._input.charCodeAt(this._current++);
    }

    public ReadNextChar(): number {
        return this.ReadNextCharCode() - 48;
    }
}

export class OutputStream {
    private _output: string = '';

    constructor(private _convertToAscii: boolean) { }

    public WriteNextCharCode(charCode: number): string {
        return this.WriteNextChar(String.fromCharCode(charCode));
    }

    public WriteNextChar(char: string): string {
        if (this._convertToAscii)
            char = String.fromCharCode(char.charCodeAt(0) + 48);
        this._output = this._output.concat(char);
        return this._output;
    }

    public GetString(): string {
        return this._output;
    }
}

export class DebugInfo {
    private _debugInfo: Memory[] = [];
    private _current: number = 0;
    public get BlockSize() {
        return this._debugInfo[0]?.BlockSize ?? 1;
    }

    public AddDebugInfo(memoryCopy: Memory): void {
        if (memoryCopy)
            this._debugInfo[this._current++] = memoryCopy;
    }

    public AsArray(): number[][] {
        let info = [];
        for (let debugItem of this._debugInfo)
            info.push(debugItem.AsArray());
        return info;
    }
}