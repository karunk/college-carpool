

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
    apiRouter.route('/college')
    //get list of all colleges
    .get(function(req, res){
        College.find({}, function(err, college){
            if(err)
                res.send('Error getting list of colleges.')
            else
                res.send(college);
        }).select('collegename');
    });
    apiRouter.route('/isthere/email')
    .post(function(req, res){
        User.find({email: req.body.email}, function(err, data){
            console.log(req.body.email);
            if(data.length){
                res.json({
                    success: false
                });
            }
            else{
                res.json({
                    success: true
                });
            }
        })

    });
    apiRouter.route('/isthere/username')
    .post(function(req, res){
        User.find({username: req.body.username}, function(err, data){
            console.log(req.body.username);
            if(data.length){
                res.json({
                    success: false
                });
            }
            else{
                res.json({
                    success: true
                });
            }
        })

    });
    apiRouter.route('/isthere/mobile')
    .post(function(req, res){
        User.find({mobile: req.body.mobile}, function(err, data){
            if(data.length){
                res.json({
                    success: false
                });
            }
            else{
                res.json({
                    success: true
                });
            }
        })

    });
    apiRouter.route('/isthere/college-rollno')
    .post(function(req, res){
        console.log(req,res);
        User.find({rollno: req.body.rollno,
                   college: req.body.college_id}, function(err, data){
            if(data.length){
                res.json({
                    success: false
                });
            }
            else{
                res.json({
                    success: true
                });
            }
        })

    });
    apiRouter.route('/find-geo-near')
    .post(function(req, res){
        var distance = 1000 / 6371;

        var query = User.find({geo: {
            $near: [
                req.body.lat,
                req.body.lng
            ],
            $maxDistance: distance
        }});
        query.exec(function(err, result){
            if(err){
                console.log(err);
                throw err;
            }
            if(!result){
                res.json({});
            } else{
                console.log('Found :'+ result);
                res.json(result);
            }
        })
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
                    console.log(req.body);
                    // get coordinates [ <longitude> , <latitude> ]
                    user.college        = college._id;
                    user.username       = req.body.username;
                    user.password       = req.body.password;
                    user.email          = req.body.email;
                    user.mobile         = req.body.mobile;
                    user.firstname      = req.body.firstname;
                    user.lastname       = req.body.lastname;
                    user.rollno         = req.body.rollno; 
                    user.geo            = [req.body.lng, req.body.lat]; 
                    user.vehicleCapacity= req.body.vehicleCapacity;
                    user.isVehicleOwner = req.body.isVehicleOwner;

                    user.save(function(err) {
                        if(err)
                            return res.send(err);
                        else   
                        {
                            college.students.push(user);
                            college.save(function(err){
                                if(err)
                                    return res.json({
                                        success: false,
                                        error: err
                                    });
                                else
                                {
                                    var token = jwt.sign(
                                        {
                                           
                                            username : user.username,
                                            email    : user.email,
                                            firstname: user.firstname,
                                        }, 
                                        superSecret, 

                                        {
                                            expiresInMinutes: 1440 // expires in 24 hours
                                        } 
                                    );
                                    res.json({
                                        success: true,
                                        message: 'Verification token',
                                        token: token
                                    });
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
        }).select('username password email college firstname lastname isVerified _id').exec(function(err, user) {

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
                                if(user.isVerified){
                                var token = jwt.sign(
                                    {
                                       
                                        username: user.username,
                                        email: user.email,
                                        college: user.college,
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        user_id: user._id
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
                        else
                            res.json({
                                success: false,
                                message: 'Account has not been verified yet.'
                            })
                }   
        }
      });
    });


    // api endpoint to get user information
    apiRouter.post('/sendemail', function(req, res) {
        console.log(req.body);
        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: '**blocked**',
                pass: '**blocked**'
            }
        });

        var emailInfo = {
            from: '**blocked**', // sender address
            to: req.body.recipient, // comma delimited list of receivers
            subject: req.body.subject,
            html: req.body.emailhtml
            };


        // send mail with defined transport object
        transporter.sendMail(emailInfo, function(error, info){
            if(error){
                console.log(error);
                return res.json({ success: false, message: info }); 
            }else{
                console.log('Message sent: ' + info.response);
                console.log(req);
                return res.json({ success: true, message: info.response });  

            }
        });

    });

    apiRouter.post('/verify', function(req, res){
        if(req.body.token){
            jwt.verify(req.body.token, superSecret, function(err, decoded){
                if(err){
                    return res.json({ success: false, message: 'Token expired.' });  
                } else{
                    User.findOne({ username : decoded.username}, function(error, user){
                        if(error){
                            return res.json({ success: false, message: 'User not found!' }); 
                        } else {
                            console.log(user);
                            user.isVerified = true;
                            user.save(function(error){
                                if(error) res.json({ success: false, message: 'Error verifying user.'});
                                else res.json({success: true, message: 'Verification complete! Please login again.', data: user});
                            })
                        }
                    });
                }
            });
        }
    });

//---------END OF AUTHENTICATION BLOCK-----------------------------------------------------------------------------------
    apiRouter.route('/create-college') //-COLLEGE-----------------------------------------------------------------------
    

    //Adding a new college to the database
    .post(function(req, res) {
        console.log(req.body);
       College.findOne({collegename: req.body.collegename}, function(error, college){
        console.log('$',college);
        if(error) {
            res.send(error);
            console.log('here');
        }
        else
            {
                if(college == null)
                    {
                        var college = new College();
                        college.collegename = req.body.collegename;
                        college.geo        = [req.body.lng, req.body.lat]; 
                        college.save(function(err){
                            if(err) return res.send(err);
                            else res.send(college);
                        });
                    }
                else
                    res.send(college);
            }
       }); 
    })
    .get(function(req, res){
        College.find({}, function(error, colleges){
            if(error)
                res.send(error);
            else
                res.send(colleges);
        })
    });

//------MIDDLEWARE TO CHECK TOKENS ---------------------------------------------------------------------------------------

    // middleware to use for all requests
    apiRouter.use(function(req, res, next) {
        console.log('Somebody just came to our app!');

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.body.admin;

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
        .populate('college')
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


    apiRouter.route('/user/carpool/requestlist') // GETTING PENDING REQUEST LIST OF LOGGED IN USER -----------------------------
    .post(function(req, res){
        User.findById(req.body.user_id, function(err, userdata){
            if(err) return res.send(err);
            else{
                return res.json({
                    requests: userdata.carpool_requests
                });
            }
        });
    });

    apiRouter.route('/user/carpool/carpoolerlist') // GETTING CARPOOLER LIST OF LOGGED IN USER -----------------------------
    .post(function(req, res){
        User.findById(req.body.user_id, function(err, userdata){
            if(err) return res.send(err);
            else{
                return res.json({
                    carpooler_list: userdata.carpoolers
                });
            }
        });
    }); 



    apiRouter.route('/user/carpool/:user_id') //CARPOOL INFO ABOUT A SPECIFIC USER--------------------------------------------

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
                                                            //user1 recieves request
                                                            _id: req.body.user_id,
                                                            read: false,
                                                            request_sent: false
                                                         });
                                                        user1.save(function(err){
                                                            if(err) res.send(err);
                                                        else{
                                                            user2.carpool_requests.push({
                                                                //user2 has sent request
                                                                _id: req.params.user_id,
                                                                read: false,
                                                                request_sent: true
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

    .put(function(req, res){
        console.log('here to del carpool')
        console.log(req.body.action, req.body.user_id)
        User.findById(req.params.user_id, function(err, user1){
            console.log('here to del carpool step1')
            if(err) return res.send(err);
            User.findById(req.body.user_id, function(err, user2){
                console.log('here to del carpool step2')
                if(err) return res.send(err);
                else{
                    console.log('here to del carpool step3')
                    if(req.body.action == 'delete_request'){
                         console.log('here to del carpool wrong')
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
                        console.log('here to del carpool step4')
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
                     console.log('going', req.body.action, req.body.user_id)
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

    apiRouter.route('/users-lim') //GETTING INFO ALL USER LIMITED INFO--------------------------------------------
    // get user info with that user id
    .get(function(req, res) {
        User
        .find({})
        .exec(function(error, info){
            if(error)
                res.send(error);
            else
                res.send(info);
        });
    });


    //GEOLOCATION API-----------------------------------------------------
    apiRouter.route('/geo/inradius')
    .post(function(req, res){

        var maxDistance = req.body.distance;
        maxDistance /= 6371;
        var coords = [];
        coords[0] = req.body.longitude;
        coords[1] = req.body.latitude;

        // find a location
        User.find({
            geo: {
                $geoWithin: {
                    $centerSphere: [coords, maxDistance]
                }
            }
        }).exec(function(err, locations) {
            if (err) {
                return res.json(500, err);
            }
            res.json(200, locations);
        });
    });

    apiRouter.route('/geo/distance')
    .post(function(req, res){
        User.collection.geoNear(
            [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
            {spherical: true, maxDistance: parseFloat(req.body.distance)/6371,distanceMultiplier: 6371.0},
            function(error, results, stats){

                res.json(200, results);
            }
        )
    })

    //LOGGED-IN-USER-CONTROL-----------------------------------------------------------------------------------------

    // api endpoint to get BASIC user information
    apiRouter.get('/me', function(req, res) {
        
        res.send(req.decoded);
    });

    //NOTIFICATIONS


    return apiRouter;
};










