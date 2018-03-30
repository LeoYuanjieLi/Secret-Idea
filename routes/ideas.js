const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Map global promise - get rid of warnings
mongoose.Promise = global.Promise;

// // Connect to mongoose
mongoose.connect('mongodb://localhost/secret-idea', {
    useMongoClient: true
})
    .then(() => {console.log("MongoDB is connected!")})
    .catch((err) => {console.log(`error message: ${err}`)}) 

// import Idea Schema
require('../models/Idea');
const Idea = mongoose.model('ideas');

// -------------------------------------------------------

// Idea Route
router.get('/', (req, res) => {
    console.log("successful connect to /ideas route.");
    Idea.find({})
    .sort({date:'desc'})
    .then( ideas => {
        res.render( './ideas/index', {
            ideas: ideas 
        })       
    });
});



// Add Idea Form Route
router.get('/add',(req, res) => {
    res.render('./ideas/add');
});

// Edit Idea Form Route
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .catch(err => {
        console.log("err found, reason:", err);
    })
    .then(idea => {
        res.render('./ideas/edit', {
            idea: idea
        });
    })

});


// Post an Idea - Process Form
router.post('/', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({text: 'Please add a title'});

    }

    if (!req.body.details) {
        errors.push({text: "text: Please add some details"});
    }

    if(errors.length > 0) {
        res.render('ideas/add', {
            // we have access to errros
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        // console.log(req.body);
        // res.send('successfully sent.');
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }

        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg', 'Idea added succesfully');
            res.redirect('/ideas');
        })
    }
});

// Edit an idea
router.put('/:id', (req, res) => {
    console.log("req.params are:", req.params);
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.date = Date.now();

        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Idea edited succesfully');
            res.redirect('/ideas');
        })
    });
});

// Delete an idea
router.delete('/:id', (req, res) => {
    console.log("Idea number", req.params.id, "got deleted");
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Idea deleted succesfully');
        res.redirect('/ideas');
    });
})


module.exports = router;