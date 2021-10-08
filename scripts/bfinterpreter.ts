import { Tokenizer } from './tokenizer.js';
import { Pointer, Memory } from './memory.js';
import { MemoryDumpToken } from './tokens.js';
import { InputStream, OutputStream, DebugInfo } from './executioncontext.js';

export class BFInterpreter {
    private _tokenizer: Tokenizer;

    constructor(private _memory: Memory, private _output: OutputStream) {
        this._tokenizer = new Tokenizer();
        this._tokenizer.RegisterToken(
            MemoryDumpToken.Symbol,
            () => MemoryDumpToken
        );
    }

    public Execute(code: string, input: InputStream): { Output: OutputStream, Debug: DebugInfo } {
        let context = {
            Memory: this._memory,
            Pointer: new Pointer(this._memory),
            Input: input,
            Output: this._output,
            Debug: new DebugInfo()
        };
        this._tokenizer.Tokenize(code, context).Execute(context);
        return {
            Output: context.Output,
            Debug: context.Debug
        }
    }
}