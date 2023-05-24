const mongoose = require("mongoose")

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

async function getAllCampgrounds(){
    const campgrounds = await Campground.find({});
    return campgrounds;
}

async function getCampgroundById(id){
    const campground = await Campground.findById(id);
    return campground;
}

async function createCampground(newData){
    const newCampground = Campground(newData);
    const result = await newCampground.save();
    return result;
}

async function updateCampgroundById(id, newData){
    const updatedCampground = await Campground.findByIdAndUpdate(id, newData, {new: true, validation: true});
    return updatedCampground;
}

async function deleteCampgroundById(id){
    const deletedCampground = Campground.findByIdAndDelete(id);
    return deletedCampground;
}

async function deleteAll(){
    await Campground.deleteMany({});
}

const campGroundModel = {getAllCampgrounds, getCampgroundById, createCampground, updateCampgroundById, deleteCampgroundById, deleteAll}

module.exports = campGroundModel