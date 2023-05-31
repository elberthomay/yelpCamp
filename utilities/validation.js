const joiBase = require("joi")
const { ValidationError } = require("./error")
const sanitizeHTML = require("sanitize-html")

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not contain HTML!"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [], 
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error("string.escapeHTML", { value })
                return clean;
            }
        }
    }
})

const joi = joiBase.extend(extension)

const geoJSONSchema = joi.object({
    type: joi.string().valid("Point").required(),
    coordinates: joi.array().items(joi.number()).length(2).required()
}).unknown(false)

const campgroundSchema = joi.object({
    title: joi.string().max(50).required().escapeHTML(),
    price: joi.number().min(0).required(),
    images: joi.array().items(joi.object({
        url: joi.string().uri().required(),
        filename: joi.string().required()
    })).max(10).empty(joi.array().length(0)).optional(),
    description: joi.string().max(500).required().escapeHTML(),
    location: joi.string().max(100).required().escapeHTML(),
    geometry: geoJSONSchema.required()
}).unknown(false).required()

const checkEmptyString = (value, helpers) => (value === "" ? helpers.strip() : value)
const checkEmptyArray = (value, helpers) => (value.length === 0 ? helpers.strip() : value)

const campgroundUpdateSchema = joi.object({
    title: joi.string().max(50).empty("").optional().escapeHTML(), 
    price: joi.number().min(0).empty("").optional(),
    newImages: joi.array().items( joi.object({
        url: joi.string().uri().required(), 
        filename: joi.string().required(),
    })).max(10).empty(joi.array().length(0)).optional(),
    deleteImage: joi.array().items( joi.string().max(50).escapeHTML()).optional().max(10),
    description: joi.string().max(500).empty("").optional().escapeHTML(),
    location: joi.string().max(100).empty("").optional().escapeHTML(),
    geometry: geoJSONSchema.optional()
}).unknown(false).required()

const reviewSchema = joi.object({
    review: joi.string().max(500).optional().empty("").escapeHTML(),
    star: joi.number().integer().min(1).max(5).required(),
}).unknown(false).required()

function validate(joiSchema, callback) {
    return function (req, res, next) {
        const { value, error } = joiSchema.validate(req.body);
        if (error) {
            const message = error.details.map(e => e.message).join(",");
            throw new ValidationError(message, 400);
        } else {
            req.body = value
            callback(req.body);
            next();
        }
    }
}

const validateCampground = validate(campgroundSchema, () => {})
const validateReview = validate(reviewSchema, () => {})
const validateCampgroundUpdate = validate(campgroundUpdateSchema, () => {})

function moveReturnTo(req, res, next) {
    res.locals.returnTo = req.session.returnTo
    next()
}

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must sign in")
        return res.redirect("/login")
    }
    next()
}

function authorize(req, res, next){
    if(!req.user._id.equals(res.locals.authorId)){
        req.flash("error", "Not Authorized")
        return res.redirect("/campground")
    }
    next()
}


module.exports = { validateCampground, validateReview, validateCampgroundUpdate, isLoggedIn, moveReturnTo, authorize }