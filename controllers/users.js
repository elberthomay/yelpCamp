const User = require("../models/user")

module.exports.renderRegister = (req, res) => {
    res.render("users/register")
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login")
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.flash("success", "Welcome to Yelp Camp!")
        res.redirect("/campground")
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/register")
    }
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back")
    const redirect = res.locals.returnTo || "/campground"
    res.redirect(redirect)
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "You've been logged out!")
        res.redirect("/campground")
    })
}

module.exports.errorHandle = (error, req, res, next) => {
    const url = req.originalUrl;
    req.flash("error", error.message)
    res.redirect(url)
}