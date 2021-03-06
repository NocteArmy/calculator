(function() {
    // Grab the third argument from the command line
    let input = process.argv[2];
    // List of available functions
    let availableFuncs = ['add', 'subtract', 'multiply', 'divide'];
    // If input is just an integer value, return a stdout of the integer
    if(!isNaN(+input)) {
        return console.log(+input);
    }

    // If input contains a function, send the input to the splitArguments function and then calculate the result
    let argsArr = splitArguments(input);
    let result = availableFuncs.includes(argsArr[0]) ? calculate(...argsArr) : new Error('Opps, wrong function call!');

    // Return the result of the function calls to stdout
    return console.log(result);
})();

function splitArguments(str) {
    // This function takes a string input and splits it into three separate arguments
    // Split input str into an array and eliminate the start and end parentheses
    let inputArr = str.split("").slice(1, str.length - 1);
    // Find the function call
    let func = inputArr.slice(0, inputArr.indexOf(" ")).join("");
    // Split the two expressions away from the original array
    let expArr = inputArr.slice(inputArr.indexOf(" ") + 1);
    let x = '';
    let y = '';
    if(expArr[0] !== "(") {
        // If x starts as a number, save it and pass the remainder to y
        x = expArr.slice(0, expArr.indexOf(" ")).join("");
        y = expArr.slice(expArr.indexOf(" ") + 1).join("");
    } else {
        // If x starts as a new function call, find the end of the function call and pass the remainder to y
        let count = 0;
        expArr.every((val, i, arr) => {
            if(val === "(") { count++; }
            if(val === ")") { count--; }
            if(count === 0) {
                x = arr.slice(0, i + 1).join("");
                y = arr.slice(i + 2).join("");
            }
            return count !== 0;
        })
    }
    // Return the func call and two expressions as an array
    return [func, x, y];
}

function calculate(func, exp1, exp2) {
    let availableFuncs = ['add', 'subtract', 'multiply', 'divide'];
    let x, y;
    /* If either exp1 or exp2 are not integers and contain parentheses to indicate another function, 
    run the splitArguments function again recursively until finding the pair of two integers */
    if(isNaN(+exp1) && exp1.includes('(')) {
        let argsArr = splitArguments(exp1);
        x = availableFuncs.includes(argsArr[0]) ? calculate(...argsArr) : new Error('Opps, wrong function call!');
        if(x instanceof Error) { return x; }
    } else {
        x = +exp1;
    }
    if(isNaN(+exp2) && exp2.includes('(')) {
        let argsArr = splitArguments(exp2);
        y = availableFuncs.includes(argsArr[0]) ? calculate(...argsArr) : new Error('Opps, wrong function call!');
        if(y instanceof Error) { return y; }
    } else {
        y = +exp2;
    }
    // Check for incorrect expressions and return an Error if so
    if(isNaN(x) || isNaN(y)) { return new Error('Incorrect Expressions: ' + exp1 + ' ' + exp2); }
    // If the evaluation is a division, check for a zero in the denominator and return an Error if so
    if(func === 'divide' && y === 0) { return new Error('Cannot divide by zero!'); }
    // Calculate the result and return it to main
    return func === 'add' ? x + y : func === 'subtract' ? x - y : func === 'multiply' ? x * y : x / y;
}