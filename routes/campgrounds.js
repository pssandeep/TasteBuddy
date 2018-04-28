var express = require("express");
var router = express.Router();
var CampGround = require("../models/campground");
var middleware = require("../middleware");

// Campgrounds Route

// index route. To display all the campgrounds
router.get("/", function (req, res) {
    CampGround.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
            req.flash("error",err);
            res.redirect("back");
        } else {
            res.render("campgrounds/index", {
                campgrounds: campgrounds
            });
        }
    });

});

// get route to show the form to enter new camp grounds.
router.get("/new", middleware.isLoggedIn, function (req, res) {

    res.render("campgrounds/new");
});

//show route. Show more details about the campgrounds
router.get("/:id", function (req, res) {
    CampGround.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log(err);
            req.flash("error",err);
            res.redirect("back");
        } else {
            res.render("campgrounds/show", {
                campground: campground
            });
        }
    });

});

//post route. Add new campgrounds to database
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampGround = {
        name: name,
        image: image,
        description: desc,
        author: author
    };

    CampGround.create(newCampGround, function (err, newlyAddedCampground) {
        if (err) {
            console.log(err);
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            req.flash("success","Campground created successfully.");
            res.redirect("/campgrounds");
        }
    });


});

//Form to Edit Campgrounds
router.get("/:id/edit", middleware.checkCampGroundOwnership, (req, res) => {
        CampGround.findById(req.params.id, (err, foundCampGround) => {
            res.render("campgrounds/edit", {
                campground: foundCampGround
            });
        });
});

//Edit Campgrounds
router.put("/:id", middleware.checkCampGroundOwnership,  (req, res) => {
    CampGround.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampGround) => {
        if (err) {
            console.log(err);
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            req.flash("success","Campground saved successfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }

    });

});

//Delete Campgrounds
router.delete("/:id", middleware.checkCampGroundOwnership, (req, res) => {
    CampGround.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            req.flash("success","Campground deleted successfully.");
            res.redirect("/campgrounds/");
        }

    });

});

// //Middleware functions
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next()
//     }
//     res.redirect("/login");
// }

// //Check if the user is logged in and authorised to edit/delete
// function checkCampGroundOwnership(req, res, next) {

//     if (req.isAuthenticated()) {
//         CampGround.findById(req.params.id, (err, foundCampGround) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 //Does user own campground
//                 if (foundCampGround.author.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     //res.send("Cant edit campgrounds. Campground can be editted only by their owners!");
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// }

//Export the router
module.exports = router;