const mongoose = require("mongoose")
const { IdError } = require("../utilities/error")

const campgroundSchema = new mongoose.Schema({
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

//campgroundSchema.post("findOneAndDelete", async function(data){
//    const campgroundId = data._id
//    await mongoose.model("Review").deleteMany({_id: campgroundId})
//})

const Campground = mongoose.model("Campground", campgroundSchema);

async function getAll(){
    const campgrounds = await Campground.find({});
    return campgrounds;
}

async function getById(id){
    const campground = await Campground.findById(id);
    if (!campground) throw new IdError("Campground Id not found", 404)
    return campground;
}

async function create(newData){
    const newCampground = Campground(newData);
    const result = await newCampground.save();
    return result;
}

async function updateById(id, newData){
    const updatedCampground = await Campground.findByIdAndUpdate(id, newData, {new: true, validation: true});
    if (!updatedCampground) throw new IdError("Id not found", 404)
    return updatedCampground;
}

async function deleteById(id){
    const deletedCampground = await Campground.findByIdAndDelete(id);
    if(!deletedCampground) throw new IdError("Id not found", 404);
    return deletedCampground;
}

async function deleteAll(){
    await Campground.deleteMany({});
}

const campGroundModel = {getAll, getById, create, updateById, deleteById, deleteAll}

module.exports = campGroundModel