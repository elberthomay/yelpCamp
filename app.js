const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")

const campgroundRouter = require("./routes/campground")
const errorRouter = require("./routes/error")



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


app.use(methodOverride("_method"))
app.use(express.urlencoded({extended: true}))


app.get("/", (req, res) => {
    res.render("home")
})

app.use("/campground/", campgroundRouter)
app.use(errorRouter)

app.all("*", (req, res) => {
    res.status(404).render("notfound")
})

app.listen(3000, () => {
    console.log("listening on 3000")
})