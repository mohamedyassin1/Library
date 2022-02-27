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
const res = require('express/lib/response')
app.use(express.urlencoded({ extended: true })) //to parse HTML form data (aka read HTML form data)
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

//search
app.get('/search', (req, res) => {
    res.render('search', { keyword: req.query.keyword });
});

//api
app.get('/api/books', (req, res) => {
    const where = req.query.keyword ? `name LIKE '%${req.query.keyword}%'` : '1=1';
    connection.query(`SELECT * FROM Books WHERE ${where}`, function (error, results, fields) {
        if (error) {
            console.error(error);
            res.status(400).send();
            return;
        }
        // connected!
        res.json(results);
    });

});
//get method to render the form to add a book
app.get('/addBookForm', (req, res) => {
    res.render('addBookForm');
})
//post method to add books
app.post('/api/books', (req, res) => {
    const { name, status } = req.body;
    let authorId = 0;
    var sql = `INSERT INTO Books (Name, Status, AID) VALUES ('${name}', '${status}', ${authorId})`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.error(error);
            res.status(400).send();
            return;
        }
    })
    res.redirect('/');
})
connection.connect((err) => {
    if (err) {
        console.error('error cannot conenct to db');
        return;
    }

    console.log('connected to db');
});

//Listening for requests
app.listen(3000, () => {
    console.log("listening on port 3000");
});


