const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const geocodingClient = mbxGeocoding({ accessToken: "pk.eyJ1IjoiZWxiZXJ0aG9tYXgiLCJhIjoiY2xpOHA5aW5kMWx5MjNmcGN3d2ZiZ2ExdSJ9.rguWjU8YoT2PrTJ9JWgnqQ" })//process.env.MAPBOX_PUBLIC_TOKEN})
const catchAsync = require("./catchAsync")

module.exports.getGeometry = catchAsync(async (req, res, next) => {
    if (req.body.location) {
        const coordinate = await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1
        }).send()
        req.body.geometry = coordinate.body.features[0].geometry
        next()
    } else next()
})