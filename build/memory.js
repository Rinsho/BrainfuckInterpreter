export var MemoryBlockSizes;
(function (MemoryBlockSizes) {
    MemoryBlockSizes[MemoryBlockSizes["Char"] = 256] = "Char";
    MemoryBlockSizes[MemoryBlockSizes["Int16"] = 65536] = "Int16";
    MemoryBlockSizes[MemoryBlockSizes["Int32"] = 4294967296] = "Int32";
})(MemoryBlockSizes || (MemoryBlockSizes = {}));
export class Memory {
    constructor(memorySize, blockSize = MemoryBlockSizes.Char) {
        this.BlockCount = memorySize;
        this.BlockSize = blockSize;
        this._lowerBound = 0;
        this._upperBound = blockSize - 1;
        this._memory = [];
        //Initialize memory
        for (let i = 0; i < this.BlockCount; i++)
            this._memory.push(0);
    }
    IsValidPosition(position) {
        return (position >= 0) && (position < this.BlockCount);
    }
    IsValidValue(value) {
        return (value >= this._lowerBound) && (value <= this._upperBound);
    }
    GetValueAt(position) {
        return this.IsValidPosition(position) ? this._memory[position] : undefined;
    }
    SetValueAt(position, value) {
        if (this.IsValidPosition(position) && this.IsValidValue(value))
            this._memory[position] = value;
    }
    Increment(position) {
        if (this.IsValidPosition(position)) {
            //Wrap around if applicable
            if (this._memory[position] === this._upperBound)
                this._memory[position] = this._lowerBound;
            else
                this._memory[position]++;
        }
    }
    Decrement(position) {
        if (this.IsValidPosition(position)) {
            //Wrap around if applicable
            if (this._memory[position] === this._lowerBound)
                this._memory[position] = this._upperBound;
            else
                this._memory[position]--;
        }
    }
    Copy() {
        let copy = new Memory(this.BlockCount, this.BlockSize);
        for (let i = 0; i < this.BlockCount; i++)
            copy.SetValueAt(i, this._memory[i]);
        return copy;
    }
    AsArray() {
        return this._memory.slice(0);
    }
}
export class SignedMemory extends Memory {
    constructor(memorySize, blockSize = MemoryBlockSizes.Char) {
        super(memorySize, blockSize);
        this._lowerBound = -Math.floor(this.BlockSize / 2);
        this._upperBound = Math.ceil(this.BlockSize / 2) - 1;
    }
}
export class Pointer {
    constructor(_memory) {
        this._memory = _memory;
        this._pointer = 0;
    }
    WrapPosition(position) {
        if (position < 0)
            position += this._memory.BlockCount;
        else if (position >= this._memory.BlockCount)
            position -= this._memory.BlockCount;
        return position;
    }
    GetPosition() {
        return this._pointer;
    }
    GetValue() {
        //Can't return undefined because we constrain the pointer's bounds.
        return this._memory.GetValueAt(this._pointer);
    }
    MoveLeft() {
        this._pointer = this.WrapPosition(this._pointer - 1);
    }
    MoveRight() {
        this._pointer = this.WrapPosition(this._pointer + 1);
    }
    Increment() {
        this._memory.Increment(this._pointer);
    }
    Decrement() {
        this._memory.Decrement(this._pointer);
    }
}
