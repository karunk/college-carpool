var User        = require('../models/usermodel');
var config      = require('../../config/database');
var jwt         = require('jsonwebtoken');

var superSecret = config.secret;

module.exports = function(app, express, passport){

    var apiRouter = express.Router();

    apiRouter.route('/')  //---WELCOME MESSAGE-------------------------------------------------------------------------
    .get(function(req, res) {
            res.json('welcome to the api');
        });




    apiRouter.route('/authenticate') //---AUTHENTICATION-----------------------------------------------------------------------


    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    .post(function(req, res) {
        User.findOne({
            username: req.body.username
        }).select('username password email college').exec(function(err, user) {

            if (err) throw err;
            
            // no user with that username was found
            if (!user) {
                res.json({ 
                    success: false, 
                    message: 'Authentication failed. User not found.' 
                }); 
            } 
            else if (user) {
                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({ 
                        success: false, 
                        message: 'Authentication failed. Wrong password.' 
                    });
                } 
                else {
                        // if user is found and password is right
                        // create a token
                        var token = jwt.sign(
                            {
                               
                                username: user.username,
                                email: user.email,
                                college: user.college
                            }, 

                            superSecret, 

                            {
                                expiresInMinutes: 1440 // expires in 24 hours
                            } 
                        );

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }   
        }
      });
    });


//---------END OF AUTHENTICATION BLOCK-----------------------------------------------------------------------------------


//------MIDDLEWARE TO CHECK TOKENS ---------------------------------------------------------------------------------------

    // middleware to use for all requests
    apiRouter.use(function(req, res, next) {
        console.log('Somebody just came to our app!');

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, superSecret, function(err, decoded) {      
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });  

                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    next(); // make sure we go to the next routes and don't stop here
                }
            });

      } else {

        // if there is no token
        // return an HTTP response of 403 (access forbidden) and an error message
        return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
        });
        
    }

    });

//----------END OF MIDDLEWARE---------------------------------------------------------------------------------------------
    






//---CREATING A NEW USER & GETTING ALL USER DATA OF ALL USERS -----------------------------------------------------------------

    apiRouter.route('/users') 
    .post(function(req, res) {

        var user = new User();
        user.username   = req.body.username;
        user.password   = req.body.password;
        user.email      = req.body.email;
        user.mobile     = req.body.mobile;
        user.firstname  = req.body.firstname;
        user.lastname   = req.body.lastname;
        user.rollno     = req.body.rollno;
        user.college    = req.body.college;

        user.save(function(err) {
            if (err){
                //duplicate entry
                    console.log(err);
                    return res.send(err);
            }
            res.json({ message: 'User saved!', data: user });
        });
    })

    .get(function(req, res) {

        User.find(function(err, users) {
            if (err)
                return res.send(err);
            res.json(users);
        });
    });

    // api endpoint to get user information
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });

    return apiRouter;
};










