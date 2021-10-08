import { BFInterpreter } from './bfinterpreter.js';
import { InputStream, OutputStream } from './executioncontext.js';
import { MemoryBlockSizes, Memory, SignedMemory } from './memory.js';

interface IHTMLValueElement extends HTMLElement {
    value: string;
}

function Empty(element: HTMLElement) {
    while (element.lastChild)
        element.removeChild(element.lastChild);
}

function SetupCustomRadio(
    elements: IHTMLValueElement[],
    onClick: (value: string) => void
): () => void {
    for (let e of elements)
        e.addEventListener('click', Callback);
    return DestroyCustomRadio;
    
    function Callback(e: Event) {
        e.preventDefault();
        let target = e.currentTarget as IHTMLValueElement;
        Highlight(target);
        onClick(target.value);
    }

    function Highlight(element: HTMLElement) {
        let parent = element.parentElement as HTMLElement;
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
    public IsDebugEnabled: boolean = false;
    public IsMemorySigned: boolean = false;
    public EnableAsciiOutput: boolean = false;

    private _memorySize: number = 0;
    get MemorySize(): number {
        return this._memorySize;
    }
    set MemorySize(val: number) {
        if (val > 0)
            this._memorySize = val;
    }
 
    private _blockSize: MemoryBlockSizes = MemoryBlockSizes.Char;
    get BlockSize(): MemoryBlockSizes {
        return this._blockSize;
    }
    set BlockSize(val: MemoryBlockSizes) {
        if (typeof MemoryBlockSizes[val] !== 'undefined')
            this._blockSize = val;
    }

    constructor(
        DebugElement: HTMLInputElement,
        ConvertOutputElement: HTMLInputElement,
        MemorySizeElement: HTMLInputElement,
        MemorySignedElement: HTMLInputElement,
        BlockSizeElements: IHTMLValueElement[]
    ) {
        this.IsDebugEnabled = DebugElement.checked;
        DebugElement.addEventListener('change', (e: Event) => {
            let target = (e as UIEvent).currentTarget as HTMLInputElement;
            this.IsDebugEnabled = target.checked;
        });

        this.EnableAsciiOutput = ConvertOutputElement.checked;
        ConvertOutputElement.addEventListener('change', (e: Event) => {
            let target = (e as UIEvent).currentTarget as HTMLInputElement;
            this.EnableAsciiOutput = target.checked;
        });

        this.IsMemorySigned = MemorySignedElement.checked;
        MemorySignedElement.addEventListener('change', (e: Event) => {
            let target = (e as UIEvent).currentTarget as HTMLInputElement;
            this.IsMemorySigned = target.checked;
        });

        this.MemorySize = Number.parseInt(MemorySizeElement.value);
        MemorySizeElement.addEventListener('change', (e: Event) => {
            let target = (e as UIEvent).currentTarget as HTMLInputElement;
            this.MemorySize = Number.parseInt(target.value);
        });

        SetupCustomRadio(
            BlockSizeElements, 
            (val: string) => {
                this.BlockSize = 2 ** (Number.parseInt(val) * 8);
            }
        );
    }
}

type DumpTypes = "Hex" | "Decimal" | "ASCII";

export class DebugViewModel {
    private _dumpListCleanup: (() => void) | null = null;
    private _selectedDumpType: DumpTypes = "Hex";
    private _selectedDumpNumber: number = 0;
    private _debugInfo: number[][] = [];
    set DebugInfo(info: number[][]) {
        if (info) {
            this._debugInfo = info;
            this.CreateDumpList();
        }
    }

    private CreateDumpList: () => void;
    private DisplayMemory: (dumpNumber: number) => void;
    
    constructor(
        memoryDumpList: HTMLUListElement, 
        memoryDumpBody: HTMLDivElement, 
        dumpTypes: IHTMLValueElement[]
    ) {
        this.DisplayMemory = (dumpNumber: number) => {
            Empty(memoryDumpBody);
            if (this._debugInfo.length === 0)
                return;
            
            for (let i = 0; i < this._debugInfo[dumpNumber].length; i++) {
                let item = this._debugInfo[dumpNumber][i];
                let formattedItem: string;
                switch (this._selectedDumpType) {
                    case "Decimal":
                        formattedItem = ('0000000000' + item).substring(item.toString().length);
                        break;
                    case "Hex":
                        formattedItem = item.toString(16);
                        formattedItem = ('0000' + formattedItem).substring(formattedItem.length);
                        break;
                    case "ASCII":
                        formattedItem = String.fromCharCode(item);
                        break;
                    default:
                        throw new Error(`Dump type ${ this._selectedDumpType } is not valid.`);
    
                }
                let div = document.createElement('div');
                div.textContent = formattedItem;
                div.classList.add('modal-memory-item');
                memoryDumpBody.appendChild(div);
            }
        };

        this.CreateDumpList = () => {
            if (this._dumpListCleanup !== null)
            {
                this._dumpListCleanup();
                this._dumpListCleanup = null;
            }
            Empty(memoryDumpList);
            Empty(memoryDumpBody);
            if (this._debugInfo.length === 0)
                return;

            for (let i = 0; i < this._debugInfo.length; i++)
            {
                let listItem = document.createElement('li');
                listItem.textContent = `Dump #${i}`;
                listItem.value = i;
                memoryDumpList.appendChild(listItem);
            }
            this._dumpListCleanup = SetupCustomRadio(
                Array.prototype.slice.call(memoryDumpList.children),
                (val: string) => {
                    this._selectedDumpNumber = Number.parseInt(val);
                    this.DisplayMemory(this._selectedDumpNumber);
                }
            );
            (memoryDumpList.firstElementChild as HTMLElement).click();       
        };
        this.Reset();

        SetupCustomRadio(
            dumpTypes,
            (val: string) => {
                this._selectedDumpType = val as DumpTypes;
                this.DisplayMemory(this._selectedDumpNumber);
            }
        );
        dumpTypes[0].click();
    }

    public Reset(): void {
        this.DebugInfo = [];
    }
}

export function InterpreterElementsSetup(
    CodeElement: IHTMLValueElement,
    InputElement: IHTMLValueElement,
    OutputElement: IHTMLValueElement,
    SubmitElement: IHTMLValueElement,
    Options: OptionsViewModel,
    Debug: DebugViewModel
) {
    SubmitElement.addEventListener('click', (e: UIEvent) => {
        Debug.Reset();
        let memory = Options.IsMemorySigned ?
            new SignedMemory(Options.MemorySize, Options.BlockSize)
            : new Memory(Options.MemorySize, Options.BlockSize);
        let interpreter = new BFInterpreter(memory, new OutputStream(Options.EnableAsciiOutput));
        let {Output: output, Debug: debugInfo} = 
            interpreter.Execute(
                CodeElement.value, 
                new InputStream(InputElement.value));
        OutputElement.value = output;
        if (Options.IsDebugEnabled)
            Debug.DebugInfo = debugInfo;
    });
}