const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")

const campgroundModel = require("./models/campground")

const campgroundRouter = require("./routes/campground")

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
app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
    res.render("home")
})
app.use(methodOverride("_method"))
app.use(express.urlencoded({extended: true}))

app.use("/campground/", campgroundRouter)

app.listen(3000, () => {
    console.log("listening on 3000")
})