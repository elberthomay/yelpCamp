const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    userName: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    campground: {
        type: mongoose.Types.ObjectId,
        ref: "Campground",
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    star: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
})