const router = require("express").Router()
const users = require("../controllers/users")
const catchAsync = require("../utilities/catchAsync")
const passport = require("passport")
const { moveReturnTo, validateRegister, validateLogin } = require("../utilities/validation")

router.route("/register")
    .get(users.renderRegister)
    .post(validateRegister, catchAsync(users.register), users.errorHandle)

router.route("/login")
    .get(users.renderLogin)
    .post(validateLogin, moveReturnTo, passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }), users.login, users.errorHandle)

router.get("/logout", users.logout)


module.exports = router