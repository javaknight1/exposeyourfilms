// app/routes.js
module.exports = function(app, passport) {

    // ======== HOME PAGE ========
    app.get('/', getSessionInfo, function(req, res) {
        res.render('home', {
            user: req.username
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
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

/*    // process the login form
    app.post('/signin', function(req, res){
        var ret = "";
        console.log("Submitted a login form.");
        console.log("Username: " + req.body.user);
        console.log("Password: " + req.body.password);
        var query = "SELECT id, email, username, password, salt, status FROM members WHERE username = '" + req.body.user + "' OR email = '" + req.body.user + "' LIMIT 1";
        console.log("Query: " + query);

        connection.query(query, function(err, rows, fields){
          var id = rows[0].id;
          var email = rows[0].email;
          var username = rows[0].username;
          var password = rows[0].password;
          var salt = rows[0].salt;
          var membership = rows[0].status;

          if(err) {
            // Error in database call
            ret = '{"status": 201, "error": "' + err + '"}';
            res.end(ret);
          } else if (rows.length == 0){
            // This isn't an account with that username or email
            ret = '{"status": 202, "error": "Username or email doesn\'t exist. Try Again."}';
            res.end(ret);
          } else {
            //check if it's trying to be brute forced
            var now = time.time();
            var valid_attempts = now - (2 * 60 * 60);
            var brute_query = "SELECT time FROM login_attempts WHERE user_id = '" + id + "' AND time > '" + valid_attempts + "'";
            connection.query(brute_query, function(err, rows, fields){
                if(rows.length > 5){
                    //account is trying to be brute forced
                    //send no response back
                    //ret = '{"status": 204, "error": "Account is being brute forced."}';
                    ret = '{"status": 204, "error": "Brute Force Attack"}';
                    res.end(ret);
                }else if(password == sha(req.body.password + salt)){
                    //password is right; success in login attempt
                    ret = '{"status": 200}';
                    
                    //set session data
                    sess = req.session;
                    sess.id = id;
                    sess.username = username;
                    sess.email = email;
                    sess.membership = membership;
                    sess.login = sha(req.body.password + req.headers['user-agent']);

                    //res.end(ret);
                    res.redirect('/');
                }else{
                    //wrong password entered
                    ret = '{"status": 203, "error": "Wrong Password. Try Again."}';
                    res.end(ret);
                    //record attempt to determine brute forces
                    var record_query = "INSERT INTO login_attempts(user_id, time) VALUES ('" + id + "', '" + now + "')";
                      connection.query(record_query, function(err, rows, fields){ 
                      console.log("Invalid password on " + id + ". Attemptted on " + now + ".");
                    });
                }
            });
        }
    });*/

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // ======== ACCOUNT PAGE ========
    app.get('/account', isLoggedIn, getSessionInfo, function(req, res) {
        res.render('home', {
            user : req.username // get the user out of session and pass to template
        });
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

function getSessionInfo(req, res, next){

    if(typeof req.user != "undefined" && typeof req.user.id != "undefined")
        req.id = req.user.id;
    else
        req.id = "";

    if(typeof req.user != "undefined" && typeof req.user.username != "undefined")
        req.username = req.user.username;
    else
        req.username = "";

    if(typeof req.user != "undefined" && typeof req.user.email != "undefined")
        req.email = req.user.email;
    else
        req.email = "";

    if(typeof req.user != "undefined" && typeof req.user.firstname != "undefined")
        req.firstname = req.user.firstname;
    else
        req.firstname = "";

    if(typeof req.user != "undefined" && typeof req.user.lastname != "undefined")
        req.lastname = req.user.lastname;
    else
        req.lastname = "";

    return next();
}