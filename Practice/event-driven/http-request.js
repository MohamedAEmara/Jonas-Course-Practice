const http = require('http');

const server = http.createServer();


server.on('request', (req, res) => {
    console.log('Requested recieved !!');
    res.end('Request recieved !!!');

    console.log(req.url);
});


server.on('request', (req, res) => {
    // NOTE: we can't send more than one response...
            // res.end('Another Request ❤️');
    // but instead, we can send as many console.log() as we want..
    console.log('Another Request ❤️')
});


server.on('close', (req, res) => {
    console.log('Server closed ');
}) 


// Start the server by using "server.listen()"..

server.listen(8080, '127.0.0.1', () => {
    console.log('Waiting for requests....');
})

// Note that the console.log() in the server.on() will be printed twice !!!
// That means that the request is called twice 
// when we print the req.url ==> we will see the url of the both
//      one for /  "the root"
//      and the other is for "/favicon"