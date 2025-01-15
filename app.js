const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session');
const path = require('path');
const userRoutes = require('./routes/user.js');
const ejsMate = require('ejs-mate');
const User = require('./models/user.js');
const flash = require('connect-flash');
const Menu = require('./models/menu.js');

const sessionOption = {
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));
app.engine('ejs', ejsMate);

main().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
})

app.use(session(sessionOption));;
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.issLoggedIn = req.isAuthenticated();
    res.locals.userInfo = req.user;
    next();
})

app.get('/home', (req, res)=>{
    res.render('./main/home.ejs');
})

app.use('/', userRoutes);


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/foodyyapp');
}

app.listen(8080, ()=>{
    console.log("Server started");
})