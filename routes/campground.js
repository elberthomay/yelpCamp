const express = require("express")
const campground = require("../controllers/campground")
const { validateCampground, isLoggedIn, authorize } = require("../utilities/validation")
const { retrieveCampground } = require("../utilities/retrieve")
const router = express.Router()
const catchAsync = require("../utilities/catchAsync")

router.route("/")
    .get(catchAsync(campground.renderIndex))
    .post(validateCampground, isLoggedIn, catchAsync(campground.createCampground))


router.get("/new", isLoggedIn, campground.renderNew)

router.get("/:campgroundId/edit", isLoggedIn, retrieveCampground, authorize, catchAsync(campground.renderEdit))

router.route("/:campgroundId")
    .get(retrieveCampground, catchAsync(campground.renderDetail))
    .put(validateCampground, isLoggedIn, authorize, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, retrieveCampground, authorize, catchAsync(campground.deleteCampground))

router.use(campground.handleError)

module.exports = router