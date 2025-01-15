const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { isLoggedIn } = require('../middleware.js')
const Menu = require('../models/menu.js');
const WrapAsync = require('../utils/WrapAsync.js');
const { renderDashboard, userSignUp, renderLoginPage, userLogin, renderSignUp, userLogOut } = require('../controllers/users.js');
const { renderMenu, showDetailedMenu } = require('../controllers/menus.js');

router.get('/dashboard', renderDashboard);

router.route('/signup')
    .get(renderSignUp)
    .post(WrapAsync(userSignUp));

router.route('/login')
    .get(renderLoginPage)
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userLogin);


router.get('/logout', userLogOut);

// menu part start from here
router.get('/menu', WrapAsync(renderMenu));

router.get('/show/:id', WrapAsync(showDetailedMenu));



module.exports = router;