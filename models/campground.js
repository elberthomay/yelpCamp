const mongoose = require("mongoose")

const campgroundSchema = new mongoose.Schema({
    title: String, 
    price: Number,
    description: String, 
    location: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

async function getAllCampgrounds(){
    const campgrounds = await Campground.find({})
    return campgrounds
}

async function createCampground(newData){
    const newCampground = Campground(newData)
    const result = await newCampground.save()
    return result
}

async function deleteAll(){
    await Campground.deleteMany({});
}

const campGroundModel = {getAllCampgrounds, createCampground, deleteAll}

module.exports = campGroundModel