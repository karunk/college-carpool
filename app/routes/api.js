var User        = require('../models/usermodel');
var College        = require('../models/collegemodel');

var config      = require('../../config/database');
var jwt         = require('jsonwebtoken');
var nodemailer = require("nodemailer");

var superSecret = config.secret;

module.exports = function(app, express, passport){

    var apiRouter = express.Router();

    apiRouter.route('/')  //---WELCOME MESSAGE-------------------------------------------------------------------------
    .get(function(req, res) {
            res.json('welcome to the api');
        });
//---------------------------------------------------------------------------------------------------

    apiRouter.route('/user-registeration') 
    .post(function(req, res){
        
        var user = new User();

        College.findOne({ collegename: req.body.college }, function(error, college) {
            if (error) res.send(err);    
            if(college == null) res.json({
                message: 'No such college found'
            })
            else{
                    user.college = college._id;
                    user.username   = req.body.username;
                    user.password   = req.body.password;
                    user.email      = req.body.email;
                    user.mobile     = req.body.mobile;
                    user.firstname  = req.body.firstname;
                    user.lastname   = req.body.lastname;
                    user.rollno     = req.body.rollno;  
                    user.save(function(err) {
                        if(err)
                            return res.send(err);
                        else   
                        {
                            college.students.push(user);
                            college.save(function(err){
                                if(err)
                                    return res.send(err);
                                else
                                {
                                    console.log(college,'hello');
                                    return res.send('done');
                                }
                            });
                        }
                    });
            }  
        });   
    });

//---------------------------------------------------------------------------------------------------

    apiRouter.route('/authenticate') //---AUTHENTICATION-----------------------------------------------------------------------


    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    .post(function(req, res) {
        User.findOne({
            username: req.body.username
        }).select('username password email college firstname lastname').exec(function(err, user) {

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
                                college: user.college,
                                firstname: user.firstname,
                                lastname: user.lastname
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
    

    
    apiRouter.route('/college') //-COLLEGE-----------------------------------------------------------------------
    

    //Adding a new college to the database
    .post(function(req, res) {

       College.findOne({collegename: req.body.college}, function(error, college){
        if(error) {
            res.send(error);
            console.log('here');
        }
        else
            {
                if(college == null)
                    {
                        var college = new College();
                        college.collegename = req.body.college;
                        college.save(function(err){
                            if(err) return res.send(err);
                        });
                        res.send('saved!');
                    }
                else
                    res.send(college);
            }
       }); 
    })

    //get list of all colleges
    .get(function(req, res){
        College.find({}, function(err, college){
            if(err)
                res.send('Error getting list of colleges.')
            else
                res.send(college);
        });
    });

    apiRouter.route('/college/:college_id') //GETTING INFO ABOUT A SPECIFIC COLLEGE--------------------------------------------
        

    // get college info with that college id
    .get(function(req, res) {
        College
        .findById(req.params.college_id)
        .populate('students')
        .exec(function(error, info){
            if(error)
                res.send(error);
            else
                res.send(info);
        });
    })

    //updating existing college information
    .put(function(req, res) {
        College
        .findById(req.params.college_id, function(err, college) {
            if (err) 
                return res.send(err);

            // set the new college information if it exists in the request
            if (req.body.collegename) college.collegename = req.body.collegename;
      
            // save the user
            college.save(function(err) {
                if (err) return res.send(err);
                // return a message
                res.json({ message: 'College updated!' });
            });

        });
    })

    //delete college
    .delete(function(req, res) {
        College.
        remove({_id: req.params.college_id},
        function(err, college) {
            console.log(college);
            if (err) return res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });




    apiRouter.route('/user/:user_id') //GETTING INFO ABOUT A SPECIFIC USER--------------------------------------------
    
    // get user info with that user id
    .get(function(req, res) {
        User
        .findById(req.params.user_id)
        .populate('college', 'collegename')
        .exec(function(error, info){
            if(error)
                res.send(error);
            else
                res.send(info);
        });
    })

    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {

            if (err) return res.send(err);

            // set the new user information if it exists in the request
            if (req.body.firstname) user.name    = req.body.firstname;
            if (req.body.lastname) user.name     = req.body.lastname;
            if (req.body.email) user.name        = req.body.email;
            if (req.body.mobile) user.name       = req.body.mobile;
            if (req.body.rollno) user.name       = req.body.rollno;
            if (req.body.password) user.password = req.body.password;

            // save the user
            user.save(function(err) {
                if (err) return res.send(err);

                // return a message
                res.json({ message: 'User updated!' });
            });

        });
    })

    .delete(function(req, res) {
        User.findById(req.params.user_id, function(err, user){
            if(err) return res.send(err);
            //res.send(user.college);
            if(user == null) return res.send('No such user found.');
            College.findById(user.college, function(err, info){
                if(err) res.send(err);

                info.students.pull({_id: req.params.user_id});
                info.save(function(err){
                    if(err) return res.send(err);
                    var tmp = [];
                    for(var i=0; i<user.carpoolers.length; i++)
                    {
                        console.log(user.carpoolers[i]._id);
                        User.findById(user.carpoolers[i]._id, function(err,found_user){
                            if(err) next;
                            else{
                                
                                found_user.carpoolers.pull(req.params.user_id);
                                found_user.save();
                            }
                        })
                    }
                    //res.send('done');
                    User.
                    remove({_id: req.params.user_id},
                    function(err, user){
                        if (err) return res.send(err);
                        res.json({ message: 'Successfully deleted' ,
                                    data: tmp
                                });
                    });
                });
            });
        })
    });


    apiRouter.route('/user/carpool/:user_id') //CARPOOL INFO ABOUT A SPECIFIC USER--------------------------------------------

    //getting the list of carpoolers
    .get(function(req, res){
        User.findById(req.params.user_id)
        .populate('carpoolers' , 'firstname', 'lastname', 'college')
        .exec(function(error, info){
            if(error)
                res.send(error);
            else
                res.send(info);
        });
    })

    //adding / requesting a carpool addition
    .post(function(req, res){
        if(req.body.user_id == req.params.user_id)
            res.send('Cannot add yourself.');
        else{
                User.findById(req.params.user_id, function(err, user1){
                    if(err) return res.send(err);
                    User.findById(req.body.user_id, function(err, user2){
                        if(err) return res.send(err);
                        else{
                                var isInArray1 = user1.carpoolers.some(function(friend){
                                    return friend.equals(req.body.user_id);
                                });
                                var isInArray2 = user2.carpoolers.some(function(friend){
                                    return friend.equals(req.params.user_id);
                                });
                                if(isInArray1 == true || isInArray2 == true){
                                    res.send('They are already carpoolers.');
                                }
                                else{
                                    var isInArray1 = user1.carpool_requests.some(function(friend){
                                        return friend.equals(req.body.user_id);
                                    }); 
                                    var isInArray2 = user2.carpool_requests.some(function(friend){
                                        return friend.equals(req.params.user_id);
                                    });
                                    
                                   
                                            if(req.body.action == 'add_request'){
                                                //adding a request
                                                if(isInArray1 == true && isInArray2 == true)
                                                    res.send('Request already sent.');
                                                else{
                                                        user1.carpool_requests.push({
                                                            _id: req.body.user_id,
                                                            read: false,
                                                            request_sent: true
                                                         });
                                                        user1.save(function(err){
                                                            if(err) res.send(err);
                                                        else{
                                                            user2.carpool_requests.push({
                                                                _id: req.params.user_id,
                                                                read: false,
                                                                request_sent: false
                                                            });
                                                            user2.save(function(err){
                                                                if(err) res.send(err);
                                                                return res.json({
                                                                    data1: user1,
                                                                    data2: user2
                                                                });
                                                            });
                                                        }
                                                    });
                                                }
                                        }
                                        else if(req.body.action == 'add_carpool'){
                                                    //adding carpool
                                                    if(isInArray1==false || isInArray2==false)
                                                        res.send('Request not sent');
                                                    else{
                                                        user1.carpoolers.push({
                                                        _id: req.body.user_id
                                                    });
                                                    user1.carpool_requests.pull(req.body.user_id);
                                                    user1.save(function(err){
                                                        if(err) res.send(err);
                                                        else{
                                                            user2.carpoolers.push({
                                                                _id: req.params.user_id
                                                            });
                                                            user2.carpool_requests.pull(req.params.user_id);
                                                            user2.save(function(err){
                                                                if(err) res.send(err);
                                                                return res.json({
                                                                    data1: user1, 
                                                                    data2: user2
                                                                });
                                                            });
                                                        }
                                                    });
                                                    }
                                       
                                            }                               
                                        
                                    }

                            }                                   
                        });
                        
                });
        }
    })

    .delete(function(req, res){
        User.findById(req.params.user_id, function(err, user1){
            if(err) return res.send(err);
            User.findById(req.body.user_id, function(err, user2){
                if(err) return res.send(err);
                else{
                    if(req.body.action == 'delete_request'){
                        user1.carpool_requests.pull(
                            req.body.user_id);
                        user1.save(function(err){
                            if(err) res.send(err);
                            else{
                                user2.carpool_requests.pull(
                                    req.params.user_id);
                                user2.save(function(err){
                                    if(err) res.send(err);
                                    else
                                        res.json({
                                            data1: user1,
                                            data2: user2
                                        });
                                });
                            }
                        });
                    }
                    else if(req.body.action == 'delete_carpool'){
                        user1.carpoolers.pull(
                            req.body.user_id);
                        user1.save(function(err){
                            if(err) res.send(err);
                            else{
                                user2.carpoolers.pull(
                                    req.params.user_id);
                                user2.save(function(err){
                                    if(err) res.send(err);
                                    else
                                        res.json({
                                            data1: user1,
                                            data2: user2
                                        });
                                });
                            }
                        });
                    }
                }
            });
        })
    });

    apiRouter.route('/users') //GETTING INFO ALL USER & THEIR COLLEGES--------------------------------------------
    // get user info with that user id
    .get(function(req, res) {
        User
        .find({})
        .populate('college', 'collegename')
        .exec(function(error, info){
            if(error)
                res.send(error);
            else
                res.send(info);
        });
    });

    //LOGGED-IN-USER-CONTROL-----------------------------------------------------------------------------------------

    // api endpoint to get BASIC user information
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });

    //NOTIFICATIONS

    // api endpoint to get user information
    apiRouter.post('/sendemail', function(req, res) {

        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'karunk@live.com',
                pass: 'rebelheart1989'
            }
        });

        var emailInfo = {
            from: 'College Carpool <karunk@live.com>', // sender address
            to: req.body.recipient, // comma delimited list of receivers
            subject: req.body.subject,
            html: req.body.emailhtml
            };

        // send mail with defined transport object
        transporter.sendMail(emailInfo, function(error, info){
            if(error){
                console.log(error);
                return res.json({ success: true, message: info.response }); 
            }else{
                console.log('Message sent: ' + info.response);
                console.log(req);
                return res.json({ success: true, message: info.response });  

            }
        });

    });



    return apiRouter;
};










