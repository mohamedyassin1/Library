const express = require('express');
const app = express();
const methodOverride = require('method-override')
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

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true })) //to parse HTML form data (aka read HTML form data)
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(session({
    // secret: 'secret',
    // resave: true,
    // saveUninitialized: true
    secret: 'secretforseng401librarywebapplication',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },//60 minutes
    rolling: true
}));

//public
//css
//js
//imgs

app.set('view engine', 'ejs'); //using the ejs view engine, so we can do dynamic HTML templating.
app.set('views', path.join(__dirname, '/views')); //Add this so that we can run our app from any directory.

app.use((req, res, next) => {
    //console.log('Middleware auth called');
    if (req.session.loggedIn) res.locals.logged = true;
    else res.locals.logged = false;
    next();
})

//Home Page
app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/personal');
        return;
    }
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
app.get('/api/bookDetail', (req, res) => {
    const where = `ID = '${req.query.ID}'`;
    if (!req.session.loggedIn) {
        connection.query(`SELECT * FROM Books WHERE ${where}`, function (err, results, fields) {
            if (err) throw err;
            connection.query(`SELECT * FROM Comment WHERE BID=?`, [req.query.ID], function (err, commentsResult, fields) {
                if (err) throw err;
                res.render('bookDetail', { book: results, comments: commentsResult });
            })
        });
    }
    else {
        connection.query(`SELECT * FROM Books WHERE ${where}`, function (err, results, fields) {
            if (err) throw err;
            connection.query(`SELECT * FROM Comment WHERE BID=?`, [req.query.ID], function (err, commentsResult, fields) {
                if (err) throw err;
                res.render('bookDetailsMember', { book: results, comments: commentsResult, r_email: req.session.email });
            });
        });
    }
});
//Book Detail Member page
// app.get('/api/bookDetailMember', (req, res) => {
//     const where = `ID = '${req.query.ID}'`;
//     connection.query(`SELECT * FROM Books WHERE ${where}`, function (err, results, fields) {
//         if (err) throw err;
//         connection.query(`SELECT * FROM Comment WHERE BID=?`,[req.query.ID], function (err, commentsResult, fields) {
//             if (err) throw err;
//         res.render('bookDetailsMember', { book: results, comments: commentsResult,r_email:req.session.email });
//      });
//     });
// });

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

app.get('/api/books/:bookID', (req, res) => {
    const where = `ID = '${req.params.bookID}'`;
    connection.query(`SELECT * FROM Books WHERE ${where}`, function (error, results, fields) {
        if (error) {
            console.error(error);
            res.status(400).send();
            return;
        }
        var book = results[0];
        //get authors
        const where = `bookID = '${req.params.bookID}'`;
        connection.query(`SELECT Fname, Lname FROM AuthorOf JOIN Authors ON AuthorOf.authorID = Authors.AID WHERE ${where}`, function (error, results, fields) {
            if (error) {
                console.error(error);
                res.status(400).send();
                return;
            }
            book.authors = results;
            console.log(book.authors);
            res.json(book);
        });
        //res.json(results);
    });
});

//Not sure what this is
// app.get('/api/getBookDetail', (req, res) => {
//     const where = req.query.name ? `name LIKE '%${req.query.name}%'` : '1=1';
//     connection.query(`SELECT * FROM Books WHERE ${where}`, function (error, results, fields) {
//         if (error) {
//             console.error(error);
//             res.status(400).send();
//             return;
//         }
//         // connected!
//         res.json(results);
//     });
// });


