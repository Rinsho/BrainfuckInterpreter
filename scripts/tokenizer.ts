import * as Tokens from './tokens.js';
import { IExecutionContext } from './executioncontext.js';
import { Pointer } from './memory.js';

type TokenConstructor = (context: IExecutionContext) => Tokens.IToken;

export class Tokenizer {
    private _tokenConstructors: { [key: string]: TokenConstructor } = {
        [Tokens.IncrementValueToken.StartChar]: (context) => new Tokens.IncrementValueToken(context.Pointer),
        [Tokens.IncrementPointerToken.StartChar]: (context) => new Tokens.IncrementPointerToken(context.Pointer),
        [Tokens.DecrementValueToken.StartChar]: (context) => new Tokens.DecrementValueToken(context.Pointer),
        [Tokens.DecrementPointerToken.StartChar]: (context) => new Tokens.DecrementPointerToken(context.Pointer),
        [Tokens.ReadInputToken.StartChar]: (context) => new Tokens.ReadInputToken(context.Pointer, context.Input),
        [Tokens.WriteOutputToken.StartChar]: (context) => new Tokens.WriteOutputToken(context.Pointer, context.Output)
    };

    private BracketMatching(code: string): boolean {
        let bracketStack: number = 0;
        for (let i = 0; i < code.length; i++) {
            switch (code.charAt(i))
            {
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

    private TokenizeImpl(code: string, context: IExecutionContext): Tokens.IToken[] {
        let tokens: Tokens.IToken[] = [];
        for (let i = 0; i < code.length; i++) {
            let char = code.charAt(i);
            switch (char)
            {
                case Tokens.WhileLoopToken.StartChar:
                    let loopTokens = this.TokenizeImpl(code.slice(i + 1), context);
                    tokens.push(new Tokens.WhileLoopToken(context.Pointer, loopTokens));
                    //skip bracket and processed tokens, loop increment will skip final bracket
                    i += 1 + loopTokens.length;
                    break;

                case Tokens.WhileLoopToken.EndChar:
                    return tokens;

                default:
                    let token = this._tokenConstructors[char]?.(context);
                    if (token)
                        tokens.push(token);
                    break;
            }
        }
        return tokens;
    }

    public Tokenize(code: string, context: IExecutionContext): Tokens.IToken[] {
        if (!this.BracketMatching(code))
            throw new Error(`Imbalanced control flow characters.`);
        return this.TokenizeImpl(code, context);
    }

    public RegisterToken(token: string, constructor: TokenConstructor) {
        this._tokenConstructors[token] = constructor;
    }
}