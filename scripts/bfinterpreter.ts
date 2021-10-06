import { Tokenizer } from './tokenizer.js';
import { Pointer, Memory } from './memory.js';
import { MemoryDumpToken } from './tokens.js';
import { InputStream, OutputStream, DebugInfo } from './executioncontext.js';

export class BFInterpreter {
    private _tokenizer: Tokenizer;

    constructor(private _memory: Memory, private _output: OutputStream) {
        this._tokenizer = new Tokenizer();
        this._tokenizer.RegisterToken(
            MemoryDumpToken.StartChar,
            (context) => new MemoryDumpToken(context.Memory as Memory, context.Debug)
        );
    }

    public Execute(code: string, input: string): { Output: string, Debug: number[][] } {
        let context = {
            Memory: this._memory,
            Pointer: new Pointer(this._memory),
            Input: new InputStream(input),
            Output: this._output,
            Debug: new DebugInfo()
        };
        let tokens = this._tokenizer.Tokenize(code, context);
        for (let token of tokens)
            token.Execute();
        return {
            Output: context.Output.GetString(),
            Debug: context.Debug.GetDebugInfo()
        }
    }
}