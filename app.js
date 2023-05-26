const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const session = require("express-session")
const flash = require("connect-flash")

const campgroundRouter = require("./routes/campground")
const reviewRouter = require("./routes/review")
const errorRouter = require("./routes/error")

const sessionOption = {
    secret: "this is not a secret",
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}



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

app.use(session(sessionOption))
app.use(express.static(path.join(__dirname, "public")))

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended: true}))

app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    next()
})

app.get("/", (req, res) => {
    res.render("home")
})

app.use("/campground/", campgroundRouter)
app.use("/reviews/", reviewRouter)
app.use(errorRouter)

app.all("*", (req, res) => {
    res.status(404).render("notfound")
})

app.listen(3000, () => {
    console.log("listening on 3000")
})