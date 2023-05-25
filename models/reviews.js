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

const Review = mongoose.model("Review", reviewSchema)

async function getAll() {
    const reviews = await Review.find({});
    return reviews;
}

async function getById(id) {
    const review = await Review.findById(id);
    if (!review) throw new IdError("Id not found", 404);
    return review;
}

async function findByCampground(campgroundId) {
    const reviews = await Review.find({ campground: campgroundId });
    return reviews;
}

async function create(newData) {
    const newReview = new Review(newData);
    const result = await newReview.save();
    return result;
}

async function updateById(id, newData) {
    const updatedReview = await Review.findByIdAndUpdate(
        id,
        newData,
        { new: true, runValidators: true }
    );
    if (!updatedReview) throw new IdError("Id not found", 404);
    return updatedReview;
}

async function deleteById(id) {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) throw new IdError("Id not found", 404);
    return deletedReview;
}

async function deleteAll() {
    await Review.deleteMany({});
}

const reviewModel = {
    getById,
    create,
    updateById,
    deleteById,
    findByCampground, // Add the findByCampground function
};

module.exports = reviewModel;
