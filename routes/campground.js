const express = require("express")
const campground = require("../controllers/campground")
const { validateId, validateCampground, validateCampgroundUpdate, isLoggedIn, authorize } = require("../utilities/validation")
const { retrieveCampground } = require("../utilities/retrieve")
const { getGeometry } = require("../utilities/mapbox")
const router = express.Router()
const catchAsync = require("../utilities/catchAsync")

const { storage, addFilesToBody } = require("../utilities/cloudinary")
const multer = require("multer")
const upload = multer({ storage })

router.route("/")
    .get(catchAsync(campground.renderIndex))
    .post(isLoggedIn, upload.array("image"), addFilesToBody("images"), getGeometry, validateCampground, catchAsync(campground.createCampground))


router.get("/new", isLoggedIn, campground.renderNew)

router.get("/:campgroundId/edit", isLoggedIn, validateId("campgroundId"), retrieveCampground, authorize, catchAsync(campground.renderEdit))

router.route("/:campgroundId")
    .get(validateId("campgroundId"), retrieveCampground, catchAsync(campground.renderDetail))
    .patch(isLoggedIn, validateId("campgroundId"), retrieveCampground, authorize, upload.array("image"), addFilesToBody("newImages"), getGeometry, validateCampgroundUpdate, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, validateId("campgroundId"), retrieveCampground, authorize, catchAsync(campground.deleteCampground))

router.use(campground.handleError)

module.exports = router