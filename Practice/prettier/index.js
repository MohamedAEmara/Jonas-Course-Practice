// SERVER
const http = require('http');

// In order to build a server, we first need to 
// 1- Create a server
// 2- Start the server

// the function "createServer()" takes a callback function that will be fired off
// each time a new request hits our server.

http.createServer((req, res) => {
    // the simplest way to send a response of the callback is "res.end()"
    res.end('Hello from server!!!');
});

// To save the result of createServer, we need  to declare a variable.





// asldf
// asldf






const server = http.createServer((req, res) => {
    res.end("I am from server..");
});             


// 2- Start a server... 
server.listen( 8000, "127.0.0.1", () => {
    // a callback function to insure the function called successfully...
    console.log('Listenning to request on port 8000');
});

// Now, when we run '127.0.0.1:8000'    --->  we will get a blank page with "Hello, from server!!!" in it.

