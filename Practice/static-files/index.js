const express = require('express');
const app = express();


// Note we cannot access files from the working directory in the URL follwing the url with
// /dev-data/data/users.json    for example
// This cannot be done in the browser..
// This can be done just using (routes)

// Another way is using "express.static()"
// Files from your local directory are called "Static Files"
// To access Static Files, we have to use built-in middleware "express.static()"
// and in static() function we pass the directory where we want to server static files...
app.use(express.static(`${__dirname}`));

// Now we can access all files related to the root "./" using '/'
// GREATTTTT..





app.listen(8080, () => {
    console.log('App listenning on port 8080....');
})