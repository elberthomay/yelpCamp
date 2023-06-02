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
    images: {
        type: [{
          url: {
            type: String,
            required: true
          },
          filename: {
            type: String,
            required: true
          }
        }],
        required: true,
        max: 10
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
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});


campgroundSchema.post("findOneAndDelete", async function (data) {
    const campgroundId = data._id
    await Review.deleteMany({ campground: campgroundId })
})

campgroundSchema.statics.getAll = async function (pageSize, pageNumber) {
    const maxPage = Math.ceil((await this.countDocuments({})) / pageSize)
    pageNumber = pageNumber > maxPage ? maxPage : pageNumber
    const pageSkip = pageSize * ( pageNumber - 1 )
    const campgrounds = await this.find({}).limit(pageSize).skip(pageSkip);
    
    return { campgrounds, maxPage, pageNumber};
}

campgroundSchema.statics.getMapData = async function(){
    const mapData = await this.find({}).select("_id title geometry")
    return mapData
}

campgroundSchema.statics.getById = async function (id) {
    const campground = await this.findById(id).populate("user", "username");
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