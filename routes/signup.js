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

	//are you already logged in?
	if(!sess.email){
		redirect('/account');
	}

	res.render("login", { 
		title: 'Express',
		film: filmName,
		i: 0,
		e: '',
		u: ''
	});
});

module.exports = router;
