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

    ReadNextCharCode(): number {
        if (this._current > this._input.length - 1)
            return -1;
        return this._input.charCodeAt(this._current++);
    }

    ReadNextChar(): number {
        return this.ReadNextCharCode() - 48;
    }
}

export class OutputStream {
    private _output: string = '';

    constructor(private _convertToAscii: boolean) { }

    WriteNextCharCode(charCode: number): string {
        return this.WriteNextChar(String.fromCharCode(charCode));
    }

    WriteNextChar(char: string): string {
        if (this._convertToAscii)
            char = String.fromCharCode(char.charCodeAt(0) + 48);
        this._output = this._output.concat(char);
        return this._output;
    }

    GetString(): string {
        return this._output;
    }
}

export class DebugInfo {
    private _debugInfo: Memory[] = [];
    private _current: number = 0;

    AddDebugInfo(memoryCopy: Memory): void {
        if (memoryCopy)
            this._debugInfo[this._current++] = memoryCopy;
    }

    GetDebugInfo(): number[][] {
        let info = [];
        for (let debugItem of this._debugInfo)
            info.push(debugItem.AsArray());
        return info;
    }
}