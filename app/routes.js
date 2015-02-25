// app/routes.js
var util        = require("util"); 
var fs          = require("fs-extra"); 
var mysql       = require('mysql');
var dbconfig    = require('../config/database');
var connection  = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(app, passport) {

    // // ======== HOME PAGE ========
    app.get('/', getSessionInfo, function(req, res) {
        res.render('home', {
            user: req.session.username
        });
    });

    // ======== LOGIN PAGE ========
    // show the login form
    app.get('/login', isNotLoggedIn, getSessionInfo, function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the login page if there is an error
            failureFlash : true // allow flash messages
    }));

    // ======== SIGNUP PAGE ========
    // show the signup form
    app.get('/signup', isNotLoggedIn, getSessionInfo, function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
    }));

    // ======== ACCOUNT PAGE ========
    app.get('/account', isLoggedIn, getSessionInfo, function(req, res) {
        res.render('account', {
            user : req.session.username, // get the user out of session and pass to template
            status: req.session.status
        });
    });

    // ======== FILM PAGE ==========
    // Given an id, display the general info of the specific film
    app.get('/film/:id', getFilmInfo, getSessionInfo, function(req, res){
        res.render('film', {
            user : req.session.username, // get the user out of session and pass to template
            filmId : req.film.id,
            //status: req.status
        });
    });

    // ========= UPLOAD FILM PAGE =========
    // This is the form in which will allow the filmmaker to upload a new film
    app.get('/upload', isLoggedIn, getSessionInfo, isFilmmaker, getDraftSession, function(req, res){
        res.render('upload', {
            user : req.session.username, // get the user out of session and pass to template
            status: req.session.status
        });
    });

    // ========= POST UPLOAD FILM FILE =========
    // Process to upload film file
    app.post('/upload/film', function(req, res){
        if (req.files) { 
            console.log(util.inspect(req.session));
            if (req.files.film_file.size === 0) {
                console.log("Film file empty");
            }
            fs.exists(req.files.film_file.path, function(exists) { 
                if(exists) { 
                    console.log("Film Exists!!");
                    if(!isDraftSet()){
                        createEmptyDraftFilm();
                    }
                    req.session.draft.film = req.files.film_file;
                }
            }); 
        } 
    });

    // ========= POST UPLOAD TRAILER FILE =========
    // Process to upload trailer file
    app.post('/upload/trailer', function(req, res){

    });

    // ========= POST UPLOAD COVER ART FILE =========
    // Process to upload cover art file
    app.post('/upload/cover', function(req, res){

    });

    // ========= POST UPLOAD FILM FILE =========
    // Process to upload film file
    app.post('/upload/info', function(req, res){

    });

    // ========= POST UPLOAD =========
    // After everything has been uploaded, finally process the film into db
    app.post('/upload/save', function(req, res){

    });

    // ======== LOGOUT PAGE ========
    app.get('/logout', getSessionInfo, function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// route middleware to make sure a user is not logged in
function isNotLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (!req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/account');
}

function isFilmmaker(req, res, next){

    //check if they are a filmmaker
    if(req.session.status != 0)
        res.redirect('/account');

    next();
}

function getSessionInfo(req, res, next){

    if(typeof req.user != "undefined" && typeof req.user.id != "undefined")
        req.session.id = req.user.id;
    else
        req.session.id = "";

    if(typeof req.user != "undefined" && typeof req.user.username != "undefined")
        req.session.username = req.user.username;
    else
        req.session.username = "";

    if(typeof req.user != "undefined" && typeof req.user.email != "undefined")
        req.session.email = req.user.email;
    else
        req.session.email = "";

    if(typeof req.user != "undefined" && typeof req.user.first_name != "undefined")
        req.session.firstname = req.user.first_name;
    else
        req.session.firstname = "";

    if(typeof req.user != "undefined" && typeof req.user.last_name != "undefined")
        req.session.lastname = req.user.last_name;
    else
        req.session.lastname = "";

    if(typeof req.user != "undefined" && typeof req.user.status != "undefined")
        req.session.status = req.user.status;
    else
        req.session.status = 1;

    req.session.draft = {};
    
    next();
}

function getFilmInfo(req, res, next){

    req.film = {};

    //Not a valid film id was given
    if(req.params.id > 60 || req.params.id < 0){
        res.redirect("/");
    }

    req.film.id = req.params.id;

    next();
}

function isDraftSet(){

    if(typeof req.session != "undefined" && typeof req.session.draft != "undefined" && typeof req.session.draft.id != "undefined"){
        return false;
    }else{
        return true;
    }
}

function getDraftSession(req, res, next){

    //check if there is a draft currently
    if(!isDraftSet()){

        //check if film uploaded
        //check if trailer uploaded
        //check if cover uploaded
        //check for all entries of information have been entered

        connection.query("SELECT * FROM films WHERE filmId = ? AND draft = 1 AND filmmakerId = ?",[req.session.draft.id, req.session.id], function(err, rows){
            if(rows){
                req.session.draft.id = rows[0].filmId;
            }
        });

    }

    next();
}

function createEmptyDraftFilm(){

    connection.query("INSERT INTO films() VALUES()",[], function(err, rows){
        if(rows){
            req.session.draft.id = rows.insertId;
        }
    });
}

function createRandomName(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}