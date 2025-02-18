if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const userRoutes = require('./routes/user.js');
const ejsMate = require('ejs-mate');
const User = require('./models/user.js');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError.js');
const methodOverride = require('method-override');

const secretKey = process.env.SECRET_KEY;
const dbUrl = process.env.ATLAS_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: secretKey,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("Error in mongo session store", err);
    
})

const sessionOption = {
    store,
    secret: secretKey,
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
app.use(methodOverride('_method'));

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

app.get('/', (req, res)=>{
    res.redirect('/home');
})

app.get('/home', (req, res)=>{
    res.render('./main/home.ejs');
})

app.use('/', userRoutes);


app.all('*', (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next)=>{
    let {status = 505, message = "Error happend!"} = err;
    res.status(status).render('error.ejs', {status, message});
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.listen(8080, ()=>{
    console.log("Server started");
})