const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../middleware.js')
const WrapAsync = require('../utils/WrapAsync.js');
const { renderDashboard, userSignUp, renderLoginPage, userLogin, renderSignUp, userLogOut } = require('../controllers/users.js');
const { renderMenu, showDetailedMenu } = require('../controllers/menus.js');
const { createReview, deleteReview } = require('../controllers/reviews.js');
const Menu = require('../models/menu.js');
const { createMenuItem, renderCreateMenu } = require('../controllers/menu_admin.js');

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

// reviews routes getting started here
router.post('/review/:id/new', isLoggedIn, WrapAsync(createReview));

router.delete('/review/:id/:reviewId/delete', isLoggedIn, WrapAsync(deleteReview));


// admin menu add

router.route('/menu/admin')
    .get(renderCreateMenu)
    .post(isLoggedIn, WrapAsync(createMenuItem));



module.exports = router;