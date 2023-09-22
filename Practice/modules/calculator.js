class Calaculator {
    add(a, b) {
        return a + b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        return a / b;
    }
}


module.exports = Calaculator;       // we use "module.exports" when we use one single value..
// We can save it in a varibale using require(Path/this_file);



// -----------------------------------------------------
// Another way to export this class..

module.exports = class {
    add(a, b) {
        return a + b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        return a / b;
    }
}