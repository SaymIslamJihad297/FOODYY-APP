const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const {isLoggedIn} = require('../middleware.js')
const Menu = require('../models/menu.js');

router.get('/dashboard', (req, res)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You need to login first");
        res.redirect('/login');
    }else{
        res.render('./user/dashboard.ejs');
    }
})
router.get('/signup', (req, res) => {
    res.render('./user/signup.ejs')
})

router.post('/signup', async (req, res, next) => {
    let { username, email, password } = req.body;
    let newUser = new User({username, email});
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to FOODYY");
        res.redirect('/home');
    })
});


router.get('/login', (req, res)=>{
    res.render('./user/login.ejs');
})
router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),(req, res)=>{
    let {username, password} = req.body;
    req.flash("success", "Login Successfull");
    res.redirect('/home');
})


router.get('/logout', (req, res, next)=>{
    if(req.isAuthenticated()){
        req.logout((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "You have been logged out");
            res.redirect('/home');
        })
    }else{
        req.flash("error", "Already logged out");
        res.redirect('/home');
    }
})

// menu part start from here
router.get('/menu', async (req, res)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to see the menu");
        res.redirect('/login');
    }
    let datas = await Menu.find();
    // console.log(datas);
    res.render('./user/menu.ejs', {datas});
})
router.get('/show/:id', async(req, res)=>{
    let id = req.params.id;
    // console.log(id);
    let item = await Menu.findOne({_id: id});
    console.log(item);
    res.render('./user/details.ejs', {item});
})



module.exports = router;