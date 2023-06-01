const router = require("express").Router()
const review = require("../controllers/review")
const { validateReview, isLoggedIn, authorize, validateId } = require("../utilities/validation")
const { retrieveReview } = require("../utilities/retrieve")
const catchAsync = require("../utilities/catchAsync")

//display review of the provided campId
// router.get("/:campId", catchAsync(async (req, res) => {
//     const campId = req.params.campId
//     const campground = await CampGround.getById(campId)
//     const reviews = await Review.getByCampground(campId)
//     campground.reviews = reviews
//     res.render("review/detail", { campground })
// }))

// render new review form
//router.get("/:campId/reviews/new", (req, res) => {
//    const campId = req.params.campId
//    res.render("review/new", { campId })
//})

// render edit form for review with the provided id
// router.get("/:reviewId/edit", catchAsync(async (req, res) => {
//     const reviewId = req.params.reviewId
//     const review = await Review.getById(reviewId)
//     res.render("review/edit", { review })
// }))

// create new review on camp with provided id
router.post("/:campId", isLoggedIn, validateId("campId"), validateReview, catchAsync(review.createReview))

// update or delete review for the provided review id
router.route("/:reviewId")
    .patch(isLoggedIn, validateId("reviewId"), validateReview, retrieveReview, authorize, catchAsync(review.updateReview))
    .delete(isLoggedIn, validateId("reviewId"), retrieveReview, authorize, catchAsync(review.deleteReview))

module.exports = router