const Menu = require('../models/menu.js');
const AdminUsername = process.env.ADMIN_USERNAME;
const AdminPassword = process.env.ADMIN_PASSWORD;


module.exports.renderCreateMenu = (req, res) => {
    res.render("./admin/menu_add_admin.ejs");
}

module.exports.createMenuItem = async (req, res) => {
    let Item = req.body.item;
    let pswd = req.body.password;
    let currUser = req.user;
    console.log(Item, pswd);
    if(currUser.username==AdminUsername){
        console.log("Yes admin");
        if (pswd == AdminPassword) {
            let newItem = new Menu(Item);
            let result = await newItem.save();
            console.log(result);
            req.flash("success", "Successfully added item");
            res.redirect('/menu');
        }else{
            req.flash("error", "You are not admin");
            res.redirect('/menu');
        }
    }else{
        req.flash("error", "You are not admin");
        res.redirect('/menu');
    }
}

