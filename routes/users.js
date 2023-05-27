const router = require("express").Router()
const passport = require("passport")
const User = require("../models/user")
const catchAsync = require("../utilities/catchAsync")
const { moveReturnTo } = require("../utilities/validation")

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/register", catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.flash("success", "Welcome to Yelp Camp!")
        res.redirect("/campground")
    } catch (error) {
        console.log(typeof error)
        req.flash("error", error.message)
        res.redirect("/register")
    }
}))

router.post("/login", moveReturnTo, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
}),  (req, res) => {
    req.flash("success", "Welcome back")
    const redirect = res.locals.returnTo || "/campground"
    res.redirect(redirect)
})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "You've been logged out!")
        res.redirect("/campground")
    })
})


module.exports = router