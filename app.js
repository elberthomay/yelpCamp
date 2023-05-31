if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const session = require("express-session")
const mongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const helmet = require("helmet")
const User = require("./models/user")
const mongodbURL = process.env.MONGODB_URL

const campgroundRouter = require("./routes/campground")
const reviewRouter = require("./routes/review")
const usersRouter = require("./routes/users")
const errorRouter = require("./routes/error")

const store = mongoStore.create({
    mongoUrl: mongodbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_KEY
    }
})

const sessionOption = {
    store,
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


//"mongodb://127.0.0.1:27017/yelpCampDb"





const app = express()
app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(session(sessionOption))
app.use(express.static(path.join(__dirname, "public")))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))

app.use(flash())
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    next()
})

app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/diiv7g48f/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.get("/", (req, res) => {
    res.render("home")
})

app.use("/", usersRouter)
app.use("/campground/", campgroundRouter)
app.use("/reviews/", reviewRouter)
app.use(errorRouter)

app.all("*", (req, res) => {
    res.status(404).render("notfound")
})

mongoose.connect(mongodbURL, { useNewUrlParser: true })
    .then(() => {
        console.log("database connected")
        app.listen(process.env.PORT, () => {
            console.log("listening for request")
        })
    })
    .catch((error) => console.error.bind("connection error"));