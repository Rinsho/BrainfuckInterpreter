import * as Tokens from './tokens.js';
import { IExecutionContext } from './executioncontext.js';

type TokenGenerator = () => Tokens.IToken;

export class Tokenizer {
    private _tokenConstructors: { [key: string]: TokenGenerator } = {
        [Tokens.IncrementValueToken.Symbol]: () => Tokens.IncrementValueToken,
        [Tokens.IncrementPointerToken.Symbol]: () => Tokens.IncrementPointerToken,
        [Tokens.DecrementValueToken.Symbol]: () => Tokens.DecrementValueToken,
        [Tokens.DecrementPointerToken.Symbol]: () => Tokens.DecrementPointerToken,
        [Tokens.ReadInputToken.Symbol]: () => Tokens.ReadInputToken,
        [Tokens.WriteOutputToken.Symbol]: () => Tokens.WriteOutputToken,
        [Tokens.EndScopeToken.Symbol]: () => Tokens.EndScopeToken,
        [Tokens.WhileLoopToken.Symbol]: () => new Tokens.WhileLoopToken()
    };

    public Tokenize(code: string, context: IExecutionContext): Tokens.IToken {
        let scope = new Tokens.Scope();
        for (let i = 0; i < code.length; i++) {
            //If scope prematurely closes, it's because there's an extra close scope token.
            if (!scope.HasActiveScope)
                throw new Error('Imbalanced scopes: no open scope to close.');
            let char = code.charAt(i);
            let token = this._tokenConstructors[char]?.();
            if (token)
                scope.Add(token);
        }
        scope.HasActiveScope = false;
        //If scope didn't close, it's because there's still an open inner scope.
        if (scope.HasActiveScope)
            throw new Error('Imbalanced scopes: non-closed scope detected.');
        return scope;
    }

    public RegisterToken(token: string, generator: TokenGenerator) {
        this._tokenConstructors[token] = generator;
    }
}