var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'exposeyourfilms'
});
connection.connect();

var filmName;
var query = "select title from films where filmId=89";

connection.query(query, function(err, rows, fields){
	if(err) {
		filmName = "N/A";
	} else {
		filmName = rows[0].title;
	}
});

/* GET home page. */
router.get('/', function(req, res, next) {

	sess=req.session;

	//not logged in
	if(!sess.email){
		res.redirect('/');
		username = "";
		email = "";
		id = 0;
	}

	var id = sess.id;
	var username = sess.username;
	var email = sess.email;

	res.render("home", { 
		title: 'Express',
		film: filmName,
		i: id,
		e: email,
		u: username
	});
});

module.exports = router;
