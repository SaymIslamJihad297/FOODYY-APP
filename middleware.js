module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    }
    next();
}
