const Campground = require("../models/campground")
const Review = require("../models/reviews")
const { cloudinary } = require("../utilities/cloudinary")
const { IdError } = require("../utilities/error")

module.exports.renderIndex = async (req, res) => {
    const campgrounds = await Campground.getAll()
    const campgroundData = {
        type: "FeatureCollection",
        crs: { type: "name", properties: { name: "campgroundData" } },
        features: campgrounds.map((campground) => ({
            type: "Feature",
            properties: {
                title: campground.title,
                id: campground._id
            },
            geometry: campground.geometry
        }))
    }
    res.render("campground/index", { campgrounds, campgroundData })
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
    const oldCampground = await Campground.getById(id)
    let images = oldCampground.images
    let deleteImage = req.body.deleteImage

    if (req.body.deleteImage) {
        //exclude invalid filename from deleteImage array
        deleteImage = req.body.deleteImage.filter((filename) => images.findIndex((image) => image.filename === filename) !== -1)
        // exclude filename in deleteImage
        images = images.filter((image) => deleteImage.findIndex((filename) => filename === image.filename) === -1)
    }

    if (req.body.newImages) {
        // add newImages to images
        images.push(...req.body.newImages)
    }

    const campgroundUpdate = { ...req.body, images }
    console.log(campgroundUpdate)

    const updatedCampground = await Campground.updateById(id, campgroundUpdate)

    if (deleteImage) {
        for (let filename of deleteImage) {
            await cloudinary.uploader.destroy(filename)
        }
    }

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