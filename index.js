const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const connection = mysql.createConnection({
    host: '34.83.176.15',
    user: 'root',
    password: 'tNe855bucM5wHojL',
    database: 'librarydb'
});
const res = require('express/lib/response');
const { request } = require('http');
app.use(express.urlencoded({ extended: true })) //to parse HTML form data (aka read HTML form data)
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//public
//css
//js
//imgs

app.set('view engine', 'ejs'); //using the ejs view engine, so we can do dynamic HTML templating.
app.set('views', path.join(__dirname, '/views')); //Add this so that we can run our app from any directory.

//Home Page
app.get('/', (req, res) => {
    connection.query("SELECT * FROM Books", function (err, books, fields) {
        if (err) throw err;
        res.render('home', { books })
    });
});

//search
app.get('/search', (req, res) => {
    res.render('search', { keyword: req.query.keyword });
});

//Book Detail page
app.get('/bookDetail', (req, res) => {
    const where = `ID = '${req.query.ID}'`;
    connection.query(`SELECT * FROM Books WHERE ${where}`, function (err, results, fields) {
        if (err) throw err;
        console.log('asdas' + results[0].Name)
        res.render('bookDetail', { book: results });
    });
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

//api
app.post('/api/AddRatingForABook', (req, res) => {

    const { userid, ratingstar, bookid } = req.body;
    connection.query(`INSERT INTO librarydb.Rating (UserID, RatingStar, BookID) VALUES (?,?,?)`
        , [
            userid,
            ratingstar,
            bookid
        ], function (error, results, fields) {
            if (error) {
                console.error(error);
                res.status(400).send();
                return;
            }
        })
    console.log(userid + ratingstar + bookid);
    res.redirect('/api/getBookDetail');
});

app.get('/api/getBookDetail', (req, res) => {
    const where = req.query.name ? `name LIKE '%${req.query.name}%'` : '1=1';
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
//get method to render the form to login
app.get('/login', (req, res) => {
    res.render('loginForm');
})
//post method to login
app.post('/api/login', (req, res) => {
    const { email, username, password } = req.body;
    // connection.query(`SELECT email,username,password FROM Registered`
    // ,function (error, result, fields) {
    //     if (error) {
    //         console.error(error);
    //         res.status(400).send();
    //         return;
    //     }else{
    //         var obj = result;

    //         for(var i=0;i<obj.length;i++){
    //             if(obj[i].email==email && obj[i].username==username && obj[i].password==password){
    //                 res.redirect('/personal');
    //             }
    //         }
    //         res.redirect('/login');
    //     }
    // })

    //Below for testing. Uncommet above to actually use DB
    var obj = [
        { "email": "john@gmail.com", "username": "John", "password": "12345" },
        { "email": "kelly@gmail.com", "username": "Kelly", "password": "54321" }
    ];

    let found = false;
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].email == email && obj[i].username == username && obj[i].password == password) {
            req.session.loggedIn = true;
            req.session.username = email;
            found = true;
            break;
            //res.redirect('/personal');
            //console.log('/personal');
        }
    }
    if (found) {
        res.redirect('/personal');
    } else {
        res.redirect('/login');
    }
})
//get method personal
app.get('/personal', (req, res) => {
    if (req.session.loggedIn) {
        res.render('personal', { 'email': req.session.username });
    } else {
        res.render('home');
    }
})
//get method to render the form to signup
app.get('/signUp', (req, res) => {
    res.render('signup');
})

//post method to add books
app.post('/api/signUp', (req, res) => {
    const { email, username, password } = req.body;
    connection.query(`INSERT INTO Registered (email, username, password) VALUES (?,?,?)`
        , [
            email,
            username,
            password
        ], function (error, results, fields) {
            if (error) {
                console.error(error);
                res.status(400).send();
                return;
            }
        })
    console.log(username + password + email);
    res.redirect('/personal');
})

//get method to render the form to signup
app.get('/logout', (req, res) => {
    req.session.loggedIn = false;
    req.session.username = "";
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


