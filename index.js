const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

const port = 5000;

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

// Add Idea Form Route
app.get('/ideas/add',(req, res) => {
    res.render('ideas/add');
});

// Process Form
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
            res.redirect('/ideas');
        })
    }
});

app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
    console.log("Hello Node.js!");
});