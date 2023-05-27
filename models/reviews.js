const mongoose = require("mongoose")
const { IdError } = require("../utilities/error")

const reviewSchema = mongoose.Schema({
    campground: {
        type: mongoose.Types.ObjectId,
        ref: "Campground",
        required: true,
        index: true,
    },
    review: {
        type: String,
        max: 500,
    },
    star: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
})

reviewSchema.pre("save", async function(){
    const campgroundId = this.campground;
    const count = await mongoose.model("Campground").countDocuments({_id: campgroundId})
    if(count === 0) throw new IdError("Campground Id not found", 404)
})

reviewSchema.statics.getAll = async function() {
    const reviews = await this.find({});
    return reviews;
}

reviewSchema.statics.getById = async function (id) {
    const review = await this.findById(id);
    if (!review) throw new IdError("Id not found", 404);
    return review;
}

reviewSchema.statics.findByCampground = async function (campgroundId) {
    const reviews = await this.find({ campground: campgroundId });
    return reviews;
}

reviewSchema.statics.create = async function (newData) {
    const newReview = new this(newData);
    const result = await newReview.save();
    return result;
}

reviewSchema.statics.updateById = async function (id, newData) {
    const updatedReview = await this.findByIdAndUpdate( id, newData,
        { new: true, runValidators: true }
    );
    if (!updatedReview) throw new IdError("Id not found", 404);
    return updatedReview;
}

reviewSchema.statics.deleteById = async function (id) {
    const deletedReview = await this.findByIdAndDelete(id);
    if (!deletedReview) throw new IdError("Id not found", 404);
    return deletedReview;
}

reviewSchema.statics.deleteAll = async function () {
    await this.deleteMany({});
}

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review
