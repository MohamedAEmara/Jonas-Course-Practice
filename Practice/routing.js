// Routing is implementing different actions for different URLs
// For example:
/*
    localhost:8000/             ===>    directs you to the home page
    localhost:8000/products     ===>    directs you to products page
*/


// To use routing, We first have to declare a new node module "url"
const url = require('url');


const http = require('http');
const server = http.createServer(( req, res) => {
    console.log(req.url);
    const pathName = req.url;
    // if the path name is the root or it's the overview disply overview
    if(pathName === '/' || pathName === '/overview') {
        res.end('This is the OVERVIEW!!!');     
    } else if(pathName === '/product') {
        res.end('This is the product!!!');
    } else {
        // Set headers before sending the response..
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end('<h1>Error 404!!</h1>\n<h1>NOT FOUND</h1>');
    }
});


server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});