const express = require("express")
const campgroundModel = require("../models/campground")
const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const campgrounds = await campgroundModel.getAllCampgrounds()
        res.render("index", {campgrounds: campgrounds})
    }catch(err){
        console.log(err.message)
        res.render("error")
    }
})



module.exports = router