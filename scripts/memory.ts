
export enum MemoryBlockSizes {
    Char = 256,
    Int16 = 65536,
    Int32 = 4294967296
}

export interface IReadOnlyMemory {
    get BlockCount(): number;
    get BlockSize(): number;
    GetValueAt(position: number): number | undefined;
    Copy(): Memory;
}

export class Memory implements IReadOnlyMemory {
    protected _memory: number[];
    protected _lowerBound: number;
    protected _upperBound: number;
    public readonly BlockCount: number;
    public readonly BlockSize: number;

    constructor(memorySize: number, blockSize = MemoryBlockSizes.Char) {
        this.BlockCount = memorySize;
        this.BlockSize = blockSize;
        this._lowerBound = 0;
        this._upperBound = blockSize - 1;
        this._memory = [];
        //Initialize memory
        for (let i = 0; i < this.BlockCount; i++)
            this._memory.push(0);
    }

    protected IsValidPosition(position: number): boolean {
        return (position >= 0) && (position < this.BlockCount);
    }

    protected IsValidValue(value: number): boolean {
        return (value >= this._lowerBound) && (value <= this._upperBound);
    }

    public GetValueAt(position: number) {
        return this.IsValidPosition(position) ? this._memory[position] : undefined;
    }

    public SetValueAt(position: number, value: number) {
        if (this.IsValidPosition(position) && this.IsValidValue(value))
            this._memory[position] = value;
    }

    public Increment(position: number): void {
        if (this.IsValidPosition(position))
        {
            //Wrap around if applicable
            if (this._memory[position] === this._upperBound)
                this._memory[position] = this._lowerBound;
            else
                this._memory[position]++;
        }
    }

    public Decrement(position: number): void {
        if (this.IsValidPosition(position))
        {
            //Wrap around if applicable
            if (this._memory[position] === this._lowerBound)
                this._memory[position] = this._upperBound;
            else
                this._memory[position]--;
        }
    }

    public Copy(): Memory {
        let copy = new Memory(this.BlockCount, this.BlockSize);
        for (let i = 0; i < this.BlockCount; i++)
            copy.SetValueAt(i, this._memory[i]);
        return copy;
    }

    public AsArray(): number[] {
        return this._memory.slice(0);
    }
}

export class SignedMemory extends Memory {
    constructor(memorySize: number, blockSize = MemoryBlockSizes.Char) {
        super(memorySize, blockSize);
        this._lowerBound = -Math.floor(this.BlockSize / 2);
        this._upperBound = Math.ceil(this.BlockSize / 2) - 1;
    }
}

export class Pointer {
    private _pointer: number;

    constructor(private readonly _memory: Memory) {
        this._pointer = 0;
    }

    private WrapPosition(position: number): number {
        if (position < 0)
            position += this._memory.BlockCount;
        else if (position >= this._memory.BlockCount)
            position -= this._memory.BlockCount;
        return position;
    }

    public GetPosition(): number {
        return this._pointer;
    }

    public GetValue(): number {
        //Can't return undefined because we constrain the pointer's bounds.
        return this._memory.GetValueAt(this._pointer) as number;
    }

    public MoveLeft(): void {
        this._pointer = this.WrapPosition(this._pointer - 1);
    }

    public MoveRight(): void {
        this._pointer = this.WrapPosition(this._pointer + 1);
    }

    Increment(): void {
        this._memory.Increment(this._pointer);
    }

    Decrement(): void {
        this._memory.Decrement(this._pointer);
    }
}