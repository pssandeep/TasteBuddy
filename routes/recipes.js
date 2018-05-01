var express = require("express");
var router = express.Router();
var recipe = require("../models/recipe");
var middleware = require("../middleware");

// recipes Route

// index route. To display all the recipes
router.get("/", function (req, res) {
    recipe.find({}, function (err, recipes) {
        if (err) {
            console.log(err);
            req.flash("error",err);
            res.redirect("back");
        } else {
            res.render("recipes/index", {
                recipes: recipes
            });
        }
    });

});

// get route to show the form to enter new recipes.
router.get("/new", middleware.isLoggedIn, function (req, res) {

    res.render("recipes/new");
});

//show route. Show more details about the recipes
router.get("/:id", function (req, res) {
    recipe.findById(req.params.id).populate("comments").exec(function (err, recipe) {
        if (err) {
            console.log(err);
            req.flash("error",err);
            res.redirect("back");
        } else {
            res.render("recipes/show", {
                recipe: recipe
            });
        }
    });

});

//post route. Add new recipes to database
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var ingredients = req.body.hiddenIngredient;
    var newrecipe = {
        name : name,
        image : image,
        description : desc,
        author : author,
        ingredients : ingredients
    };

    recipe.create(newrecipe, function (err, newlyAddedrecipe) {
        if (err) {
            console.log(err);
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            req.flash("success","recipe created successfully.");
            res.redirect("/recipes");
        }
    });


});

//Form to Edit recipes
router.get("/:id/edit", middleware.checkRecipeOwnership, (req, res) => {
        recipe.findById(req.params.id, (err, foundrecipe) => {
            res.render("recipes/edit", {
                recipe: foundrecipe
            });
        });
});

//Edit recipes
router.put("/:id", middleware.checkRecipeOwnership,  (req, res) => {
    recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, updatedrecipe) => {
        if (err) {
            console.log(err);
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            req.flash("success","recipe saved successfully.");
            res.redirect("/recipes/" + req.params.id);
        }

    });

});

//Delete recipes
router.delete("/:id", middleware.checkRecipeOwnership, (req, res) => {
    recipe.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            req.flash("success","recipe deleted successfully.");
            res.redirect("/recipes/");
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
// function checkrecipeOwnership(req, res, next) {

//     if (req.isAuthenticated()) {
//         recipe.findById(req.params.id, (err, foundrecipe) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 //Does user own recipe
//                 if (foundrecipe.author.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     //res.send("Cant edit recipes. recipe can be editted only by their owners!");
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