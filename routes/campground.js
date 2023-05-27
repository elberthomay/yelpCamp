const express = require("express")
const Campground = require("../models/campground")
const { validateCampground, isLoggedIn } = require("../utilities/validation")
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

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const id = req.params.id;
    try {
        const campground = await Campground.getById(id)
        res.render("campground/edit", { campground })
    } catch (error) {
        if (error instanceof IdError) {
            req.flash("error", "Campground not found")
            res.redirect("/campground")
        } else throw error
    }
}))

router.get("/:id", catchAsync(async (req, res) => {
    const id = req.params.id;
    try {
        const campground = await Campground.getById(id)
        res.render("campground/detail", { campground })
    } catch (error) {
        if (error instanceof IdError) {
            req.flash("error", "Campground not found")
            res.redirect("/campground")
        } else throw error
    }
}))

router.post("/", validateCampground, isLoggedIn, catchAsync(async (req, res) => {
    const newCampground = req.body
    const addedCampground = await Campground.create(newCampground);
    req.flash("success", "New campground successfully made!")
    res.redirect("/campground/")
}))

router.put("/:id", validateCampground, isLoggedIn, catchAsync(async (req, res) => {
    const id = req.params.id;
    const newData = req.body
    const updatedCampground = await Campground.updateById(id, newData)
    req.flash("success", "Campground updated successfully!")
    res.redirect(`/campground/${updatedCampground._id}`)
}))

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const id = req.params.id;
    const deletedCampground = await Campground.deleteById(id)
    res.redirect(`/campground/`)
}))

module.exports = router