//api
app.post('/api/AddRatingForABook', (req, res) => {

    const { email, bookrate, bid } = req.body;
    connection.query(`INSERT INTO librarydb.Rating (username, RatingStar, BookID) VALUES (?,?,?) ON DUPLICATE KEY UPDATE RatingStar=?`
        , [
            email,
            bookrate,
            bid,
            bookrate
        ], function (error, results, fields) {
            if (error) {
                console.error(error);
                res.status(400).send();
                return;
            }
        })

    connection.query(`SELECT * FROM Rating WHERE BookID=?`,
        [
            bid
        ], function (error, results, fields) {
            if (error) {
                console.error(error);
                res.status(400).send();
                return;
            } else {
                var count = 0;
                var obj = results;
                for (var i = 0; i < obj.length; i++) {
                    count += obj[i].RatingStar;
                }

                var avg = count / obj.length;
                console.log(avg);

                connection.query(`UPDATE Books SET AverageRating = ?,TotalRatingsCount=? WHERE ID=?`,
                    [
                        avg,
                        obj.length,
                        bid
                    ], function (error, results, fields) {
                        if (error) {
                            console.error(error);
                            res.status(400).send();
                            return;
                        }
                    })
            }
        })
    //console.log(email + bookrate + bid);
    res.redirect('/personal');
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

//post method to submit comment
app.post('/api/submitComment', (req, res) => {
    const { comments, bid, email } = req.body;
    var sql = `INSERT INTO Comment (BID, Comment, R_email) VALUES ('${bid}', '${comments}', '${email}')`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.error(error);
            res.status(400).send();
            return;
        }
    })
    //console.log(email+bid+comments);
    res.redirect('/personal');
})

//add borrowing table to db
app.post('/api/borrowing', (req, res) => {
    const { BID, R_email } = req.body;
    //console.log(req.body);
    if (!BID || !R_email) {
        res.status(400).send("must have BID and R_email");
        return;
    }
    var sql = `INSERT INTO Borrowing (BID, R_email) VALUES ('${BID}', '${R_email}')`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.error(error);
            res.status(400).send();
            return;
        }
        res.json(results);
    });

});

//get method to render the form to login
app.get('/login', (req, res) => {
    res.render('loginForm');
})

