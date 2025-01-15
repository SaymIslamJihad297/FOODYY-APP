const Review = require('../models/review.js');
const Menu = require('../models/menu.js');

module.exports.createReview = async (req, res) => {
    let id = req.params.id;
    let item = await Menu.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    item.reviews.push(newReview);
    await newReview.save();
    await item.save();

    req.flash("success", "Review Added Successfully");
    res.redirect('/menu');
}


module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.userInfo._id)) {
        req.flash("error", "You are not the owner");
        res.redirect(`/show/${id}`);
    } else {
        let deletedReview = await Review.findByIdAndDelete(reviewId);
        console.log(deletedReview);
        req.flash("success", "Review Deleted");
        res.redirect(`/show/${id}`);
    }
}