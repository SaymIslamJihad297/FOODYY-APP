const User = require('../models/user.js');

module.exports.renderDashboard = (req, res)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You need to login first");
        res.redirect('/login');
    }else{
        res.render('./user/dashboard.ejs');
    }
}

module.exports.renderSignUp = (req, res) => {
    res.render('./user/signup.ejs')
}

module.exports.userSignUp = async (req, res, next) => {
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
}


module.exports.renderLoginPage = (req, res)=>{
    res.render('./user/login.ejs');
}

module.exports.userLogin = (req, res)=>{
    let {username, password} = req.body;
    req.flash("success", "Login Successfull");
    res.redirect('/home');
}

module.exports.userLogOut = (req, res, next)=>{
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
}