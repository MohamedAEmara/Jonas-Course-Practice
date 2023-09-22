console.log('Hello from the module!!');

module.exports = () => console.log('Log this TEXT :)');

// If I require this function more than once. the first Console.log() will be printed just once because of cashing
// but every time we call this module the second Console.log() will be executed.
// As the module is only loaded once, and the code inside will also executed once
// Every time we call "require", won't lead the module again, as it's sotred in Node's cash
