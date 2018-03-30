const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require("connect-flash");
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();


// Map global promise - get rid of warnings
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/secret-idea', {
    useMongoClient: true
})
    .then(() => {console.log("MongoDB is connected!")})
    .catch((err) => {console.log(`error message: ${err}`)}) 

// import Idea Schema
require('./models/Idea');
const Idea = mongoose.model('ideas');

// --------------------------------------------------------
// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//  Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// how middleware works
// app.use('/', sayHello);

// method override middleware
app.use(methodOverride("_method"));

// express-session middleware
app.use(session({
    secret: "bao",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// Global Variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})




// --------------------------------------------------------
function baobao(req, res, next) {
    console.log("I love my baobao at", Date.now());
    next();
};

function gougou(req, res, next) {
    console.log("Baobao love me at", Date.now());
    next();
};


// index.html route
app.get('/', baobao, (req, res) => {
    const welcome = "Welcome to Gougou baobao's page!";
    res.render("index", {
        title: welcome
    });
});

// about route
app.get('/about', gougou, (req, res) => {
    const baobao = "I am a baobao";
    res.render("about", {
        about: baobao
    });
});


// Idea Route
app.get('/ideas', (req, res) => {
    console.log("successful connect to /ideas route.")
    Idea.find({})
    .sort({date:'desc'})
    .then( ideas => {
        res.render( 'ideas/index', {
            ideas: ideas 
        });
    });
});


// Add Idea Form Route
app.get('/ideas/add',(req, res) => {
    res.render('ideas/add');
});

// Edit Idea Form Route
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .catch(err => {
        console.log("err found, reason:", err);
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    })

});


// Post an Idea - Process Form
app.post('/ideas', (req, res) => {
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
app.put('/ideas/:id', (req, res) => {
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
app.delete('/ideas/:id', (req, res) => {
    console.log("Idea number", req.params.id, "got deleted");
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Idea deleted succesfully');
        res.redirect('/ideas');
    });
})

const port = 5000;

app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
    console.log("Hello Node.js!");
});