import * as Tokens from './tokens.js';
export class Tokenizer {
    constructor() {
        this._tokenConstructors = {
            [Tokens.IncrementValueToken.Symbol]: () => Tokens.IncrementValueToken,
            [Tokens.IncrementPointerToken.Symbol]: () => Tokens.IncrementPointerToken,
            [Tokens.DecrementValueToken.Symbol]: () => Tokens.DecrementValueToken,
            [Tokens.DecrementPointerToken.Symbol]: () => Tokens.DecrementPointerToken,
            [Tokens.ReadInputToken.Symbol]: () => Tokens.ReadInputToken,
            [Tokens.WriteOutputToken.Symbol]: () => Tokens.WriteOutputToken,
            [Tokens.EndScopeToken.Symbol]: () => Tokens.EndScopeToken,
            [Tokens.WhileLoopToken.Symbol]: () => new Tokens.WhileLoopToken()
        };
    }
    Tokenize(code, context) {
        var _a, _b;
        let scope = new Tokens.Scope();
        for (let i = 0; i < code.length; i++) {
            //If scope prematurely closes, it's because there's an extra close scope token.
            if (!scope.HasActiveScope)
                throw new Error('Imbalanced scopes: no open scope to close.');
            let char = code.charAt(i);
            let token = (_b = (_a = this._tokenConstructors)[char]) === null || _b === void 0 ? void 0 : _b.call(_a);
            if (token)
                scope.Add(token);
        }
        scope.HasActiveScope = false;
        //If scope didn't close, it's because there's still an open inner scope.
        if (scope.HasActiveScope)
            throw new Error('Imbalanced scopes: non-closed scope detected.');
        return scope;
    }
    RegisterToken(token, generator) {
        this._tokenConstructors[token] = generator;
    }
}
