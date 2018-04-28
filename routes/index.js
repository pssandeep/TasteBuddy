var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//Auth Routes

//Regiter Form
router.get("/register", (req, res) => {
    res.render("auth/register");
});

//Regiter the user
router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            //console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");

            });
        }
    });
});

//Login Form
router.get("/login", (req, res) => {
    res.render("auth/login");
});


//Login User
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {});

//Logout User
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "You have successfully logged out. See you soon.");
    res.redirect("/campgrounds");
});

//home route
router.get("/", function (req, res) {
    res.render("home");
});

// //Middleware functions
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next()
//     }
//     res.redirect("/campgrounds");
// }

//Export the router
module.exports = router;