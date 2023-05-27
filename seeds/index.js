const mongoose = require("mongoose")
const campgroundModel = require("../models/campground")
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers");
const campGroundModel = require("../models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/yelpCampDb", {
    useNewUrlParser: true,
});

const db = mongoose.connection;

db.on("error", () => {
    console.error.bind("connection error")
});

db.once("open", () => {
    console.log("database connected")
})

async function seedDb() {
    await campgroundModel.deleteAll();

    const sample = array => array[Math.floor(Math.random() * array.length)];

    for (let index = 0; index < 100; index++) {
        const randomCity = sample(cities)
        const randomPrice = Math.floor(Math.random() * 2500)
        const newCampground = {
            user: new mongoose.Types.ObjectId("6470a91ca874a0127c986ed7"),
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            price: randomPrice,
            description: "Yeah, it's just a campground",
            location: `${randomCity.city}, ${randomCity.state}`,
        };
        await campGroundModel.create(newCampground)
    }
}

seedDb().then(() => {
    mongoose.connection.close()
})