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

module.exports = { IdError, ValidationError }