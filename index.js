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


//Home Page
app.get('/reserve/', (req, res) => {
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
//get method to render the form to login
app.get('/login', (req, res) => {
    res.render('loginForm');
})

//post method to login
app.post('/api/login', (req, res) => {
    const { email,username, password } = req.body;
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
        {"email":"john@gmail.com","username":"John","password":"12345"},
        {"email":"kelly@gmail.com","username":"Kelly","password":"54321"}
            ];

    for(var i=0;i<obj.length;i++){
        if(obj[i].email==email && obj[i].username==username && obj[i].password==password){
            res.redirect('/personal');
            //console.log('/personal');
        }
    }
    res.redirect('/login');
})
//get method personal
app.get('/personal',(req,res)=>{
    res.render('personal');

})
//get method to render the form to signup
app.get('/signUp', (req, res) => {
    res.render('signup');
})

//confirm book reservation page
app.get('/confirmReservation', (req, res) => {
    //const where = `ID = '${req.query.ID}'`; //need to be updated when it's connected to the API
    const book = {
        book_name: 'Harry Potter',
        author: 'JK',
        rating: 4.5,
        status: 'Available'
    }
    res.render('confirmReservation', {book: book});
})

//post method to add books
app.post('/api/signUp', (req, res) => {
    const { email,username, password } = req.body;
    connection.query(`INSERT INTO Registered (email, username, password) VALUES (?,?,?)`
    ,[
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
    console.log(username+password+email);
    res.redirect('/personal');
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


