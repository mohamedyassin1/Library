const express = require('express');
const app = express();

const path = require('path');
const session = require('express-session');
const res = require('express/lib/response');

const { request } = require('http');

app.use(express.json());//added
app.use(express.urlencoded({ extended: true })); //to parse HTML form data (aka read HTML form data)
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({//added
    secret: 'secretforseng401librarywebapplication',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 1},//1 minutes
    rolling: true
}));

const testUser = 'user';
const testPass = 'user1';

app.get('/',(req,res) => {
    const session=req.session;
    if(session.userid){
        res.send(`Welcome ${session.userid} <a href=\'/logout'>click to logout</a>`);
    }else
    res.send(`<html>
    <head>
    </head>
    <body>
        <form action="/user" method="post">
            <h2>Login</h2>
            <div class="input-field">
                <input type="text" name="username" id="username" placeholder="Enter Username">
            </div>
            <div class="input-field">
                <input type="password" name="password" id="password" placeholder="Enter Password">
            </div>
            <input type="submit" value="LogIn">
        </form>
    </body>
    <style>
    body {
        display: flex;
        justify-content: center;
    }
    
    form {
        display: flex;
        flex-direction: column;
    }
    
    .input-field {
        position: relative;
        margin-top: 2rem;
    }
    
    .input-field input {
        padding: 0.8rem;
    }
    
    form .input-field:first-child {
        margin-bottom: 1.5rem;
    }
    
    form input[type="submit"] {
        background: linear-gradient(to left, #4776E6, #8e54e9);
        color: white;
        border-radius: 4px;
        margin-top: 2rem;
        padding: 0.4rem;
    }
    </style>
    </html>`)
});

app.post('/user',(req,res) => {
    if(req.body.username == testUser && req.body.password == testPass){
        const session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
        res.send(`Hey there ${session.userid}, welcome <a href=\'/logout'>click to logout</a>`);
    }
    else{
        res.send('Invalid username or password');
    }
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});


//Listening for requests
app.listen(3000, () => {
    console.log("listening on port 3000");
});