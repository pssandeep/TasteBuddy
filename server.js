var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

//Schemas Required
var recipe = require("./models/recipe");
var Comment = require("./models/comment");
var User = require("./models/user");
var Ingredient = require("./models/grocery");

//Routes Required
var recipeRoutes = require("./routes/recipes");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

//BodyParser
var urlencodedParser = bodyParser.urlencoded({
  extended: true
});
app.use(urlencodedParser);

//View Engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//Connect to MongoDB
mongoose.connect("mongodb://localhost/tastebuddy");

//Call the Seed Function to populate the refresh the database.
// seedDB();

// Passport Configuration
app.use(
  require("express-session")({
    secret: "a",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//User Method-Override
app.use(methodOverride("_method"));
//Using connect flash
app.use(flash());

//Middleware to include req.user in all pages
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//Routes
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);
app.use(indexRoutes);

//server port listening at Port 3000
app.listen("3000", () => console.log("TasteBuddy Server started on Port #3000"));
