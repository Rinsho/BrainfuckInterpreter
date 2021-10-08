export class Scope {
    constructor() {
        this._tokens = [];
        this._hasActiveScope = true;
    }
    get HasActiveScope() {
        return this._hasActiveScope;
    }
    set HasActiveScope(active) {
        if (!active) {
            let mostRecentToken = this._tokens[this._tokens.length - 1];
            if (mostRecentToken === null || mostRecentToken === void 0 ? void 0 : mostRecentToken.HasActiveScope)
                active = true;
        }
        this._hasActiveScope = active;
    }
    Add(token) {
        let mostRecentToken = this._tokens[this._tokens.length - 1];
        if (mostRecentToken === null || mostRecentToken === void 0 ? void 0 : mostRecentToken.HasActiveScope)
            mostRecentToken.Add(token);
        else if (token === EndScopeToken)
            this.HasActiveScope = false;
        else
            this._tokens.push(token);
    }
    Execute(context) {
        for (let token of this._tokens)
            token.Execute(context);
    }
}
export class WhileLoopToken extends Scope {
    Execute(context) {
        let val = context.Pointer.GetValue();
        while (val !== 0) {
            super.Execute(context);
            val = context.Pointer.GetValue();
        }
    }
}
WhileLoopToken.Symbol = '[';
export class EndScopeToken {
    //Symbol has no effects related to state; purely for control flow.
    static Execute() { }
}
EndScopeToken.Symbol = ']';
export class IncrementValueToken {
    static Execute(context) {
        context.Pointer.Increment();
    }
}
IncrementValueToken.Symbol = '+';
export class DecrementValueToken {
    static Execute(context) {
        context.Pointer.Decrement();
    }
}
DecrementValueToken.Symbol = '-';
export class IncrementPointerToken {
    static Execute(context) {
        context.Pointer.MoveRight();
    }
}
IncrementPointerToken.Symbol = '>';
export class DecrementPointerToken {
    static Execute(context) {
        context.Pointer.MoveLeft();
    }
}
DecrementPointerToken.Symbol = '<';
export class ReadInputToken {
    static Execute(context) {
        let charCode = context.Input.ReadNextChar();
        while (charCode > 0) {
            context.Pointer.Increment();
            charCode--;
        }
    }
}
ReadInputToken.Symbol = ',';
export class WriteOutputToken {
    static Execute(context) {
        let charCode = context.Pointer.GetValue();
        context.Output.WriteNextCharCode(charCode);
    }
}
WriteOutputToken.Symbol = '.';
export class MemoryDumpToken {
    static Execute(context) {
        let memoryCopy = context.Memory.Copy();
        context.Debug.AddDebugInfo(memoryCopy);
    }
}
MemoryDumpToken.Symbol = '$';
