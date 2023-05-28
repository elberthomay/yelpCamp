const mongoose = require("mongoose")
const Review = require("./reviews")
const { IdError } = require("../utilities/error")

const campgroundSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
});


campgroundSchema.post("findOneAndDelete", async function (data) {
    const campgroundId = data._id
    await Review.deleteMany({ campground: campgroundId })
})

campgroundSchema.statics.getAll = async function () {
    const campgrounds = await this.find({});
    return campgrounds;
}

campgroundSchema.statics.getById = async function (id) {
    const campground = await this.findById(id);
    if (!campground) throw new IdError("Campground Id not found", 404)
    const reviews = await Review.getByCampgroundId(id)
    campground.reviews = reviews
    return campground;
}

campgroundSchema.statics.create = async function (newData) {
    const newCampground = this(newData);
    const result = await newCampground.save();
    return result;
}

campgroundSchema.statics.updateById = async function (id, newData) {
    const updatedCampground = await this.findByIdAndUpdate( id, newData,
        { new: true, runValidators: true }
    );
    if (!updatedCampground) throw new IdError("Id not found", 404)
    return updatedCampground;
}

campgroundSchema.statics.deleteById = async function (id) {
    const deletedCampground = await this.findByIdAndDelete(id);
    if (!deletedCampground) throw new IdError("Id not found", 404);
    return deletedCampground;
}

campgroundSchema.statics.deleteAll = async function () {
    await this.deleteMany({});
}

const Campground = mongoose.model("Campground", campgroundSchema)

module.exports = Campground