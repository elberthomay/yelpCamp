const mongoose = require("mongoose")
const Campground = require("./campground")
const { IdError } = require("../utilities/error")

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
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

    const userId = this.user
    const commentCount = await mongoose.model("Review").countDocuments( {user: userId, campground: campgroundId} )
    if(commentCount !== 0) throw new IdError("Duplicate review found", 400)
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

reviewSchema.statics.getByCampgroundId = async function (campgroundId) {
    const reviews = await this.find({ campground: campgroundId }).populate("user", "username");
    return reviews;
}

reviewSchema.statics.getByUserAndCampId = async function(userId, campgroundId) {
    const userReview = await this.findOne({ user: userId, campground: campgroundId}).populate("user")
    return userReview
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
