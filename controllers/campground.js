const Campground = require("../models/campground")
const Review = require("../models/reviews")
const { IdError } = require("../utilities/error")

module.exports.renderIndex = async (req, res) => {
    const campgrounds = await Campground.getAll()
    res.render("campground/index", { campgrounds })
}

module.exports.renderNew = (req, res) => {
    res.render("campground/new")
}

module.exports.renderEdit = async (req, res) => {
    res.render("campground/edit")
}

module.exports.renderDetail = async (req, res) => {
    let userReview = undefined
    if (req.user) {
        const userId = req.user._id
        const campId = res.locals.campground._id
        userReview = await Review.getByUserAndCampId(userId, campId)
    }
    res.render("campground/detail", { userReview })
}

module.exports.createCampground = async (req, res) => {
    const newCampground = req.body
    newCampground.user = req.user._id
    const addedCampground = await Campground.create(newCampground);
    req.flash("success", "New campground successfully made!")
    res.redirect("/campground/")
}

module.exports.updateCampground = async (req, res) => {
    const id = req.params.campgroundId;
    const newData = req.body
    const updatedCampground = await Campground.updateById(id, newData)
    req.flash("success", "Campground updated successfully!")
    res.redirect(`/campground/${updatedCampground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const id = req.params.campgroundId;
    const deletedCampground = await Campground.deleteById(id)
    res.redirect(`/campground/`)
}

module.exports.handleError = (error, req, res, next) => {
    if (error instanceof IdError) {
        req.flash("error", "Campground not found")
        res.redirect("/campground")
    } else next(error)
}