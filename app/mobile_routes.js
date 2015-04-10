// app/routes.js
var util        = require("util"); 
var fs          = require("fs");
var fsextra     = require("fs-extra"); 
var mysql       = require('mysql');
var dbconfig    = require('../config/database');
var connection  = mysql.createConnection(dbconfig.connection);
//var ffmpeg      = require('fluent-ffmpeg');
var ffmpeg      = require('liquid-ffmpeg');

connection.query('USE ' + dbconfig.database);

module.exports = function(app, passport) {

    // ======== SAMPLE POST ==========
    app.post('/sample', function(req, res){
        var json = {"firstname":"John", "lastname":"Smith"};

        //example of making a query
        connection.query("SELECT * FROM films WHERE filmmakerId=?", [req.user.id], function(err, rows){
            res.send('{"success" : "Updated Successfully", "status" : 200}');
        });

        res.send(json);
    });
};