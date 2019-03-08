class SieveAlgorithmView {
    /* 
    This class shouldn't have an instances,
    it serves for providing an methods, common 
    for each view-oriented class below.
    */
    constructor() {
        this.isHidden = false;
    }

    setParentNode(parentElement) {
        parentElement.appendChild(this._dom);
        this._displayMode = this._dom.style.display; // ???
    }

    changeVisibleMode() {
        this.isHidden = !this.isHidden;
        this._dom.style.display = this.isHidden ? "none" : this._displayMode;
    }

    _createDOMNode() {
        /*
        This method should be implemented
        in each class, inherited from current
        */
    }
}

class NumberInputPanel extends SieveAlgorithmView {
    constructor(minimun, maximum, defaultValue = 50) {
        super();

        this.minimun = minimun;
        this.maximum = maximum;
        this.default = defaultValue;

        this._dom = this._createDOMNode();
    }

    extractNumber() {
        return new Promise((resolve, reject) => {
            this._dom.addEventListener('submit', event => {
                try {
                    event.preventDefault();
                    let form = event.target;
                    let number = +form.elements.number.value;
                    resolve(number);
                } catch (error) {
                    reject(error)
                }
            }, {once:true});
        });
    }

    _createDOMNode() {
        let rangeInput = elt('input', null);
        let inputAttributes = {
            type: 'range',
            name: "number",
            value: this.default,
            min: this.minimun,
            max: this.maximum
        }
        for (let attr in inputAttributes) rangeInput.setAttribute(attr, inputAttributes[attr]);

        let numberDisplay = elt('div', {className:"init-num-display"}, ""+this.default);

        rangeInput.addEventListener('change', event => {
            numberDisplay.textContent = event.target.value;
        });

        let submitButton = elt('input',);
        submitButton.setAttribute('type', 'submit');
        submitButton.setAttribute('value', 'Run');

        let dom = elt('form', {className:"number-input-panel"},
            elt('h3', null, "Please, choose number of naturals:"),
            numberDisplay,
            rangeInput,
            submitButton
        );

        return dom;
    }
}

class SieveTable extends SieveAlgorithmView {
    constructor(rowLimit = 10) {
        super();

        this.rowSize = rowLimit;
        this.numberNodes = [];

        this._dom = this._createDOMNode();
    }

    fill(maxNatural) {
        for (let i = 0; i < maxNatural ; i += this.rowSize) {
            let row = elt('tr', null);
            for(let j = 1, num = i + j; j <= this.rowSize && num <= maxNatural; j++) {
                num = i + j; 
                if (num > maxNatural) break;
                
                let cell = elt('td', {className: "unknown"}, ""+num);
                this.numberNodes.push(cell);
                row.appendChild(cell);
            }
            this._dom.appendChild(row);
        }
    }
    clear() {
        this.numberNodes = [];

        let child;
        while(!!(child = this._dom.lastChild)) {
            this._dom.removeChild(child);
        }
    }

    markNumber(number) {
        this._marked = this.numberNodes[number - 1];
        this._marked.setAttribute('id', "marked-number");
    }
    removeMarker() {
        this._marked.removeAttribute('id');
        this._marked = null;
    }
    setNumberType(number, type) {
        if (number > this.numberNodes.length) {
            throw new Error("Value Error: Inputted number more than maximum natural.");
        }
        this.numberNodes[number - 1].className = type;
    }

    _createDOMNode() { return elt('table', {className: "sieve-table"}) ; }
}

class ExplainPanel extends SieveAlgorithmView {
    constructor() {
        super();

        this.prevNumber = null;
        this.currentNumber = null;

        this._dom = this._createDOMNode();
    }

    nextPrime(prime) {
        /* 
        Replace current prime number in the first explanation field.
        */
        let text;

        if (!this.currentNumber) { // when algorithm just have started 
            text = `
            The first number is ${prime}.
            `;
        }
        else {
            this.prevNumber = this.currentNumber;
            text = `
            The next number after ${this.prevNumber} is ${prime}.
            `;
        }    
        this.currentNumber = prime;

        this._dom.firstChild.textContent = text; // When it just came a new prime
        this._dom.lastChild.textContent = "";  // second field will be empty 
    }
    nextCrossed() { 
        let text = `
        Cross out every ${this.currentNumber}-th number in the table 
        by counting up from ${this.currentNumber} in incremets of ${this.currentNumber}.
        `;
        
        // Adding an additional explanation when already there are crossed numbers:
        if (!!(this.prevNumber)) text += "(Ignoring numbers which are already crossed out)";
        this._dom.lastChild.textContent = text;
    }

    end() {
        this.prevNumber = null;
        let text = `
        The square of the number ${this.currentNumber}
        is more than max given natural in the table. All uncrossed numbers left in the table are primes.
        `;
        this.currentNumber = null;

        this._dom.firstChild.textContent = text;
        this._dom.lastChild.textContent = "";
    }
    clearText() {
        this._dom.firstChild.textContent = "";
        this._dom.lastChild.textContent = "";
    }

    _createDOMNode() {
        return elt('div', {className: "explain-panel"},
            elt('span', null),
            elt('span', null)) ;
    }
}

class RepeatButton extends SieveAlgorithmView {
    constructor() {
        super();

        this._dom = this._createDOMNode();
    }

    waitForClick() {
        return new Promise((resolve, reject) => {
            this._dom.addEventListener('click', resolve, {once:true});
        });
    }

    _createDOMNode() {
        return elt('button', {className:"repeat-button"}, "Again");
    }
}