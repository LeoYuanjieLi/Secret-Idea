const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Map global promise - get rid of warnings
mongoose.Promise = global.Promise;

// // Connect to mongoose
// mongoose.connect('mongodb://localhost/secret-idea', {
//     useMongoClient: true
// })
//     .then(() => {console.log("MongoDB is connected!")})
//     .catch((err) => {console.log(`error message: ${err}`)}) 

// import Idea Schema
require('../models/Idea');
const Idea = mongoose.model('ideas');

// -------------------------------------------------------

router.get('/login', (req, res) => {
    res.render("./users/login");
});

router.get('/register', (req, res) => {
    res.render("./users/register");
});

// Register Form POST
router.post('/register', (req, res) => {
    console.log(req.body);
    let errors = [];
    if(req.body.password !== req.body.password2) {
        errors.push({text: "Passwords do not match!"});
    }

    if(req.body.password.length < 8 || req.body.password > 20) {
        errors.push({text: "Invalid password length!"})
    }

    if(errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: "",
            password2: ""
        })
    } else {
        res.send('passed!');
    }
});
// -------------------------------------------------------
// export router

module.exports = router;