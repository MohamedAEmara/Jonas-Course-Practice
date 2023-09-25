const express = require('express');

const app = express();      // when calling the function express(), it adds a bunch of variables to app variable.

// To start a server we will use "app.listen()" to listen to a port

// so, let's create a port variable
const port = 8080;


app.listen(port, () => {
    console.log(`App listening on port ${port}....`);
}); 

// What we need after is to define a "route"
// routing means to determine how the application responds to a certain client request.


// Whatever we want to do when someone request the root url, we need to call a callback function.
// specified as a second argument.
app.get('/', (req, res) => {
    // res.send('Hello from the server side ❤️');

    // We can also specify the status code of the response, for example 200 for OK
    res.status(200).send('Hello from the server side 😊');

})

// We can also send JSON files in app.get() method
// res.json()     instead of      res.send()
// and pass the json object in it.
// ans when using res.json(), ====>  it automatically sets the 'content-type' to 'application json'
app.get('/json', (req, res) => {
    res.status(200).json({message: 'again from the server side ✅', app: 'Testtt'});
})
// This will give you a Json formatted object in the url specified..



// ---------------------------------------------------------------------------------
// =================================================================================
// ---------------------------------------------------------------------------------

// Now let's try to post using app.post() method..

app.post('/', (req, res) => {
    console.log('POST ✅✅✅');
    res.send('You can post to this URL 😊');
})