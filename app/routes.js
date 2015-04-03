// app/routes.js
var util        = require("util"); 
var fs          = require("fs");
var fsextra    = require("fs-extra"); 
var mysql       = require('mysql');
var dbconfig    = require('../config/database');
var connection  = mysql.createConnection(dbconfig.connection);
//var ffmpeg      = require('fluent-ffmpeg');
var ffmpeg      = require('liquid-ffmpeg');

connection.query('USE ' + dbconfig.database);

module.exports = function(app, passport) {

    // ======= BETA SIGN UP PAGE =========
    app.get('/beta', function(req, res) {
        res.render('beta', {});
    });

    //store user's email
    app.post('/beta', function(req, res){

        if(typeof req.body.email != "undefined"){
            //insert email into database
            connection.query("INSERT INTO beta(email) VALUES(?)", [req.body.email], function(err, rows){
                if(err)
                    throw "Could not sign up for beta";

                res.render('beta', { success: "1"});
            });
        }
    });

    // ======== HOME PAGE ========
    app.get('/', function(req, res) {

        var user = "";
        if(typeof req.user != "undefined" && typeof req.user.username != "undefined")
            user = req.user.username;

        res.render('home', {
            user: user
        });
    });

    // ======== LOGIN PAGE ========
    // show the login form
    app.get('/login', isNotLoggedIn, function(req, res) {
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
    app.get('/signup', isNotLoggedIn, function(req, res) {
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
    app.get('/account', isLoggedIn, function(req, res) {
        
        //TODO: [Filmmaker] Get list of uploaded films and information
        //TODO: Get list of films purchased
        //TODO: Get list of films currently renting
        //TODO: Get list of films favorited
        //TODO: Get list of films queued
        //TODO: Get list of filmmaker following
        //TODO: Get current settings

        res.render('account', {
            user : req.user.username, // get the user out of session and pass to template
            status: req.user.membership,
            first: req.user.firstname,
            last: req.user.lastname,
            email: req.user.email
        });
    });

    // ======== FILM PAGE ==========
    // Given an id, display the general info of the specific film
    app.get('/film/:id', getFilmInfo, function(req, res){

        //TODO: Query db for film's information

        //TODO: If given film id doesn't exist, redirect to account page

        res.render('film', {
            user : req.user.username, // get the user out of session and pass to template
            filmId : req.film.id
            //status: req.status
        });
    });

    // ========= EDIT LIST ===========
    // Add remove a film from one fo the user's lists
    app.post('/edit/list', function(req, res){
         
    });

    // ========= FILMMAKER PAGE ===========
    // Display a specific filmmaker's account page
    app.get('/filmmaker/:id', getFilmmakerInfo, function(req, res){

        var user = "";
        if(typeof req.user != "undefined" && typeof req.user.username != "undefined")
            user = req.user.username;

        res.render('filmmaker', {
            user: user
        });
    });

    // ========= UPLOAD FILM PAGE =========
    // This is the form in which will allow the filmmaker to upload a new film
    app.get('/upload', isLoggedIn, isFilmmaker, /*getDraftSession,*/ function(req, res){

        //delete any previous drafts
        connection.query("DELETE FROM films WHERE filmmakerId=? AND draft=1", [req.user.id], function(err, rows){});

        res.render('upload', {
            user : req.user.username, // get the user out of session and pass to template
            status: req.user.membership
        });
    });

    // ========= POST UPLOAD FILM FILE =========
    // Process to upload film file
    app.post('/upload/film', function(req, res){
        fs.exists(req.files.film_file.path, function(exists) {
            req.files.film_file.kind = 0;
            updateDraft(req.user.id, req.files.film_file, null);
        });
    });

    // ========= POST UPLOAD TRAILER FILE =========
    // Process to upload trailer file
    app.post('/upload/trailer', function(req, res){
        fs.exists(req.files.film_file.path, function(exists) {
            req.files.trailer_file.kind = 1;
            updateDraft(req.user.id, req.files.trailer_file, null);
        });
    });

    // ========= POST UPLOAD COVER ART FILE =========
    // Process to upload cover art file
    app.post('/upload/cover', function(req, res){
        fs.exists(req.files.film_file.path, function(exists) {
            req.files.cover_file.kind = 2;
            updateDraft(req.user.id, req.files.cover_file, null);
        });
    });

    // ========= POST UPLOAD FILM FILE =========
    // Process to upload film file
    app.post('/upload/info', function(req, res){

        var info = {};
        var errors = {'status':'400'};

        if(typeof req.body != "undefined"){

            if(typeof req.body.title != "undefined"){
                info.title = req.body.title;
            }else{
                errors.title = "No title given.";
            }

            if(typeof req.body.description != "undefined"){
                info.description = req.body.description;
            }else{
                errors.description = "No description.";
            }

            if(typeof req.body.rent_check == "undefined" && req.body.rent_check != "on"){

                if(typeof req.body.rent != "undefined"){
                    var r = parseFloat(req.body.rent);
                    if(!isNaN(r)){
                        info.rent = r;
                    }else{
                        errors.rent = "The rent price not a valid currency value.";
                    }
                }else{
                    errors.rent = "No rent price was given when rent given checked.";
                }
            }else{
                info.rent = null;
            }


            if(typeof req.body.purchase_check == "undefined" && req.body.purchase_check != "on"){

                if(typeof req.body.purchase != "undefined"){

                    var p = parseFloat(req.body.purchase);
                    if(!isNaN(p)){
                        info.purchase = p;
                    }else{
                        errors.purchase = "The rent price not a valid currency value.";
                    }
                }else{
                    errors.purchase = "No purchase price was given when rent given checked.";
                }
            }else{
                info.purchase = null;
            }

            if(info.purchase == null && info.rent == null){
                errors.price = "Give either a rent or purchase price or both.";
            }

            if(typeof req.body.release_date != "undefined"){
                var regex = /\d\d\d\d-\d\d-\d\d/;
                if(req.body.release_date.match(regex)){
                    var d = new Date();
                    var post_date = (d.getYear()+1900) + "-" + (d.getMonth()+1) + "-" + d.getDate();
                    //var exp_date = "";

                    info.release = req.body.release_date;
                    info.post = post_date;
                    //info.exp = exp_date;
                }
            }

            if(typeof req.body.rating != "undefined"){
                info.rating = req.body.rating;
            }else{
                errors.rating = "No content rating was given.";
            }

        }else{
            //handle when request is empty
            errors.body = "There was no information given.";
        }

        //check if any errors where found
        if(typeof errors.body != "undefined" || typeof errors.title != "undefined" ||
            typeof errors.description != "undefined" || typeof errors.rent != "undefined" ||
            typeof errors.purchase != "undefined" || typeof errors.post_date != "undefined" ||
            typeof errors.rating != "undefined"){
            res.end(errors);
        }

        console.log(info);
        updateDraft(req.user.id, null, info);
        //send success response
    });

    // ========= POST UPLOAD =========
    // After everything has been uploaded, finally process the film into db
    app.post('/upload/save', function(req, res){

        //make sure all info has been entered
        //make sure all upload files (film, trailer, and cover art) have been uploaded
        //it's ok if film is still converting to video formats

        //if ok, change film draft status to 0

    });

    // ========= POST DELETE DRAFT =========
    // Delete a draft from the db as well as the files saved
    app.post('/delete/draft', function(req, res){

        //get upload names
        connection.query("SELECT uploads.name, uploads.mime FROM films WHERE filmmakerId=? AND draft=0 INNER JOIN uploads ON uploads.filmId = films.filmId", [req.user.id], function(err, rows){

            //delete files
            for(var i = 0; i < rows.length; i++){
                var path = "uploads/" + rows[i].name + "." + rows[i].mime;
                fs.unlink(path, function(err){});
            }

            //delete data from database
            connection.query("DELETE FROM films WHERE filmmakerId=? AND draft=0", [req.user.id], function(){});
        });
    });    

    // ======== LOGOUT PAGE ========
    app.get('/logout', function(req, res) {
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
    if(req.user.membership != 0)
        res.redirect('/account');

    next();
}

function getFilmInfo(req, res, next){

    req.film = {};

    //Not a valid film id was given
    if(req.params.id > 60 || req.params.id < 0){
        res.redirect("/");
    }

    req.film.id = req.params.id;
    // Query for film info
    // Query to see if the user has purchased, rented, queued, or favorited film

    next();
}

function getFilmmakerInfo(req, res, next){

    req.filmmaker = {};

    //Not a valid filmmaker id was given
    if(req.params.id === 0){
        res.redirect('/');
    }

    req.filmmaker.id = req.params.id;
    // Query for filmmaker info
    // Query to see if user is following filmmaker

    next();
}

function createRandomName(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function updateDraft(filmmakerId, upload, info){

    console.log("Searching database...");
    connection.query("SELECT * FROM films WHERE filmmakerId = ? AND draft = 1", [filmmakerId], function(err, rows){

        if(err)
            throw "Error finding draft.";

       //draft does not exist
       if(rows.length == 0){
           console.log("Searched database with no record");
           //insert draft into table
            connection.query("INSERT INTO films(filmmakerId) VALUE(?)", [filmmakerId], function(err, rows){

                if(err)
                    throw "Error adding draft.";

                console.log("Added new draft");
                if(upload != null){
                    if(upload.kind == 2) {
                        updateUploadPicInfo(rows.insertId, upload);
                    }else{
                        updateUploadVideoInfo(rows.insertId, upload);
                    }
                }

                if(info != null){
                    updateFilmInfo(rows.insertId, info);
                }
            });
       }else{
           console.log("Searched database with record");
           if(upload != null){
               if(upload.kind == 2) {
                   console.log("Updating cover art");
                   updateUploadPicInfo(rows[0].filmId, upload);
               }else{
                   console.log("Updating film or trailer video");
                   updateUploadVideoInfo(rows[0].filmId, upload);
               }
           }

           if(info != null){
               console.log("Updating film info");
               updateFilmInfo(rows[0].filmId, info);
           }
       }
    });
}

function updateFilmInfo(id, info){

    connection.query("UPDATE films SET title=?, rating=?, description=?, rent_price=?, buy_price=?, release_date=?, post_date=? WHERE filmId=?", [info.title, info.rating, info.description, info.rent, info.purchase, info.release, info.post, id], function(err, rows){
        if(err)
            throw "Could not update film's info";

        console.log("Updated film info successfully");
    });
}

function updateUploadPicInfo(id, upload){

    var name = createRandomName();

    connection.query("INSERT INTO uploads(filmId, name, type, mime) VALUES(?, ?, 2, ?)", [id, name, upload.type], function(err, rows) {
        if(err)
            throw "Could not store picture information.";

        console.log("Stored picture in uploads table.");
    });
}

function updateUploadVideoInfo(id, upload){

    //create three random names
    var mp4_name = createRandomName();
    var ogv_name = createRandomName();
    var webm_name = createRandomName();

    //======== Store mp4 file ===========
    //insert into uploads with status 1 [uploading]
    console.log("MP4 attempting to store with status 'uploading'");
    connection.query("INSERT INTO uploads(filmId, name, type, mime, status) VALUES(?, ?, ?, 'mp4', 1)", [id, mp4_name, upload.kind], function(err, rows){

        if(err)
            throw "Could not store MP4 upload with 'uploading' status.";

        console.log("MP4 stored with status 'uploading'");

        console.log("MP4 conversion beginning...");
        var proc_mp4 = new ffmpeg({ source: upload.path, timeout: 10000})
            .withVideoCodec('libx264')
            .withVideoBitrate('1500k')
            .withAudioCodec('libfaac')
            .withAudioBitrate('96k')
            .withSize("640x360")
            .toFormat('mp4')
            .onProgress(function(progress) {
                console.log("MP4 conversion => " + util.inspect(progress.percent) + "%");
            })
            .saveToFile("uploads/"+mp4_name+".mp4", function(stdout, stderr) {
                //onSuccess: change status to 0 [upload success]
                console.log("MP4 conversion successful");
                console.log("MP4 attempting to store with status 'upload success'");
                connection.query("UPDATE uploads SET status=0 WHERE name=? AND filmId=? AND mime='mp4'", [mp4_name, id], function(err, rows){
                    if(err)
                        throw "Could not store mp4 upload with 'uploading' status.";

                    console.log("MP4 stored with status 'upload success'");
                });
            });

        //onError: change status to 2 [fail upload]
    });

    //======== Store ogg file ===========
    //insert into uploads with status 1 [uploading]
    console.log("OGG attempting to store with status 'uploading'");
    connection.query("INSERT INTO uploads(filmId, name, type, mime, status) VALUES(?, ?, ?, 'ogv', 1)", [id, ogv_name, upload.kind], function(err, rows){

        if(err)
            throw "Could not store OGG upload with 'uploading' status.";

        console.log("OGG stored with status 'uploading'");

        console.log("OGG conversion beginning...");
        var proc_ogg = new ffmpeg({ source: upload.path, timeout: 10000 })
            .withVideoCodec('libtheora')
            .withVideoBitrate('1500k')
            .withAudioCodec('libvorbis')
            .withAudioBitrate('96k')
            .withSize("640x360")
            .toFormat('ogg')
            .onProgress(function(progress) {
                console.log("OGG conversion => " + util.inspect(progress.percent) + "%");
            })
            .saveToFile("uploads/"+ogv_name+".ogv", function(stdout, stderr) {
                //onSuccess: change status to 0 [upload success]
                console.log("OGG conversion successful");
                console.log("OGG attempting to store with status 'upload success'");
                connection.query("UPDATE uploads SET status=0 WHERE name=? AND filmId=? AND mime='ogv'", [ogv_name, id], function(err, rows){
                    if(err)
                        throw "Could not store OGG upload with 'uploading' status.";

                    console.log("OGG stored with status 'upload success'");
                });
            });

        //onError: change status to 2 [fail upload]
    });

    //======== Store webm file ===========
    //insert into uploads with status 1 [uploading]
    console.log("WEBM attempting to store with status 'uploading'");
    connection.query("INSERT INTO uploads(filmId, name, type, mime, status) VALUES(?, ?, ?, 'webm', 1)", [id, webm_name, upload.kind], function(err, rows){

        if(err)
            throw "Could not store WEBM upload with 'uploading' status.";

        console.log("WEBM stored with status 'uploading'");

        console.log("WEBM conversion beginning...");
        var proc_webm = new ffmpeg({ source: upload.path, timeout: 10000 })
            .withVideoCodec('libvpx')
            .withVideoBitrate('1500k')
            .withAudioCodec('libvorbis')
            .withAudioBitrate('96k')
            .withSize("640x360")
            .toFormat('webm')
            .onProgress(function(progress) {
                console.log("WEBM conversion => " + util.inspect(progress.percent) + "%");
            })
            .saveToFile("uploads/"+webm_name+".webm", function(stdout, stderr) {
                //onSuccess: change status to 0 [upload success]
                console.log("WEBM conversion successful");
                console.log("WEBM attempting to store with status 'upload success'");
                connection.query("UPDATE uploads SET status=0 WHERE name=? AND filmId=? AND mime='webm'", [webm_name, id], function(err, rows){
                    if(err)
                        throw "Could not store WEBM upload with 'uploading' status.";

                    console.log("WEBM stored with status 'upload success'");
                });
            });
    });
}