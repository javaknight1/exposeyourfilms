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
        }));

    // ======== ACCOUNT PAGE ========
    app.get('/account', isLoggedIn, getSessionInfo, function(req, res) {
        res.render('account', {
            user : req.username, // get the user out of session and pass to template
            status: req.status
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

    if(typeof req.user != "undefined" && typeof req.user.status != "undefined")
        req.status = req.user.status;
    else
        req.status = 1;
    
    return next();
}