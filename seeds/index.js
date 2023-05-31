const mongoose = require("mongoose")
const campgroundModel = require("../models/campground")
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers");
const campGroundModel = require("../models/campground");

mongoose.connect(process.env.MONGODB_URL, {
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
  const campgrounds = await campgroundModel.find({})
  console.log(campgrounds)
    // await campgroundModel.deleteAll();

    // const sample = array => array[Math.floor(Math.random() * array.length)];
    

    // for (let index = 0; index < 200; index++) {
    //     const randomCity = sample(cities)
    //     const randomPrice = Math.floor(Math.random() * 2500)
    //     const newCampground = {
    //         user: new mongoose.Types.ObjectId("6470a91ca874a0127c986ed7"),
    //         title: `${sample(descriptors)} ${sample(places)}`,
    //         images: [
    //             {
    //               url: 'https://res.cloudinary.com/diiv7g48f/image/upload/v1685323908/YelpCamp/d1avogjrgcslg63sew1z.jpg',
    //               filename: 'YelpCamp/d1avogjrgcslg63sew1z',
    //             },
    //             {
    //               url: 'https://res.cloudinary.com/diiv7g48f/image/upload/v1685323908/YelpCamp/b81cjrjnseumvfo1tzoc.jpg',
    //               filename: 'YelpCamp/b81cjrjnseumvfo1tzoc',
    //             },
    //             {
    //               url: 'https://res.cloudinary.com/diiv7g48f/image/upload/v1685323908/YelpCamp/lthwc9hzsrvmgjjtg6zp.jpg',
    //               filename: 'YelpCamp/lthwc9hzsrvmgjjtg6zp',
    //             }
    //           ],
    //         price: randomPrice,
    //         description: "Yeah, it's just a campground",
    //         location: `${randomCity.city}, ${randomCity.state}`,
    //         geometry: {
    //           type: "Point",
    //           coordinates: [ randomCity.longitude, randomCity.latitude ]
    //         }
    //     };
    //     await campGroundModel.create(newCampground)
    // }
}

seedDb().then(() => {
    mongoose.connection.close()
})