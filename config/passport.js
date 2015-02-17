// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql 		= require('mysql');
var bcrypt 		= require('bcrypt-nodejs');
var sha         = require('js-sha512');
var validator   = require('validator');
var dbconfig 	= require('./database');
var connection 	= mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM members WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            emailField: 'email',
            firstnameField: 'firstname',
            lastnameField: 'lastname',
            passwordField : 'password',
            repasswordField: 'repassword',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, email, firstname, lastname, password, repassword, done) {

            //check if email given is a valid email

            if(!validator.isEmail(email)){
                return done(null, false, req.flash('signupMessage', 'Not a valid email.'));
            }

        	//check if the passwords match
        	if(password != repassword){
        		return done(null, false, req.flash('signupMessage', 'Passwords don\'t match.'));
        	}

            //Sanitizer strings
            username = validator.toString(username);
            firstname = validator.toString(firstname);
            lastname = validator.toString(lastname);
            password = validator.toString(password);

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM members WHERE username = ? or email = ?",[username, email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username or email is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var salt = sha(bcrypt.genSaltSync(10));
                    var u = {
                        username: username,
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        //password: bcrypt.hashSync(password, salt),  // use the generateHash function in our user model
                        password: sha(password + salt),  // use the generateHash function in our user model
                        salt: salt
                    };

                    var insertQuery = "INSERT INTO members (first_name, last_name, username, email, password, salt, status) values (?,?,?,?,?,?,?)";

                    connection.query(insertQuery,[u.firstname, u.lastname, u.username, u.email, u.password, u.salt, u.status],function(err, rows) {
                        u.id = rows.insertId;

                        return done(null, u);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with username and password from our form
        	
            var check = "";

            if(validator.isEmail(username)){
                username = validator.toEmail(username);
                check = "email";
            }else{
                username = validator.toString(username);
                check = "username";
            }
            
            password = validator.toString(password);

            connection.query("SELECT * FROM members WHERE " + check + " = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No ' + check + ' found.')); // req.flash is the way to set flashdata using connect-flash
                }
                
                // if the user is found but the password is wrong
                if (sha(password + rows[0].salt) != rows[0].password)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                
                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};