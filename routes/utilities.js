const joi = require("joi")

function catchAsync(fn){
    return (req, res, next) => fn(req, res, next).catch(err => next(err))
}

class IdError extends Error{
    constructor(message, status){
        super()
        this.message = message
        this.status = status
    }
}

class ValidationError extends Error{
    constructor(message, status){
        super()
        this.message = message
        this.status = status
    }
}

const campgroundSchema = joi.object({
    title: joi.string().max(50).required(),
    price: joi.number().min(0).required(),
    image: joi.string().uri().required(),
    description: joi.string().max(500).required(),
    location: joi.string().max(100).required(),
})

function validateCampground(req, res, next){
    const newCampground = req.body
    const { error } = campgroundSchema.validate(newCampground)
    if(error) {
        const message = error.details.map(e => e.message).join(",");
        throw new ValidationError(message, 400);
    }else next();
}

const utilities = {catchAsync, IdError, ValidationError, validateCampground}

module.exports = utilities