// app/routes.js
var util        = require("util"); 
var fs          = require("fs-extra"); 
var mysql       = require('mysql');
var dbconfig    = require('../config/database');
var connection  = mysql.createConnection(dbconfig.connection);
//var ffmpeg      = require('fluent-ffmpeg');
var ffmpeg      = require('liquid-ffmpeg');

connection.query('USE ' + dbconfig.database);

module.exports = function(app, passport) {

    // // ======== HOME PAGE ========
    app.get('/', function(req, res) {
        res.render('home', {
            user: req.user.username
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
        req.user.activeaccount = "yuppie";
        res.render('account', {
            user : req.user.username, // get the user out of session and pass to template
            status: req.user.membership
        });
    });

    // ======== FILM PAGE ==========
    // Given an id, display the general info of the specific film
    app.get('/film/:id', getFilmInfo, function(req, res){
        res.render('film', {
            user : req.user.username, // get the user out of session and pass to template
            filmId : req.film.id
            //status: req.status
        });
    });

    // ========= UPLOAD FILM PAGE =========
    // This is the form in which will allow the filmmaker to upload a new film
    app.get('/upload', isLoggedIn, isFilmmaker, /*getDraftSession,*/ function(req, res){
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
        updateDraft(req.user.id, null, info);
    });

    // ========= POST UPLOAD =========
    // After everything has been uploaded, finally process the film into db
    app.post('/upload/save', function(req, res){

        //make sure that everything within the draft has been set
        if(typeof req.user.draft != "undefined" &&
            typeof req.user.draft.film != "undefined" &&
            typeof req.user.draft.trailer != "undefined" &&
            typeof req.user.draft.cover != "undefined" &&
            typeof req.user.draft.info != "undefined"){

            //double check all information has been given
            //double check information is valid

            //convert files name to unique names
            //move them to corresponding dirs
            //convert film and trailer to mp4, ogv, and webm files

            //insert info into db
        }

    });

    // ========= POST DELETE DRAFT =========
    // Delete a draft from the db as well as the files saved
    app.post('/delete/draft', function(req, res){

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
                   updateUploadPicInfo(rows[0].filmId, upload);
               }else{
                   updateUploadVideoInfo(rows[0].filmId, upload);
               }
           }

           if(info != null){
               updateFilmInfo(rows[0].filmId, info);
           }
       }
    });
}

function updateFilmInfo(id, info){



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
                //console.log("MP4 format progress ..." + util.inspect(progress));
            })
            .saveToFile("uploads/"+mp4_name+".mp4", function(stdout, stderr) {
                //onSuccess: change status to 0 [upload success]
                console.log("MP4 conversion successful");
                console.log("MP4 attempting to store with status 'upload success'");
                connection.query("UPDATE uploads SET status=0 WHERE name=?", [mp4_name], function(err, rows){
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
                //console.log("OGG format progress ..." + progress);
            })
            .saveToFile("uploads/"+ogv_name+".ogv", function(stdout, stderr) {
                //onSuccess: change status to 0 [upload success]
                console.log("OGG conversion successful");
                console.log("OGG attempting to store with status 'upload success'");
                connection.query("UPDATE uploads SET status=0 WHERE name=?", [ogv_name], function(err, rows){
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
                //console.log("WEBM format progress ..." + progress);
            })
            .saveToFile("uploads/"+webm_name+".webm", function(stdout, stderr) {
                //onSuccess: change status to 0 [upload success]
                console.log("WEBM conversion successful");
                console.log("WEBM attempting to store with status 'upload success'");
                connection.query("UPDATE uploads SET status=0 WHERE name=?", [webm_name], function(err, rows){
                    if(err)
                        throw "Could not store WEBM upload with 'uploading' status.";

                    console.log("WEBM stored with status 'upload success'");
                });
            });
    });
}