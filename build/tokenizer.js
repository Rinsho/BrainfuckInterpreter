import * as Tokens from './tokens.js';
export class Tokenizer {
    constructor() {
        this._tokenConstructors = {
            [Tokens.IncrementValueToken.StartChar]: (context) => new Tokens.IncrementValueToken(context.Pointer),
            [Tokens.IncrementPointerToken.StartChar]: (context) => new Tokens.IncrementPointerToken(context.Pointer),
            [Tokens.DecrementValueToken.StartChar]: (context) => new Tokens.DecrementValueToken(context.Pointer),
            [Tokens.DecrementPointerToken.StartChar]: (context) => new Tokens.DecrementPointerToken(context.Pointer),
            [Tokens.ReadInputToken.StartChar]: (context) => new Tokens.ReadInputToken(context.Pointer, context.Input),
            [Tokens.WriteOutputToken.StartChar]: (context) => new Tokens.WriteOutputToken(context.Pointer, context.Output)
        };
    }
    BracketMatching(code) {
        let bracketStack = 0;
        for (let i = 0; i < code.length; i++) {
            switch (code.charAt(i)) {
                case Tokens.WhileLoopToken.StartChar:
                    bracketStack++;
                    break;
                case Tokens.WhileLoopToken.EndChar:
                    if (--bracketStack < 0)
                        return false;
                    break;
                default:
                    break;
            }
        }
        return bracketStack === 0;
    }
    TokenizeImpl(code, context) {
        var _a, _b;
        let tokens = [];
        for (let i = 0; i < code.length; i++) {
            let char = code.charAt(i);
            switch (char) {
                case Tokens.WhileLoopToken.StartChar:
                    let loopTokens = this.TokenizeImpl(code.slice(i + 1), context);
                    tokens.push(new Tokens.WhileLoopToken(context.Pointer, loopTokens));
                    //skip bracket and processed tokens, loop increment will skip final bracket
                    i += 1 + loopTokens.length;
                    break;
                case Tokens.WhileLoopToken.EndChar:
                    return tokens;
                default:
                    let token = (_b = (_a = this._tokenConstructors)[char]) === null || _b === void 0 ? void 0 : _b.call(_a, context);
                    if (token)
                        tokens.push(token);
                    break;
            }
        }
        return tokens;
    }
    Tokenize(code, context) {
        if (!this.BracketMatching(code))
            throw new Error(`Imbalanced control flow characters.`);
        return this.TokenizeImpl(code, context);
    }
    RegisterToken(token, constructor) {
        this._tokenConstructors[token] = constructor;
    }
}
