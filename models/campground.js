const mongoose = require("mongoose")
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
    await mongoose.model("Review").deleteMany({ campground: campgroundId })
})

const Campground = mongoose.model("Campground", campgroundSchema);

async function getAll() {
    const campgrounds = await Campground.find({});
    return campgrounds;
}

async function getById(id) {
    const campground = await Campground.findById(id).populate("user");
    if (!campground) throw new IdError("Campground Id not found", 404)
    const reviews = await mongoose.model("Review").find({campground: id})
    campground.reviews = reviews
    return campground;
}

async function create(newData) {
    const newCampground = Campground(newData);
    const result = await newCampground.save();
    return result;
}

async function updateById(id, newData) {
    const updatedCampground = await Campground.findByIdAndUpdate(
        id,
        newData,
        { new: true, runValidators: true }
    );
    if (!updatedCampground) throw new IdError("Id not found", 404)
    return updatedCampground;
}

async function deleteById(id) {
    const deletedCampground = await Campground.findByIdAndDelete(id);
    if (!deletedCampground) throw new IdError("Id not found", 404);
    return deletedCampground;
}

async function deleteAll() {
    await Campground.deleteMany({});
}

const campGroundModel = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    deleteAll
}

module.exports = campGroundModel