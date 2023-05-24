
const { IdError, ValidationError } = require("../utilities/error")
const { CastError } = require("mongoose").Error

const errorHandler = ((error, req, res, next) => {
    if (error instanceof CastError) {
        console.log(error)
        res.status(400).render("error", { error })
    } else if (error instanceof IdError) {
        console.log(error)
        res.status(404).render("error", { error })
    } else if (error instanceof ValidationError) {
        console.log(error)
        res.status(400).render("error", { error })
    } else {
        console.log(error)
        res.status(500).render("error", { error })
    }
})

module.exports = errorHandler