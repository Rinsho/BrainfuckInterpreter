import { BFInterpreter } from './bfinterpreter.js';
import { DebugInfo, InputStream, OutputStream } from './executioncontext.js';
import { MemoryBlockSizes, Memory, SignedMemory } from './memory.js';
function Empty(element) {
    while (element.lastChild)
        element.removeChild(element.lastChild);
}
function SetupCustomRadio(elements, onClick) {
    for (let e of elements)
        e.addEventListener('click', Callback);
    return DestroyCustomRadio;
    function Callback(e) {
        e.preventDefault();
        let target = e.currentTarget;
        Highlight(target);
        onClick(target.value);
    }
    function Highlight(element) {
        let parent = element.parentElement;
        for (let child of parent.children)
            child.classList.remove("custom-radio-selected");
        element.classList.add("custom-radio-selected");
    }
    function DestroyCustomRadio() {
        for (let e of elements)
            e.removeEventListener('click', Callback);
    }
}
export class OptionsViewModel {
    constructor(DebugElement, ConvertOutputElement, MemorySizeElement, MemorySignedElement, BlockSizeElements) {
        this.IsDebugEnabled = false;
        this.IsMemorySigned = false;
        this.EnableAsciiOutput = false;
        this._memorySize = 0;
        this._blockSize = MemoryBlockSizes.Char;
        this.IsDebugEnabled = DebugElement.checked;
        DebugElement.addEventListener('change', (e) => {
            let target = e.currentTarget;
            this.IsDebugEnabled = target.checked;
        });
        this.EnableAsciiOutput = ConvertOutputElement.checked;
        ConvertOutputElement.addEventListener('change', (e) => {
            let target = e.currentTarget;
            this.EnableAsciiOutput = target.checked;
        });
        this.IsMemorySigned = MemorySignedElement.checked;
        MemorySignedElement.addEventListener('change', (e) => {
            let target = e.currentTarget;
            this.IsMemorySigned = target.checked;
        });
        this.MemorySize = Number.parseInt(MemorySizeElement.value);
        MemorySizeElement.addEventListener('change', (e) => {
            let target = e.currentTarget;
            this.MemorySize = Number.parseInt(target.value);
        });
        SetupCustomRadio(BlockSizeElements, (val) => {
            this.BlockSize = Math.pow(2, (Number.parseInt(val) * 8));
        });
    }
    get MemorySize() {
        return this._memorySize;
    }
    set MemorySize(val) {
        if (val > 0)
            this._memorySize = val;
    }
    get BlockSize() {
        return this._blockSize;
    }
    set BlockSize(val) {
        if (typeof MemoryBlockSizes[val] !== 'undefined')
            this._blockSize = val;
    }
}
export class DebugViewModel {
    constructor(memoryDumpList, memoryDumpBody, dumpTypes) {
        this._dumpListCleanup = null;
        this._selectedDumpType = "Hex";
        this._selectedDumpNumber = 0;
        this._debugInfo = new DebugInfo();
        this.DisplayMemory = (dumpNumber) => {
            Empty(memoryDumpBody);
            let rawDebugInfo = this._debugInfo.AsArray();
            if (rawDebugInfo.length === 0)
                return;
            for (let i = 0; i < rawDebugInfo[dumpNumber].length; i++) {
                let item = rawDebugInfo[dumpNumber][i];
                let formattedItem;
                let padding;
                switch (this._selectedDumpType) {
                    case "Decimal":
                        padding = '0'.repeat(Math.ceil(Math.log2(this._debugInfo.BlockSize) / Math.log2(10)));
                        formattedItem = (padding + item).substring(item.toString().length);
                        break;
                    case "Hex":
                        padding = '0'.repeat(Math.ceil(Math.log2(this._debugInfo.BlockSize) / Math.log2(16)));
                        formattedItem = item.toString(16);
                        formattedItem = (padding + formattedItem).substring(formattedItem.length);
                        break;
                    case "ASCII":
                        formattedItem = String.fromCharCode(item);
                        break;
                    default:
                        throw new Error(`Dump type ${this._selectedDumpType} is not valid.`);
                }
                let div = document.createElement('div');
                div.textContent = formattedItem;
                div.classList.add('modal-memory-item');
                memoryDumpBody.appendChild(div);
            }
        };
        this.CreateDumpList = () => {
            if (this._dumpListCleanup !== null) {
                this._dumpListCleanup();
                this._dumpListCleanup = null;
            }
            Empty(memoryDumpList);
            Empty(memoryDumpBody);
            let rawDebugInfo = this._debugInfo.AsArray();
            if (rawDebugInfo.length === 0)
                return;
            for (let i = 0; i < rawDebugInfo.length; i++) {
                let listItem = document.createElement('li');
                listItem.textContent = `Dump #${i}`;
                listItem.value = i;
                memoryDumpList.appendChild(listItem);
            }
            this._dumpListCleanup = SetupCustomRadio(Array.prototype.slice.call(memoryDumpList.children), (val) => {
                this._selectedDumpNumber = Number.parseInt(val);
                this.DisplayMemory(this._selectedDumpNumber);
            });
            memoryDumpList.firstElementChild.click();
        };
        this.Reset();
        SetupCustomRadio(dumpTypes, (val) => {
            this._selectedDumpType = val;
            this.DisplayMemory(this._selectedDumpNumber);
        });
        dumpTypes[0].click();
    }
    set DebugInfo(info) {
        if (info) {
            this._debugInfo = info;
            this.CreateDumpList();
        }
    }
    Reset() {
        this.DebugInfo = new DebugInfo();
    }
}
export function InterpreterElementsSetup(CodeElement, InputElement, OutputElement, SubmitElement, Options, Debug) {
    SubmitElement.addEventListener('click', (e) => {
        Debug.Reset();
        let memory = Options.IsMemorySigned ?
            new SignedMemory(Options.MemorySize, Options.BlockSize)
            : new Memory(Options.MemorySize, Options.BlockSize);
        let interpreter = new BFInterpreter(memory, new OutputStream(Options.EnableAsciiOutput));
        let { Output: output, Debug: debugInfo } = interpreter.Execute(CodeElement.value, new InputStream(InputElement.value));
        OutputElement.value = output.GetString();
        if (Options.IsDebugEnabled)
            Debug.DebugInfo = debugInfo;
    });
}