//post method to login
app.post('/api/login', (req, res) => {
    const { email, username, password } = req.body;
    connection.query(`SELECT email,username,password FROM Registered`
        , function (error, result, fields) {
            if (error) {
                console.error(error);
                res.status(400).send();
                return;
            } else {
                var obj = result;
                let found = false;
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].email == email && obj[i].username == username && obj[i].password == password) {
                        //res.redirect('/personal');
                        req.session.loggedIn = true;
                        req.session.email = email;
                        req.session.username = username;
                        found = true;
                        break;
                    }
                }
                if (found) {
                    res.redirect('/personal');
                } else {
                    connection.query(`SELECT email,username,password FROM Admin`
                        , function (error, result, fields) {
                            if (error) {

                                console.error(error);
                                res.status(400).send();
                                return;
                            } else {

                                var obj = result;
                                let found = false;
                                for (var i = 0; i < obj.length; i++) {
                                    //console.log(obj[i].email + email + obj[i].username + username + obj[i].password + password)
                                    if (obj[i].email == email && obj[i].username == username && obj[i].password == password) {
                                        //res.redirect('/personal');
                                        console.log('dsad2')
                                        req.session.loggedIn = true;
                                        req.session.email = email;
                                        req.session.username = username;
                                        req.session.admin = true;
                                        found = true;
                                        break;
                                    }
                                }
                                if (found) {
                                    console.log('dsad')
                                    res.redirect('/admin');
                                } else {

                                    res.redirect('/login');
                                }
                            }
                        })
                }
            }
        })

    //Below for testing. Uncommet above to actually use DB
    // var obj = [
    //     { "email": "john@gmail.com", "username": "John", "password": "12345" },
    //     { "email": "kelly@gmail.com", "username": "Kelly", "password": "54321" }
    // ];

    // let found = false;
    // for (var i = 0; i < obj.length; i++) {
    //     if (obj[i].email == email && obj[i].username == username && obj[i].password == password) {
    //         req.session.loggedIn = true;
    //         req.session.username = email;
    //         found = true;
    //         break;
    //         //res.redirect('/personal');
    //         //console.log('/personal');
    //     }
    // }
    // if (found) {
    //     res.redirect('/personal');
    // } else {
    //     res.redirect('/login');
    // }
})
//get method personal
app.get('/personal', (req, res) => {
    if (req.session.loggedIn) {
        connection.query("SELECT * FROM Books", function (err, books, fields) {
            if (err) throw err;
            //res.render('home', { books })
            res.render('personal', { 'email': req.session.email, 'username': req.session.username, books });
        });
    } else {
        res.redirect('/');
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
    req.session.loggedIn = true;
    req.session.email = email;
    req.session.username = username;
    res.redirect('/personal');
})

//get method to render the form to signup
app.get('/logout', (req, res) => {
    req.session.loggedIn = false;
    req.session.email = "";
    req.session.destroy();
    res.redirect('/');
})

//confirm book reservation page
app.get('/confirmReservation', async (req, res) => {
    const fetch = require('node-fetch');
    //'http://localhost:3000/api/books/1'

    // var book = {
    //     book_name: "",
    //     author: [{Fname: "JK", Lname: "Rowling"}, {Fname: "Tester", Lname: "Juan"}],
    //     rating: 4.5,
    //     status: 'Available'
    // }

    const url = 'http://localhost:3000/api/books/' + req.query.ID;
    // console.log(url)
    const response = await fetch(url);

    const book = await response.json();
    // console.log(book);

    res.render('confirmReservation', { book: book, user: req.session.email, loggedIn: req.session.loggedIn });
})

app.put('/api/books/:id', (req, res) => {
    const { ID, Status } = req.body;
    //console.log(req.body);
    if (!ID || !Status) {
        res.status(400).send("must have BID and R_email");
        return;
    }
    else if (ID != req.params.id) {
        res.status(400).send("ID's do not equal each other");
        return;
    }
    connection.query(`UPDATE Books SET Status = ? WHERE ID = ?;`
        , [
            Status,
            ID
        ], function (error, results, fields) {
            if (error) {
                console.error(error);
                res.status(400).send();
                return;
            }
            else {
                // console.log("GOOOOD!");
                res.status(200).send();
            }
        })
});


app.get('/reservationSuccessful', (req, res) => {
    res.render('reservationSuccessful');
});

app.get('/admin', (req, res) => {
    res.render('admin');
})
//get method to render the form to add a book
app.get('/addBookForm', (req, res) => {
    res.render('addBookForm');
})
//post method to add books
app.post('/api/books', (req, res) => {
    const { name, genre, status } = req.body;
    var sql = `INSERT INTO Books (Name, Genre, Status) VALUES ('${name}', '${genre}', '${status}')`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            console.error(error);
            res.status(400).send();
            return;
        }
    })
    res.redirect('/');
})
app.get('/updateBookForm', (req, res) => {
    connection.query("SELECT * FROM Books", function (err, books, fields) {
        if (err) throw err;
        res.render('updateBookForm', { books })
    });
})
app.patch('/updateBookForm', (req, res) => {
    const { name, status } = req.body;
    var sql = `UPDATE Books SET Status =  "${status}" WHERE Name = "${name}"`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error(error);
            res.status(400).send();
            return;
        }
    })
    res.redirect('/');
})
app.get('/deleteBookForm', (req, res) => {
    connection.query("SELECT * FROM Books", function (err, books, fields) {
        if (err) throw err;
        res.render('deleteBookForm', { books })
    });
})
app.delete('/deleteBook', (req, res) => {
    const { name } = req.body;
    var sql = `DELETE FROM Books WHERE Name =  "${name}"`;
    connection.query(sql, function (error, results) {
        if (error) {
            console.error(error);
            res.status(400).send();
            return;
        }
    })
    res.redirect('/');
})
//add borrowing table to db
app.post('/api/genreFilter', (req, res) => {
    const { genre } = req.body;
    //console.log(genre);
    connection.query(`SELECT * FROM Books WHERE Genre= '${genre}' `, function (err, books, fields) {
        if (err) throw err;
        res.render('home', { books })
    });
    // if (!BID || !R_email) {
    //     res.status(400).send("must have BID and R_email");
    //     return;
    // }
    // var sql = `INSERT INTO Borrowing (BID, R_email) VALUES ('${BID}', '${R_email}')`;
    // connection.query(sql, function (error, results, fields) {
    //     if (error) {
    //         console.error(error);
    //         res.status(400).send();
    //         return;
    //     }
    //     res.json(results);
    // });

});

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