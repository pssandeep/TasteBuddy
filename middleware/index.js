//Middleware
var CampGround = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};



//Middleware functions
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("error","Please login!");
    res.redirect("/login");
}


//Check if the user is logged in and authorised to edit/delete
middlewareObj.checkCampGroundOwnership = function (req, res, next) {

    if (req.isAuthenticated()) {
        CampGround.findById(req.params.id, (err, foundCampGround) => {
            if (err) {
                req.flash("error","Campground not found. Something went wrong");
                res.redirect("back");
                // console.log(err);
            } else {
                //Does user own campground
                if (foundCampGround.author.id.equals(req.user._id)) {
                    next();
                } else {
                    //res.send("Cant edit campgrounds. Campground can be editted only by their owners!");
                    req.flash("error","No permission to edit/delete others content");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","Please login!");
        res.redirect("back");
    }
}

//Check if the user is logged in and authorised to edit/delete
middlewareObj.checkCommentOwnership = function (req, res, next) {

    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash("error","Comments not found. Something went wrong");
                res.redirect("back");
            } else {
                //Does user own comment
                console.log(foundComment);
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error","No permission to edit/delete others content");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","Please login!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;