import { Pointer, Memory } from './memory.js';
import { InputStream, OutputStream, DebugInfo } from './executioncontext.js';

export interface IToken {
    Execute(): void;
}

export class IncrementValueToken implements IToken {
    static StartChar = '+';

    constructor(protected readonly _pointer: Pointer) { }

    public Execute(): void {
        this._pointer.Increment();
    }
}

export class DecrementValueToken implements IToken {
    static StartChar = '-';

    constructor(protected readonly _pointer: Pointer) { }

    public Execute(): void {
        this._pointer.Decrement();
    }
}

export class IncrementPointerToken implements IToken {
    static StartChar = '>';

    constructor(protected readonly _pointer: Pointer) { }

    public Execute(): void {
        this._pointer.MoveRight();
    }
}

export class DecrementPointerToken implements IToken {
    static StartChar = '<';

    constructor(protected readonly _pointer: Pointer) { }

    public Execute(): void {
        this._pointer.MoveLeft();
    }
}

export class ReadInputToken implements IToken {
    static StartChar = ',';

    constructor(
        protected readonly _pointer: Pointer, 
        protected readonly _input: InputStream
    ) { }

    public Execute(): void {
        let charCode = this._input.ReadNextChar();
        while (charCode > 0) {
            this._pointer.Increment();
            charCode--;
        }
    }
}

export class WriteOutputToken implements IToken {
    static StartChar = '.';

    constructor(
        protected readonly _pointer: Pointer,
        protected readonly _output: OutputStream
    ) { }

    public Execute(): void {
        let charCode = this._pointer.GetValue();
        this._output.WriteNextCharCode(charCode);
    }
}

export class WhileLoopToken implements IToken {
    static StartChar = '[';
    static EndChar = ']';

    constructor(
        protected readonly _pointer: Pointer,
        protected readonly _tokens: IToken[]
    ) { }

    public Execute(): void {
        let val = this._pointer.GetValue();
        while (val !== 0) {
            for (let token of this._tokens)
                token.Execute();
            val = this._pointer.GetValue();
        }
    }
}

export class MemoryDumpToken implements IToken {
    static StartChar = '$';

    constructor(
        protected readonly _memory: Memory, 
        protected readonly _debug: DebugInfo
    ) { }

    public Execute(): void {
        let memoryCopy = this._memory.Copy();
        this._debug.AddDebugInfo(memoryCopy);
    }
}