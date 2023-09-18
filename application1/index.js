const http = require('http');
const url = require('url');
const fs = require('fs');



// In this method, we will replace the placeholders in the html file 
// with data from the json file
// we used "let" because we will replcae the contenet many times
// we declared a variable not to edit in the original temp, but a copy of it.


const replaceTemplate = (temp, product) => {
    let output = temp.replace('{%PRODUTNAME%}', product.productName);
    output = output.replace('/%PRODUCTNAME%}', product.productName);
    output = output.replace('/%IMAGE%}', product.image);
    output = output.replace('/%DESCRIPTION%}', product.description);
    output = output.replace('/%PRICE%}', product.price);
    output = output.replace('/%QURANTITY%}', product.quantity);
    output = output.replace('/%NUTRIENTS%}', product.nutrients);
    output = output.replace('/%FROM%}', product.from);
    output = output.replace('/%ID%}', product.id);


    if(!product.organic) {
        output = output.replace('/%NOT_ORGANIC%/', 'not-organic');
    }

}


// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

 
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

// in dataObj we have an array of all the objects that are in data.json
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;

    // OVERVIEW page.
    if (pathName  === '/' || pathName === 'overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        // We have to loop over the array of objects from "dataObj"
        // to display them in the "overview" page.

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)); 
        res.end(tempOverview);

    // PRODUCT page.
    } else if (pathName === '/product') {
        res.end('This is the product');

        

    // API.    
    } else if (pathName === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

    
    // Not Found!
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page Not Found :(</h1>');
    }
});




server.listen(8080, '127.0.0.1', () => {
    console.log('Server is running on port 8080 :)');
});
