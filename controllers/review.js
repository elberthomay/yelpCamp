const Review = require("../models/reviews")
const CampGround = require("../models/campground")

module.exports.createReview = async (req, res) => {
    const campgroundId = req.params.campId
    const userId = req.user._id
    const newReview = {...req.body, campground: campgroundId, user: userId}
    await Review.create(newReview)
    req.flash("success", "Created new review!")
    res.redirect(`/campground/${campgroundId}`)
}

module.exports.updateReview = async (req, res) => {
    const reviewId = req.params.reviewId
    const updatedReview = await Review.updateById(reviewId, req.body)
    res.redirect(`/campground/${updatedReview.campground}`)
}

module.exports.deleteReview = async (req, res) => {
    const reviewId = req.params.reviewId
    const deletedReview = await Review.deleteById(reviewId)
    req.flash("success", "Review deleted successfully")
    res.redirect(`/campground/${deletedReview.campground}`)
}