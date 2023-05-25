const router = require("express").Router()
const reviewModel = require("../models/reviews")
const campGroundModel = require("../models/campground")
const { validateReview } = require("../utilities/validation")

function catchAsync(fn){
    return (req, res, next) => fn(req, res, next).catch(err => next(err))
}

//display review of the provided campId
router.get("/:campId/reviews", catchAsync(async (req, res) => {
    const campId = req.params.campId
    const campground = await campGroundModel.getById(campId)
    const reviews = await reviewModel.findByCampground(campId)
    campground.reviews = reviews
    res.render("review/detail", { campground })
}))

// render new review form
//router.get("/:campId/reviews/new", (req, res) => {
//    const campId = req.params.campId
//    res.render("review/new", { campId })
//})

// render edit form for review with the provided id
router.get("/reviews/:reviewId/edit", catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId
    const review = await reviewModel.getById(reviewId)
    res.render("review/edit", { review })
}))

// create new review on camp with provided id
router.post("/reviews/:campId", validateReview, catchAsync(async (req, res) => {
    const campId = req.params.campId
    const newReview = {...req.body, campground: campId}
    await reviewModel.create(newReview)
    res.redirect(`/campground/${campId}`)
}))

// update review for the provided review id
router.patch("/reviews/:reviewId", validateReview, catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId
    const updatedReview = await reviewModel.updateById(reviewId, req.body)
    res.redirect(`/campground/${updatedReview.campground}`)
}))

// delete review for the proved review id
router.delete("/reviews/:reviewId", catchAsync(async (req, res) => {
    const reviewId = req.params.reviewId
    const deletedReview = await reviewModel.deleteById(reviewId)
    res.redirect(`/campground/${deletedReview.campground}`)
}))

module.exports = router