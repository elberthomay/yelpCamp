const express = require("express")
const campgroundModel = require("../models/campground")
const campGroundModel = require("../models/campground")
const router = express.Router()
const mongoose = require("mongoose")

router.get("/", async (req, res) => {
    try {
        const campgrounds = await campgroundModel.getAllCampgrounds()
        res.render("index", { campgrounds })
    } catch (err) {
        console.log(err.message)
        res.render("error")
    }
})

router.get("/new", (req, res) => {
    res.render("new")
})

router.get("/:id/edit", async (req, res) => {
    try {
        const id = req.params.id;
        const campground = await campgroundModel.getCampgroundById(id)
        if (campground) {
            res.render("edit", { campground })
        } else res.status(404).render("notfound")
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            res.status(404).render("notfound")
        } else {
            console.log(err.message)
            res.render("error")
        }
    }
    
})

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const campground = await campgroundModel.getCampgroundById(id)
        if (campground) {
            res.render("detail", { campground })
        } else res.status(404).render("notfound")
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            res.status(404).render("notfound")
        } else {
            console.log(err.message)
            res.render("error")
        }
    }
})

router.post("/", async (req, res) => {
    try {
        const newCampground = req.body
        const addedCampground = await campGroundModel.createCampground(newCampground);
        res.redirect("/campground/")
    } catch (err) {
        console.log(err.message)
        if (err instanceof mongoose.Error.ValidationError) {
            res.render("error")
        }
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body
        const updatedCampground = await campgroundModel.updateCampgroundById(id, newData)
        if (updatedCampground) {
            res.redirect(`/campground/${updatedCampground._id}`)
        } else{
            res.status(404).render("notfound")
        }
    } catch (err) {
        console.log(err.message)
        if (err instanceof mongoose.Error.CastError) {
            res.redirect("error")
        } else if (err instanceof mongoose.Error.ValidationError) {
            res.redirect("error")
        } else {
            res.redirect("error")
        }
    }
})

module.exports = router