const router = require("express").Router()
const users = require("../controllers/users")
const catchAsync = require("../utilities/catchAsync")
const passport = require("passport")
const { moveReturnTo } = require("../utilities/validation")

router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route("/login")
    .get(users.renderLogin)
    .post(moveReturnTo, passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }), users.login)

router.get("/logout", users.logout)


module.exports = router