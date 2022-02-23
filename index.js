const express = require('express');
const app = express();
const path = require('path');

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '34.83.176.15',
    user: 'root',
    password: 'tNe855bucM5wHojL',
    database: 'librarydb'
});

app.use(express.static(path.join(__dirname, '/public')));
//public
//css
//js
//imgs

app.set('view engine', 'ejs'); //using the ejs view engine, so we can do dynamic HTML templating.
app.set('views', path.join(__dirname, '/views')); //Add this so that we can run our app from any directory.

//Home Page
app.get('/', (req, res) => {
    res.render('home'); //don't need to say views/home.ejs, as the default place to look is views.
});

//api
app.get('/api/books', (req, res) => {
    connection.query('SELECT * FROM `Books`', function (error, results, fields) {
        if (error) console.error('bad query!');
        // connected!
        console.log('The result is: ', results.length);
        res.send(results[0]);
    });
    
});

connection.connect((err) => {
    if(err){
        console.error('error cannot conenct to db');
        return;
    }

    console.log('connected to db');
});

//Listening for requests
app.listen(3000, () => {
    console.log("listening on port 3000");
});


