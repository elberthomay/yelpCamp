const router = require("express").Router()
const Review = require("../models/reviews")
const CampGround = require("../models/campground")
const { validateReview, isLoggedIn, authorize } = require("../utilities/validation")
const { retrieveReview } = require("../utilities/retrieve")
const catchAsync = require("../utilities/catchAsync")

//display review of the provided campId
router.get("/:campId", catchAsync(async (req, res) => {
    const campId = req.params.campId
    const campground = await CampGround.getById(campId)
    const reviews = await Review.getByCampground(campId)
    campground.reviews = reviews
    res.render("review/detail", { campground })
}))

// render new review form
//router.get("/:campId/reviews/new", (req, res) => {
//    const campId = req.params.campId
//    res.render("review/new", { campId })
//})

// render edit form for review with the provided id
router.get("/:reviewId/edit", catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId
    const review = await Review.getById(reviewId)
    res.render("review/edit", { review })
}))

// create new review on camp with provided id
router.post("/:campId", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campgroundId = req.params.campId
    const userId = req.user._id
    const newReview = {...req.body, campground: campgroundId, user: userId}
    await Review.create(newReview)
    req.flash("success", "Created new review!")
    res.redirect(`/campground/${campground}`)
}))

// update review for the provided review id
router.patch("/:reviewId", isLoggedIn, validateReview, retrieveReview, authorize, catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId
    const updatedReview = await Review.updateById(reviewId, req.body)
    res.redirect(`/campground/${updatedReview.campground}`)
}))

// delete review for the proved review id
router.delete("/:reviewId", isLoggedIn, retrieveReview, authorize, catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId
    const deletedReview = await Review.deleteById(reviewId)
    req.flash("success", "Review deleted successfully")
    res.redirect(`/campground/${deletedReview.campground}`)
}))

module.exports = router