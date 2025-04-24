const operatorSide = document.querySelector("#operatorSide");
const selectedOperator = document.querySelector("#selectedOperator");
const values = document.querySelector("#values");
const operandSide = document.querySelector("#operandSide");
let value = values.textContent;
let isDot = false;
let isOperatorSelected = false;
let isValueTaken = false;
let isEvaluated = false;
let firstOperand = "";
let operator = "";

operatorSide.addEventListener("click", (e) => {
    if (value === "IDK") {
        document.querySelector("#AC").click();
        return;
    }
    if (e.target.id == "")
        return;
    if (isOperatorSelected && isValueTaken) {
        value = evaluate();
        isEvaluated = true;
        display();
    }
    isOperatorSelected = true;
    isValueTaken = false;
    let op = e.target.id[1];
    let ops = selectedOperator.children;
    for (let key in ops) {
        let id = ops[key].id;
        if (id != null) {
            const temp = document.querySelector("#o\\"+id[1]);
            if (id[1] === op)
                addRemoveStyle(temp, true);
            else
                addRemoveStyle(temp, false);
        }
    }
    if (isOperatorSelected && !isValueTaken) {
        operator = op;
        firstOperand = value;
    }
});

function addRemoveStyle(elem, change) {
    if (change)
        elem.setAttribute("style", "color: black;");
    else
        elem.setAttribute("style", "");
}

operandSide.addEventListener("click", (e) => {
    let id = e.target.id;
    if (value === "IDK")
        id = "AC";
    if (id == "AC") {
        isOperatorSelected = false;
        isValueTaken = false;
        isDot = false;
        let ops = selectedOperator.children;
        for (let key in ops) {
            if (ops[key].id != null)
                addRemoveStyle(ops[key], false);
        }
        value = 0;
    }
    else if (id == "del") {
        if (isFinite(value))
            value = ((value<10)?0:value.slice(0,-1));

    }
    else if (id == "dot") {
        value += ((!isDot)?".":"");
        isDot = true;
        isValueTaken = true;
    }
    else if (id == "k=") {
        value = evaluate();
        isEvaluated = true;
        isOperatorSelected = false;
        isValueTaken = false;
        let ops = selectedOperator.children;
        for (let key in ops) {
            if (ops[key].id != null)
                addRemoveStyle(ops[key], false);
        }
    }
    else{
        if (id == "")
            return;
        value = ((value==="0" || !isValueTaken)?"":value);
        if (value.length==6) {
            alert("Only 6 digits can be taken.");
            return;
        }
        value += id[1];
        isValueTaken = true;
    }
    display();
});

function evaluate() {
    if (!isOperatorSelected || (isOperatorSelected && !isValueTaken))
        return value;
    else {
        firstOperand = (((firstOperand+"").includes("e"))?expConversion(firstOperand, true):firstOperand);
        switch (operator) {
            case "*" : value = firstOperand * value;
                        break;
            case "/" : value = ((value == 0)?"IDK": firstOperand / value);
                        break;
            case "-" : value = firstOperand - value;
                        break;
            default : value = +firstOperand + +value;
        }
        value = Math.round(value * 10000) / 10000;
        return (((value+"").length > 6)?expConversion(value, false):value);
    }
}

function expConversion(val, reverse) {
    if (reverse) {
        let arr = val.split("e");
        return arr[0] * (10**arr[1]);
    }
    else {
        let arr = (val+"").split(".");
        return (+arr[0] / (10**(arr[0].length-1))).toFixed(1)+"e"+(arr[0].length-1);
    }
}

function display() { 
    if (isEvaluated && value !== "IDK" && !(value+"").includes("e")) {
        let arr = (value+"").split(".");
        values.textContent = (+value).toFixed((arr[1] > 0)?Math.min(6-(arr[0].length+1), arr[1].length):0);
        isEvaluated = false;
    }
    else {
        values.textContent = value;
    }
}