import { IExecutionContext } from './executioncontext.js';

export interface IToken {
    Execute(context: IExecutionContext): void;
}

export class Scope implements IToken {
    protected _tokens: IToken[] = [];
    protected _hasActiveScope: boolean = true;

    public get HasActiveScope() {
        return this._hasActiveScope;
    }
    public set HasActiveScope(active: boolean) {
        if (!active)
        {
            let mostRecentToken = this._tokens[this._tokens.length - 1] as Scope;
            if (mostRecentToken?.HasActiveScope)
                active = true;
        }
        this._hasActiveScope = active;
    }
    
    public Add(token: IToken): void {             
        let mostRecentToken = this._tokens[this._tokens.length - 1] as Scope;
        if (mostRecentToken?.HasActiveScope)
            mostRecentToken.Add(token);
        else if (token === EndScopeToken)
            this.HasActiveScope = false;
        else
            this._tokens.push(token);
    }

    public Execute(context: IExecutionContext): void {
        for (let token of this._tokens)
            token.Execute(context);
    }
}

export class WhileLoopToken extends Scope {
    public static Symbol = '[';

    public Execute(context: IExecutionContext): void {
        let val = context.Pointer.GetValue();
        while (val !== 0) {
            super.Execute(context);
            val = context.Pointer.GetValue();
        }
    }
}

export class EndScopeToken {
    public static Symbol = ']';

    //Symbol has no effects related to state; purely for control flow.
    public static Execute(): void { }
}

export class IncrementValueToken {
    public static Symbol = '+';

    public static Execute(context: IExecutionContext): void {
        context.Pointer.Increment();
    }
}

export class DecrementValueToken {
    public static Symbol = '-';

    public static Execute(context: IExecutionContext): void {
        context.Pointer.Decrement();
    }
}

export class IncrementPointerToken {
    public static Symbol = '>';

    public static Execute(context: IExecutionContext): void {
        context.Pointer.MoveRight();
    }
}

export class DecrementPointerToken {
    public static Symbol = '<';

    public static Execute(context: IExecutionContext): void {
        context.Pointer.MoveLeft();
    }
}

export class ReadInputToken {
    public static Symbol = ',';

    public static Execute(context: IExecutionContext): void {
        let charCode = context.Input.ReadNextChar();
        while (charCode > 0) {
            context.Pointer.Increment();
            charCode--;
        }
    }
}

export class WriteOutputToken {
    public static Symbol = '.';

    public static Execute(context: IExecutionContext): void {
        let charCode = context.Pointer.GetValue();
        context.Output.WriteNextCharCode(charCode);
    }
}

export class MemoryDumpToken {
    public static Symbol = '$';

    public static Execute(context: IExecutionContext): void {
        let memoryCopy = context.Memory.Copy();
        context.Debug.AddDebugInfo(memoryCopy);
    }
}