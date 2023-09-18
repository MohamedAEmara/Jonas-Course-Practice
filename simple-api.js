// The simple definition of API is :
// a service from which we can request some data

// We will do the same previous way to make routes..
const http = require('http');
const url = require('url');
const fs = require('fs');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const server = http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end('This is the OVERVIEW!');   
    } else if (pathName === '/product') {
        res.end('This is the PRODUCT');
    } else if (pathName === '/api') {
        fs.readFile(__dirname + '/dev-data/data.json', 'utf-8', (err, data) => {
            const productData = JSON.parse(data);
            console.log(productData);

            // Now, we have to tell the browsewr that we are 
            // sending a json file
            // to do so, we specify the 'Content-type' header to 'appliction/json'

            res.writeHead(200, {
                'Content-type': 'application/json'
            });
            
            // Then we return a response with the data
            res.end(data);

            // if we didn't do so, some icons won't appear appropriately
        });


        //////////////// A better way to do the previous code ////////////////////
        /* 
            There is a problem in the above code, which is:
                We have to read the file "/dev-data/data.json" every time we call the /api in url
            
            A better way is to read the file at the top of the .js file (reading synchronously)
            Why readFileSYNC ???
            To block other codes and executes first.
            and every time we call '/api', we just take the value of the variable but no more readings

        */

        // We will put the enhanced version in path /api-once

    } else if (pathName === '/api-once') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });

        res.end(data);  // data here is the global variable.. 
    }
})



server.listen(8080, '127.0.0.5', () => {
    console.log('Listening on port 8080');
})