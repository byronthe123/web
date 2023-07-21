export class Charge {
    constructor (private amount: number = 0, private types: string[] = []) {

    }

    setAmount (amount: number): void {
        this.amount = amount;
    }

    getAmount (): number {
        return this.amount;
    }

    setTypes (types: string[]): void {
        this.types = types;
    }
    
    addType (type: string) {
        this.types.push(type);
    }

    getTypes (): string[] {
        return this.types;
    }

}

// amount: 0,
// types: Array<string>()