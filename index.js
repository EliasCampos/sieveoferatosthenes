async function run() {
    const PARAMS = {
        minNumber: 2,
        maxNumber: 300,
        tableRelWidth:20,
        parentNodeID: "sieve-wrapper"
    }

    // MODEL:
    const model = new SieveAlgorithmModel();

    // VIEW:
    const input = new NumberInputPanel(PARAMS.minNumber, PARAMS.maxNumber);
    const explain = new ExplainPanel();
    const table = new SieveTable(PARAMS.tableRelWidth);
    const repeat = new RepeatButton();

    const view = {input, explain, table, repeat}
    // CONTROLLER:
    const controller = new SieveAlgorithmController(view, model);

    let parentNode = document.getElementById(PARAMS.parentNodeID);
    controller.setDOMParent(parentNode);

    for (;;) await controller.runProcedure();
}

document.addEventListener('DOMContentLoaded', run);