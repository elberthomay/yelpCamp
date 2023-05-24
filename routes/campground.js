const express = require("express")
const campgroundModel = require("../models/campground")
const { validateCampground } = require("../utilities/validation")
const router = express.Router()

function catchAsync(fn){
    return (req, res, next) => fn(req, res, next).catch(err => next(err))
}

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await campgroundModel.getAll()
    res.render("campground/index", { campgrounds })
}))

router.get("/new", (req, res) => {
    res.render("campground/new")
})

router.get("/:id/edit", catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await campgroundModel.getById(id)
    res.render("campground/edit", { campground })
}))

router.get("/:id", catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await campgroundModel.getById(id)
    res.render("campground/detail", { campground })
}))

router.post("/", validateCampground, catchAsync(async (req, res) => {
    const newCampground = req.body
    const addedCampground = await campGroundModel.create(newCampground);
    res.redirect("/campground/")
}))

router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id;
    const newData = req.body
    const updatedCampground = await campgroundModel.updateById(id, newData)
    res.redirect(`/campground/${updatedCampground._id}`)
}))

router.delete("/:id", catchAsync(async (req, res) => {
    const id = req.params.id;
    const deletedCampground = await campgroundModel.deleteById(id)
    res.redirect(`/campground/`)
}))

module.exports = router