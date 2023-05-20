const express = require("express")
const campgroundModel = require("../models/campground")
const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const campgrounds = await campgroundModel.getAllCampgrounds()
        res.render("index", { campgrounds })
    }catch(err){
        console.log(err.message)
        res.render("error")
    }
})

router.get("/:id", async (req, res) => {
        try{
            const id = req.params.id;
            const campground = await campgroundModel.getCampgroundById(id)
            if(campground){
                res.render("detail", { campground })
            }else res.status(404).render("notfound")
        }catch(err){
            console.log(err.message)
            res.render("error")
        }
})

module.exports = router