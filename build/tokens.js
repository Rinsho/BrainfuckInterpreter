export class IncrementValueToken {
    constructor(_pointer) {
        this._pointer = _pointer;
    }
    Execute() {
        this._pointer.Increment();
    }
}
IncrementValueToken.StartChar = '+';
export class DecrementValueToken {
    constructor(_pointer) {
        this._pointer = _pointer;
    }
    Execute() {
        this._pointer.Decrement();
    }
}
DecrementValueToken.StartChar = '-';
export class IncrementPointerToken {
    constructor(_pointer) {
        this._pointer = _pointer;
    }
    Execute() {
        this._pointer.MoveRight();
    }
}
IncrementPointerToken.StartChar = '>';
export class DecrementPointerToken {
    constructor(_pointer) {
        this._pointer = _pointer;
    }
    Execute() {
        this._pointer.MoveLeft();
    }
}
DecrementPointerToken.StartChar = '<';
export class ReadInputToken {
    constructor(_pointer, _input) {
        this._pointer = _pointer;
        this._input = _input;
    }
    Execute() {
        let charCode = this._input.ReadNextChar();
        while (charCode > 0) {
            this._pointer.Increment();
            charCode--;
        }
    }
}
ReadInputToken.StartChar = ',';
export class WriteOutputToken {
    constructor(_pointer, _output) {
        this._pointer = _pointer;
        this._output = _output;
    }
    Execute() {
        let charCode = this._pointer.GetValue();
        this._output.WriteNextCharCode(charCode);
    }
}
WriteOutputToken.StartChar = '.';
export class WhileLoopToken {
    constructor(_pointer, _tokens) {
        this._pointer = _pointer;
        this._tokens = _tokens;
    }
    Execute() {
        let val = this._pointer.GetValue();
        while (val !== 0) {
            for (let token of this._tokens)
                token.Execute();
            val = this._pointer.GetValue();
        }
    }
}
WhileLoopToken.StartChar = '[';
WhileLoopToken.EndChar = ']';
export class MemoryDumpToken {
    constructor(_memory, _debug) {
        this._memory = _memory;
        this._debug = _debug;
    }
    Execute() {
        let memoryCopy = this._memory.Copy();
        this._debug.AddDebugInfo(memoryCopy);
    }
}
MemoryDumpToken.StartChar = '$';
