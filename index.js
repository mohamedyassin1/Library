const express = require('express');
const app = express();
const path = require('path');


app.set('view engine', 'ejs'); //using the ejs view engine, so we can do dynamic HTML templating.
app.set('views', path.join(__dirname, '/views')); //Add this so that we can run our app from any directory.

//Home Page
app.get('/', (req, res) => {
    res.render('home'); //don't need to say views/home.ejs, as the default place to look is views.
});
//Listening for requests
app.listen(3000, () => {
    console.log("listening on port 3000");
})
