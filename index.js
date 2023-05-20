const express = require("express")
const mongoose = require("mongoose")
const path = require("path")

const campgroundModel = require("./models/campground")

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

const app = express()
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/newCampground", async (req, res) => {
    const result = await campgroundModel.createCampground({
        title: "my first campground",
        price: 0,
        description: "a very modest campground from my house",
        location: "my backyard",
    })

    res.send(result)
})

app.listen(3000, () => {
    console.log("listening on 3000")
})