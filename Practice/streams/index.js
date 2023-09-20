/*
    Streams are used to process (read and write) data piece by piece (chunks)..
    without completing the whole read or write operation, 
    and therefore without keeping all the data in memory

    Examples:
        Netflex && Youtube
    we don't have to wait till the whole video loads to start watching.
*/



/*
    In NodeJs,
    there are 4 types of streams.
        1- Readable Streams
        2- Writable streams
        3- Duplex streams
        4- Transform streams
    
    --------------------------------------
    
    *Readable Streams: are the ones from which we can read data (comsume data).
    = WE can use it in the fs module (readStream) that allow us to read piece by piece.
    = Streams are instances of the "EventEmitter" class.
    -> meaning that all streams can emit and listen to named events.
  e
    = important events in reading streams: data & end

    = important reading stream functions are pipe() & read()
    = pipe() allows us to plug streams together, passing data from one stream to another.

    -------------------------------------

    *Writable Streams: are the ones that we can write data 
    = For example: the http response that we can send back to the client 

    = important events in writable streams: drain & finish

    = important functions about writable streams are: write() & end()

    --------------------------------------

    * Duplex Streams: are both readable and writable at the same time
    = A great example:  
        -> the web socket from the net module
    ===> A web socket is basically a communication channel between client and server
         that works in both directions and stays open once the connection has been established.
*/


// Another way to create a server....
const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
    // Solution 1
    // fs.readFile('./test-file.txt', (err, data) => {
    //     if(err) {
    //         console.log('Cannot find the file to read 😔');    
    //     } 
    //     res.end(data);
    // });
    // The problem with this solution is that because of the huge file 
    // The result page will be OutOfMemory..


// -----------------------------------------------------------------------------

    // Solution 2
    // The idea here is we don't need to read this data from the file into a variable.
    // We just will create a "Readable Stream"
    // As we recieve each chunk of data, We send it to the client as a response. which is a Writable Stream..
/*
    const readable = fs.createReadStream('test-file.txt');
    // And each time there is a new piece of data that we can consume,
    // the readable stream emits the data event.
    readable.on('data', (chunk) => {
        // What we actually do with that chunk is to write it to a Writable Stream which is the response..
        res.write(chunk);
    });
    
    readable.on('end', () => {
        console.log('Stream is Done ✅');
        res.end();      // without this, the response will never be sent to the client.
    });


    // We can also listen for errors !!!
    readable.on('error', (err) => {
        console.log(err);
        // res.end('File Not Found !!!');
        console.log('File Not Found !!!');
    });
*/
    // BackPressure
    // The problem with the previous solution is the Readable Stream is much faster than 
    // the Writable Stream. This will overwhelm the response, which cannot handle all this incoming data so fast.

    

// -------------------------------------------------------------------------------

    // Solution 3
    // The idea here is that we will use the pipe operator

    const readable = fs.createReadStream('test-file.txt');
    const writable = fs.createWriteStream('output.txt');
    readable.pipe(writable);

    writable.on('finish', () => {
        console.log('Writing Stream has finished :)');
    });
    
    readable.pipe(res);

    // readableSource.pipe(writableDes)
    // this solves the problem "BackPressure" resulted from different speeds.




});


// Start the server:
server.listen(8080, '127.0.0.1', () => {
    console.log('Listening....');
});

