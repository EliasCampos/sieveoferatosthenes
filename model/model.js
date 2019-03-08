class NaturalNumberModel {
    /* 
    Represents natural numbers which take part 
    in algorithms' work and can be somehow used
    during the process.
    */
    constructor(number) {
        if (number < 1) throw new Error("Type Error: natural should be more than zero");
        this.number = number;
        this._type = number === 1 ? "one" : "unknown"; // unknown | one | prime | composite
        this.isMarked = false;
    }
    get type() {
        return this._type;
    }
    set type(newType) {
        this._type = newType;
        this.isMarked = true;
    }
}

class SieveAlgorithmModel {
    constructor() {
        this.numbers = [];
        this.isInSearch = false; 
    }

    * supplyNumbers(numberLimit) {
        /*
        The method will generate number objects, touched in calculation process,
        managing it's belonging and providing resource for a view part 
        */
        for (let i = 1; i <= numberLimit; i++) {
            this.numbers.push(new NaturalNumberModel(i))
        }

        this.isInSearch = true;
        let currentNumber;
        let i;

        for (i = 2; (i * i) <= numberLimit; i++) {
            currentNumber = this.numbers[i - 1];
            if (currentNumber.isMarked) continue;
            currentNumber.type = "prime";

            yield currentNumber;

            for (let j = 2 * i; j <= numberLimit; j += i) {
                currentNumber = this.numbers[j - 1];
                if (currentNumber.isMarked) continue;
                currentNumber.type = "composite";

                yield currentNumber;
            }
        }

        this.isInSearch = false;

        for (let k = i; k <= numberLimit; k++) {
            currentNumber = this.numbers[k - 1];
            if (currentNumber.isMarked) continue;
            currentNumber.type = "prime";

            yield currentNumber;
        }

        this.numbers = [];
    }
}