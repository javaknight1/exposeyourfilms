// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql 		= require('mysql');
var bcrypt 		= require('bcrypt-nodejs');
var sha         = require('js-sha512');
var validator   = require('validator');
var dbconfig 	= require('./database');
var time		= require('time');
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
    	console.log("USER: " + user.id);
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
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            //Sanitizer strings
        	email = req.body.email;
            username = validator.toString(username);
            firstname = validator.toString(req.body.firstname);
            lastname = validator.toString(req.body.lastname);
            password = validator.toString(password);
            repassword = validator.toString(req.body.repassword);
            status = validator.toInt(req.body.status);
            
            //check if email given is a valid email
            if(!validator.isEmail(email)){
                return done(null, false, req.flash('signupMessage', 'Not a valid email.'));
            }
        	
        	//check if the passwords match
        	if(password != repassword){
        		return done(null, false, req.flash('signupMessage', 'Passwords don\'t match.'));
        	}
        	
        	//check if it gave a valid membership value
        	if(!(status == 1 || status == 0)){
        		return done(null, false, req.flash('signupMessage', 'Invalid membership given.'));
        	}

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
                        salt: salt,
                        status: status
                    };
                    
                    var insertQuery = "INSERT INTO members (first_name, last_name, username, email, password, salt, status) values (?,?,?,?,?,?,?)";
                    connection.query(insertQuery,[u.firstname, u.lastname, u.username, u.email, u.password, u.salt, u.status],function(err, rows) {
                        
                    	if(err){
                    		console.log("Failed: Insert user");
                    		console.log("SQL Error: " + err);
                    		return done(err);
                        }
                    		
                    	u.id = rows.insertId;
                    	
                        //remove sensitive data
                        delete u["password"];
                        delete u["salt"];
                        
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
                                
                var u = {
                		id: rows[0].id,
                        username: rows[0].username,
                        email: rows[0].email,
                        firstname: rows[0].firstname,
                        lastname: rows[0].lastname,
                        password: rows[0].password,
                        salt: rows[0].salt,
                        status: rows[0].status
                };
                
                //check if it's trying to be brute forced
                var now = time.time();
                var valid_attempts = now - (2 * 60 * 60);
                var brute_query = "SELECT time FROM login_attempts WHERE user_id = " + u.id + " AND time > " + valid_attempts + "";
                connection.query(brute_query, function(err, rows, fields){
                	
                	if(rows.length > 5){
                        //account is trying to be brute forced
                		console.log("Account id " + u.id + " is being brute forced.");
                		//TODO: Somehow record this and report, by email, to the user to change password.
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                	
                	// if the user is found but the password is wrong
                    if (sha(password + u.salt) != u.password){
                    	//record attempt to determine brute forces
                        connection.query("INSERT INTO login_attempts(user_id, time) VALUES ('" + u.id + "', '" + now + "')", null);
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    }
                    //remove sensitive data
                    delete u["password"];
                    delete u["salt"];
                                        
                    // all is well, return successful user
                    return done(null, u);
                });
            });
        })
    );
};