const express = require("express")
const Campground = require("../models/campground")
const Review = require("../models/reviews")
const { validateCampground, isLoggedIn, authorize } = require("../utilities/validation")
const { retrieveCampground } = require("../utilities/retrieve")
const { IdError } = require("../utilities/error")
const router = express.Router()
const catchAsync = require("../utilities/catchAsync")

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.getAll()
    res.render("campground/index", { campgrounds })
}))

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campground/new")
})

router.get("/:campgroundId/edit", isLoggedIn, retrieveCampground, authorize, catchAsync(async (req, res) => {
    res.render("campground/edit")
}))

router.get("/:campgroundId", retrieveCampground, catchAsync(async (req, res) => {
    let userReview = undefined
    if (req.user) {
        const userId = req.user._id
        const campId = res.locals.campground._id
        userReview = await Review.getByUserAndCampId(userId, campId)
        console.log(userReview)
    }
    res.render("campground/detail", { userReview })
}))

router.post("/", validateCampground, isLoggedIn, catchAsync(async (req, res) => {
    const newCampground = req.body
    newCampground.user = req.user._id
    const addedCampground = await Campground.create(newCampground);
    req.flash("success", "New campground successfully made!")
    res.redirect("/campground/")
}))

router.put("/:id", validateCampground, isLoggedIn, authorize, catchAsync(async (req, res) => {
    const id = req.params.id;
    const newData = req.body
    const updatedCampground = await Campground.updateById(id, newData)
    req.flash("success", "Campground updated successfully!")
    res.redirect(`/campground/${updatedCampground._id}`)
}))

router.delete("/:campgroundId", isLoggedIn, retrieveCampground, authorize, catchAsync(async (req, res) => {
    const id = req.params.campgroundId;
    const deletedCampground = await Campground.deleteById(id)
    res.redirect(`/campground/`)
}))

router.use((error, req, res, next) => {
    if (error instanceof IdError) {
        req.flash("error", "Campground not found")
        res.redirect("/campground")
    } else next(error)
})

module.exports = router