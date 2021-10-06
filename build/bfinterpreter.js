import { Tokenizer } from './tokenizer.js';
import { Pointer } from './memory.js';
import { MemoryDumpToken } from './tokens.js';
import { InputStream, DebugInfo } from './executioncontext.js';
export class BFInterpreter {
    constructor(_memory, _output) {
        this._memory = _memory;
        this._output = _output;
        this._tokenizer = new Tokenizer();
        this._tokenizer.RegisterToken(MemoryDumpToken.StartChar, (context) => new MemoryDumpToken(context.Memory, context.Debug));
    }
    Execute(code, input) {
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
        };
    }
}
