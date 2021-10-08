import { Tokenizer } from './tokenizer.js';
import { Pointer } from './memory.js';
import { MemoryDumpToken } from './tokens.js';
import { DebugInfo } from './executioncontext.js';
export class BFInterpreter {
    constructor(_memory, _output) {
        this._memory = _memory;
        this._output = _output;
        this._tokenizer = new Tokenizer();
        this._tokenizer.RegisterToken(MemoryDumpToken.Symbol, () => MemoryDumpToken);
    }
    Execute(code, input) {
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
        };
    }
}
