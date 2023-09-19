// to use the built-in node events, we need to require the events module.
const EventEmitter = require('events');

// create a new emitter, we have to create an instance of the event emitter
const myEmitter = new EventEmitter();

// Events can listen to the events and react accordingly.

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