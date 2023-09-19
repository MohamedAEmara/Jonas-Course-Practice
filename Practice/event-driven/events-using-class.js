const EventEmitter = require("events");

class Sales extends EventEmitter {
    constructor() {
        super();
    }
}

const myEmitter = new Sales();


// The observer...
myEmitter.on('newSale', () => {
    console.log('There is a new sale!');
});

// We can setup multiple listeners for the same event..

// Another observer
myEmitter.on('newSale', () => {
    console.log('Customer name: Mohammad');
});


// The Emitter...
// myEmitter.emit('Any-Event-Name');
myEmitter.emit('newSale');


// We also can pass parameters to the EventListener, by passing them additional parameters to the emitter.

myEmitter.on('newSale', (stock) => {
    console.log('There are now ' + stock + ' items left in the stock.');
});

myEmitter.emit('newSale', 3);       // Note that the listners that take no parameters will also be called.
myEmitter.emit('newSale', 12);      