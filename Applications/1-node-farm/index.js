const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require(`${__dirname}/modules/replaceTemplate`);


// In this method, we will replace the placeholders in the html file 
// with data from the json file
// we used "let" because we will replcae the contenet many times
// we declared a variable not to edit in the original temp, but a copy of it.




// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

 
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

// in dataObj we have an array of all the objects that are in data.json
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;
    // console.log(req.url);
    // console.log(url.parse(req.url, true));
    // console.log(url.parse());

    const { query, pathname } = url.parse(req.url, true);
    console.log('path name = ' + pathname);     // pathname = "/product" for example
    console.log(query);
    // OVERVIEW page.
    if (pathname  === '/' || pathname === 'overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        // We have to loop over the array of objects from "dataObj"
        // to display them in the "overview" page.
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)); 
        
        // console.log(cardsHtml);     // we have some stuff replaced successfully in the terminal

        const output = tempOverview.replace('%PRODUCT_CARDS%', cardsHtml);
        res.end(output);

    // PRODUCT page.
    } else if (pathname === '/product') {
        console.log(query);
        // res.end('This is the product');
        // First, we have to determine which one is the product we wanna display
        const product = dataObj[query['id']];
        // console.log(dataObj[query['id']]);
        // console.log('----------------------');
        output = replaceTemplate(tempProduct, product);
        res.end(output);
    // API.    
    } else if (pathname === '/api') {
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
