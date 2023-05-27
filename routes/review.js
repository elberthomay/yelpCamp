const router = require("express").Router()
const Review = require("../models/reviews")
const CampGround = require("../models/campground")
const { validateReview } = require("../utilities/validation")
const catchAsync = require("../utilities/catchAsync")

//display review of the provided campId
router.get("/:campId", catchAsync(async (req, res) => {
    const campId = req.params.campId
    const campground = await CampGround.getById(campId)
    const reviews = await Review.findByCampground(campId)
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
router.post("/:campId", validateReview, catchAsync(async (req, res) => {
    const campId = req.params.campId
    const newReview = {...req.body, campground: campId}
    await Review.create(newReview)
    req.flash("success", "Created new review!")
    res.redirect(`/campground/${campId}`)
}))

// update review for the provided review id
router.patch("/:reviewId", validateReview, catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId
    const updatedReview = await Review.updateById(reviewId, req.body)
    res.redirect(`/campground/${updatedReview.campground}`)
}))

// delete review for the proved review id
router.delete("/:reviewId", catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId
    const deletedReview = await Review.deleteById(reviewId)
    req.flash("success", "Review deleted successfully")
    res.redirect(`/campground/${deletedReview.campground}`)
}))

module.exports = router