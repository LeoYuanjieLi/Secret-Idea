const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

const port = 5000;

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


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



app.get('/', baobao, (req, res) => {
    const welcome = "Welcome to Gougou baobao's page!";
    res.render("index", {
        title: welcome
    });
});

app.get('/about', gougou, (req, res) => {
    const baobao = "I am a baobao";
    res.render("about", {
        about: baobao
    });
});

app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);
    console.log("Hello Node.js!");
});