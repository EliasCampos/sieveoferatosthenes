class SieveAlgorithmController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }

    setDOMParent(parent) {
        for (let item in this.view) 
            this.view[item].setParentNode(parent);
    }

    async runProcedure() {
        /*
        An iteration of main programms' loop.
        */
        // Hides needless elements on the page:
        this.view.explain.changeVisibleMode();
        this.view.repeat.changeVisibleMode();
        // And waits for user number choice and input:
        let maxNatural = await this.extractUserInput();
        // Then makes algorithms' elements visible:
        this.view.input.changeVisibleMode();
        this.view.explain.changeVisibleMode();
        this.view.table.fill(maxNatural);
        this.view.table.setNumberType(1, "one");
        // And iterates numbers from number generator: 
        let algorithm = this.model.supplyNumbers(maxNatural);
        do {
            let {number, type} = algorithm.next().value;
            this.view.table.setNumberType(number, type);
            if (type === "prime") this.view.explain.nextPrime(number);
            this.view.table.markNumber(number);
            let delayTime = SieveAlgorithmController.delayTable[type];
            await delay(delayTime);
            this.view.table.removeMarker();
            
            if (type === "prime") this.view.explain.nextCrossed();
        } while (this.model.isInSearch);
        // Ending part:
        this.view.explain.end();
        for (let {number, type} of algorithm) {
            this.view.table.setNumberType(number, type);
        }
        this.view.repeat.changeVisibleMode();
        await this.reset();
    }

    reset() {
        return this.view.repeat.waitForClick()
            .then(() => {
                this.view.table.clear();
                this.view.input.changeVisibleMode();
                this.view.explain.clearText();
            });
    }

    extractUserInput() {
        return this.view.input.extractNumber();
    }

}

SieveAlgorithmController.delayTable = { // animation frame time in miliseconds
    prime: 1000,
    composite: 500
}