const express = require("express")
const campgroundModel = require("../models/campground")
const campGroundModel = require("../models/campground")
const { catchAsync, IdError, ValidationError, validateCampground } = require("./utilities")
const mongoose = require("mongoose")
const router = express.Router()

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await campgroundModel.getAllCampgrounds()
    res.render("index", { campgrounds })
}))

router.get("/new", (req, res) => {
    res.render("new")
})

router.get("/:id/edit", catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await campgroundModel.getCampgroundById(id)
    if (campground) {
        res.render("edit", { campground })
    } else throw new IdError("Id not found", 404)
}))

router.get("/:id", catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await campgroundModel.getCampgroundById(id)
    if (campground) {
        res.render("detail", { campground })
    } else throw new IdError("Id not found", 404)
}))

router.post("/", validateCampground, catchAsync(async (req, res) => {
    const newCampground = req.body
    const addedCampground = await campGroundModel.createCampground(newCampground);
    res.redirect("/campground/")
}))

router.patch("/:id", validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id;
    const newData = req.body
    const updatedCampground = await campgroundModel.updateCampgroundById(id, newData)
    if (updatedCampground) {
        res.redirect(`/campground/${updatedCampground._id}`)
    } else throw new IdError("Id not found", 404)
}))

router.delete("/:id", catchAsync(async (req, res) => {
    const id = req.params.id;
    const deletedCampground = await campgroundModel.deleteCampgroundById(id)
    if (deletedCampground) {
        res.redirect(`/campground/`)
    } else throw new IdError("Id not found", 404)
}))

router.use((error, req, res, next) => {
    if (error instanceof mongoose.Error.CastError) {
        console.log(error)
        res.status(400).render("error", { error })
    } else if (error instanceof IdError) {
        console.log(error)
        res.status(404).render("error", { error })
    } else if (error instanceof ValidationError) {
        console.log(error)
        res.status(400).render("error", { error })
    } else {
        console.log(error)
        res.status(500).render("error", { error })
    }
})

module.exports = router