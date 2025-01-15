const Menu = require('../models/menu.js');

module.exports.renderMenu = async (req, res)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to see the menu");
        res.redirect('/login');
    }
    let datas = await Menu.find();
    // console.log(datas);
    res.render('./user/menu.ejs', {datas});
}

module.exports.showDetailedMenu = async(req, res)=>{
    let id = req.params.id;
    // console.log(id);
    let item = await Menu.findOne({_id: id});
    console.log(item);
    res.render('./user/details.ejs', {item});
}