const joi = require("joi")
const { ValidationError } = require("./error")

const campgroundSchema = joi.object({
    title: joi.string().max(50).required(),
    price: joi.number().min(0).required(),
    image: joi.string().uri().required(),
    description: joi.string().max(500).required(),
    location: joi.string().max(100).required(),
}).unknown(false).required()

const reviewSchema = joi.object({
    review: joi.string().max(500).allow('').optional(),
    star: joi.number().integer().min(1).max(5).required(),
}).unknown(false).required()

function validate(joiSchema, callback){
    return function(req, res, next){
        const { error } = joiSchema.validate(req.body);
        if(error) {
            const message = error.details.map(e => e.message).join(",");
            throw new ValidationError(message, 400);
        }else{
            callback(req.body);
            next();
        }
    }
}

const validateCampground = validate(campgroundSchema, () => {})
const validateReview = validate(reviewSchema, (data) => {
    if (data.review === "") delete data.review
})


module.exports = {validateCampground, validateReview}