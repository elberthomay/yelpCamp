const Campground = require("../models/campground")
const Review = require("../models/reviews")
const catchAsync = require("./catchAsync")

const retrieveCampground = catchAsync(async function(req, res, next){
    const id = req.params.campgroundId;
    const campground = await Campground.getById(id)
    res.locals.campground = campground
    res.locals.authorId = campground.user._id
    next()
})

const retrieveReview = catchAsync(async function(req, res, next){
    const id = req.params.reviewId
    const review = await Review.getById(id)
    res.locals.review = review
    res.locals.authorId = review.user._id
    next()
})

module.exports = { retrieveCampground, retrieveReview }