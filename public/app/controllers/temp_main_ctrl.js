var app = angular.module('mainCtrl', ['lService','formService','dashService','ngAnimate'])

    


app.controller('homeController', function($scope, $rootScope, $location, Auth, $state, geolocation, $timeout, locService) {
    
//HOME-PAGE CONTROLLER ------------------------------------------------------------------------------------------

    var vm = this;
    console.log(locService.dataObj);
    //Color Scheme Class------------------------

        $scope.pageClass = 'page-home-low';
        $scope.everythingReady = false;
    //-----------------------------------------

    //-----MORPHING MODALS------------------------------

        $scope.example1 = {
            closeEl: '.close',
            modal: {
              templateUrl: 'app/views/pages/login.html'
            }
        };



    //----------------------------------------------------



    // Geolocation Functions
    // ----------------------------------------------------------------------------

        var markers = [];
        var infoWindow = {};
        function setMarker(map, position, title) {
                var marker;
                var markerOptions = {
                    position: position,
                    map: map,
                    title: title,
                    icon: {
                            path: fontawesome.markers.MAP_MARKER,
                            scale: 0.6,
                            strokeWeight: 0.2,
                            strokeColor: 'black',
                            strokeOpacity: 1,
                            fillColor: 'white',
                            fillOpacity: 1,
                        }
                    };

                marker = new google.maps.Marker(markerOptions);
                markers.push(marker); // add marker to array
                
                google.maps.event.addListener(marker, 'mouseover', function () {
                    // create new window
                    var infoWindowOptions = {
                        content:  $scope.address
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
                google.maps.event.addListener(marker, 'mouseout', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                });
        }

        function initialize() {
            var latlng = new google.maps.LatLng($scope.coords.lat, $scope.coords.lng);

            if(locService.dataObj.ready == false){
                $scope.address = "This position was detected by HTML5 Geolocation."
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': latlng }, function (results, status){
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log('PLACES API HIT');
                            if (results[1]) {
                                console.log(results[1]);
                                $scope.address = results[1].formatted_address;
                                locService.dataObj.address = results[1].formatted_address;
                                locService.dataObj.ready = true;
                                console.log( $scope.address);
                            } else {
                                console.log('Location not found');
                            }
                        } 
                    else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
            }
            else
                $scope.address = locService.dataObj.address;





            var myOptions = {
                zoom: 14,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                draggable: false,
                zoomControl: false,
                scrollwheel: false, 
                disableDoubleClickZoom: true,
                disableDefaultUI: true,
                styles: [{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20},{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2},{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"color":"#6a6a6a"}]},{"featureType":"landscape.man_made","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#6a6a6a"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0f252e"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]}]
            };
            var map = new google.maps.Map(document.getElementById("map_canvas_front_page"),
                    myOptions);
            setMarker(map, latlng, 'Are you here? HTML5 Says you are here..');
        }

        function get_location(){
            if(locService.dataObj.ready == false){
                geolocation.getLocation().then(function(data){
                    $scope.coords = {lat:data.coords.latitude, lng:data.coords.longitude};
                    console.log('GEOLOCATION API HIT', $scope.coords);
                    locService.dataObj.coords = {lat:data.coords.latitude, lng:data.coords.longitude};
                    initialize();
                }); 
            }
            else
                {
                    $scope.coords = locService.dataObj.coords;
                    initialize(); 
                    
                }   
        }

        function control_main(){
            console.log('gaga');
                $timeout(get_location);
        }

        //google.maps.event.addDomListener(window, 'load', control_main); 
        control_main();

    //RE-RENDERING MAP-----------------------------------

        $scope.currentstate = "home-low";

        $rootScope.$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams){
            $scope.currentstate = toState.name;
            console.log($scope.currentstate);
            if($scope.currentstate == "home-low") 
                control_main();
        });




    //-----------------------------------------------------

    //AUTHENTICATION CONTROL ----------------------------


        vm.college = "COLLEGE";
        vm.loggedIn = Auth.isLoggedIn();

        if(vm.loggedIn){
            console.log('in here');
            Auth.getUser()
                .success(function(data){
                    console.log(data);
                    vm.college = data.college;
                    vm.firstname = data.firstname;
                });
        }

        vm.doLogin = function() {
            vm.processing = true;

            // clear the error
            vm.error = '';

            Auth.login(vm.loginData.username, vm.loginData.password)
                .success(function(data) {
                    vm.processing = false;          
                    // if a user successfully logs in, redirect to users page
                    if (data.success)           
                        $location.path('/user/map');
                    else 
                        vm.error = data.message;           
                });
        };

        vm.doLogout = function() {
            
            vm.processing = true;

            Auth.logout();
            
            
            $location.path('/');
            $state.go($state.current, {}, {reload: true});
        };

    //---------------------------------------------------------------
    $timeout(function() {
        $state.everythingReady = true;
        console.log($state.everythingReady);
    });
    
});




app.controller('formController', function($scope, $http, geolocation, $rootScope, $window, $timeout, locService, Form, myModal, sharedProperties, ngProgressFactory){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    var vm = this;
    $scope.formData = {};
    $scope.formData.vcapacity = 0;
    $scope.formData.type = 0; 
    $scope.ferror = {};
    $scope.streetaddress_ok = false;
    $scope.formData.CaptchaControl = "";
    var map;
    var marker;
    var geocoder = new google.maps.Geocoder;
    $scope.currentstate = "1"
    $scope.pageClass = 'page-form';



    // Functions
    // ----------------------------------------------------------------------------
        function initialize() {
        var latlng = new google.maps.LatLng($scope.formData.coords.lat, $scope.formData.coords.lng);
        var myOptions = {
            zoom: 18,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
                myOptions);
        setMarker(map, latlng, 'London', 'Just some content');
    }


    function setMarker(map, position, title, content) {
                var markerOptions = {
                    position: position,
                    map: map,
                    title: title,
                    icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                };

                marker = new google.maps.Marker(markerOptions);
            }

     $scope.$watch($scope.formData);
        function initialize2() {
            // Set default initial coordinates to the center of the US
            if(locService.dataObj.ready == false){
                console.log('here');
                    if(locService.dataObj.ready == false){
                        geolocation.getLocation().then(function(data){
                            $scope.formData.coords = {lat:data.coords.latitude, lng:data.coords.longitude};
                            console.log('GEOLOCATION API HIT', $scope.coords);
                            locService.dataObj.coords = {lat:data.coords.latitude, lng:data.coords.longitude};
                    var latlng = new google.maps.LatLng($scope.formData.coords.lat, $scope.formData.coords.lng);
                    map.setCenter(latlng);

                        }); 
                $scope.formData.coords = {
                    lat: 39.500,
                    lng: -98.350
                }      
            }}
            else
                {
                    $scope.formData.coords = locService.dataObj.coords;
                    $scope.formData.address = locService.dataObj.address;
                    $scope.streetaddress_ok = true;
                }
        initialize();
        var input = document.getElementById('searchTextField');
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();

            $scope.formData.coords.lat = place.geometry.location.lat();
            $scope.formData.coords.lng = place.geometry.location.lng();
            var latlng = new google.maps.LatLng($scope.formData.coords.lat, $scope.formData.coords.lng);
            map.setCenter(latlng);
        });
        google.maps.event.addListener(map, 'click', function(e) {
                //alert(e.latLng());
                $scope.streetaddress_ok = false;
                $scope.formData.streetaddress = "";
                $scope.$apply();
                console.log(e.latLng);
                var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
                marker.setPosition(latlng);

                geocoder.geocode({'location': latlng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            console.log(results[1].formatted_address);
                            $scope.formData.streetaddress = results[1].formatted_address;
                            $scope.streetaddress_ok = true;
                            $scope.$apply();
                            console.log($scope,'2');
                        } 
                        else {
                        console.log('No results found');
                        }
                        } 
                        else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });

        });
        console.log($scope,'2');
        
    }

    function control_main(){
        if($scope.currentstate == "1" || $scope.currentstate == "form.profile")
        {
            $timeout(initialize2);
        }
    }


    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
        console.log(toState.name,"statechange"); 
        $scope.currentstate = toState.name;
        control_main();
    });

    $scope.$watch('$scope.currentstate', control_main);
    $scope.vehicle_capacity = [1,2,3,4,5,6,7];
    $scope.college_names = [];
    college_idMap = {};
    vm.dropdownlistFill = function(){
        vm.processing = true;
        Form.get_college_name()
            .success(function(data){
                vm.processing = false;
                for(i=0; i<data.length; i++){
                    $scope.college_names.push(data[i].collegename);
                    college_idMap[data[i].collegename] = data[i]._id;
                }
            })
    }();
    $scope.check_email = 0;
    $scope.email_validation = function(){
        if($scope.formData.contact.email){
            vm.processing = true;
            Form.validate_email($scope.formData.contact.email)
                .success(function(data){
                    console.log(data.success);
                    if(!data.success)
                        {
                            $scope.check_email = 1;
                            $scope.email_error = "The email is already registered."
                        }
                    else
                        {
                            $scope.check_email = -1;
                            $scope.email_error = "";
                        }
                })
        }
    };
    $scope.check_username = 0;
    $scope.username_validation = function(){
        if($scope.formData.username){
            vm.processing = true;
            Form.validate_username($scope.formData.username)
                .success(function(data){
                    console.log(data.success);
                    if(!data.success)
                        {
                            $scope.check_username = 1;
                            $scope.username_error = "The username already exists."
                        }
                    else
                        {
                            $scope.check_username = -1;
                            $scope.username_error = "";
                        }
                })
        }
    };
    $scope.check_mobile = 0;
    $scope.mobile_validation = function(){
        if($scope.formData.contact.mobile && $scope.formData.contact.mobile.length>=9){
            vm.processing = true;
            Form.validate_mobile($scope.formData.contact.mobile)
                .success(function(data){
                    if(!data.success)
                        {
                            $scope.check_mobile = 1;
                            $scope.mobile_error = "The mobile number is already registered."
                        }
                    else
                        {
                            $scope.check_mobile = -1;
                            $scope.mobile_error = "";
                        }
                })
        }
        else{
            $scope.check_mobile = 1;
            $scope.mobile_error = "The mobile number is too short."
        }
    };
    $scope.final_check = {};
    $scope.final_check._1 = false;
    $scope.final_check._2 = false;


    function final_check(){
        console.log($scope);
        if($scope.check_rollno == -1 && $scope.check_password == -1 && $scope.formData.name.first
             && $scope.formData.coords && $scope.formData.contact.mobile 
            && $scope.formData.contact.email)
                $scope.final_check._1 = true;
    }

    $scope.check_rollno = 0;
    $scope.rollno_validation = function(){
        if($scope.formData.college.rollno && $scope.formData.college.name){
            vm.processing = true;
            Form.validate_rollno($scope.formData.college.rollno, college_idMap[$scope.formData.college.name])
                .success(function(data){
                    console.log(data,$scope.formData.college.rollno,college_idMap[$scope.formData.college.name]);
                    if(!data.success)
                        {
                            $scope.check_rollno = 1;
                            $scope.rollno_error = "The college id you enteted is already registered for your college."
                        }
                    else
                        {
                            $scope.check_rollno = -1;
                            $scope.mobile_error = "";
                            final_check();
                        }
                })
        }
    };
    $scope.setString = function(newValue1, newValue2) {
        $scope.objectValue = sharedProperties.getObject();
        $scope.objectValue.data1 = newValue1;
        $scope.objectValue.data2 = newValue2;
    };
    $scope.check_password = 0;
    $scope.password_error = "";
    $scope.password_validation = function(){
        if($scope.formData.password.length<6)
        {
            $scope.password_error = "Password should be atleast 6 characters long."
            $scope.check_password = 1;
        }
        else
        {
             var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
             if(re.test($scope.formData.password))
             {
                $scope.check_password = -1;
                $scope.password_error = ""
                final_check();
            }
            else
            {
                $scope.check_password = 1;
                $scope.password_error = "Include least one number, one lowercase and one uppercase letter."
            }

        }
    };
    $scope.type_validation = function(){
        final_check();
    };
    $scope.name_validation = function(){
        final_check();
    };
    $scope.submit = function(){
        if($scope.final_check._1){
           $scope.progressbar = ngProgressFactory.createInstance();
           $scope.progressbar.setHeight('20px');
           $scope.progressbar.start();
            Form.submit($scope.formData)
                .success(function(data){
                    console.log(data);
                    if(data.success){
                        Form.verification_email($scope.formData, data.token)
                            .success(function(data){
                                if(data.success){
                                    vm.modal_signal = "You have successfully signed up to college carpool!";
                                    vm.modal_message = "A verification link has been sent \
                                    to your registered e-mail. You need to click on it to activate your account. \
                                    You cannot login without activating your account."
                                }
                                else{
                                    vm.modal_signal = "ERROR";
                                    vm.modal_message = "Unable to send verification e-mail, but your account has been registered.";                                    
                                }
                                $scope.setString(vm.modal_signal, vm.modal_message );
                                vm.submitprocessing = false;
                                $scope.progressbar.complete();
                                myModal.activate();

                            });
                    }
                    else{
                        vm.modal_signal = "Sign up unsuccessful!";
                        vm.modal_message = "Please try again.";
                        $scope.setString(vm.modal_signal, vm.modal_message );
                        myModal.activate();
                    }
                });
        }
    };
});
                

app.controller('loginController', function($scope, Auth, $location) {
    $scope.pageClass = 'page-about';
    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();
    if(vm.loggedIn){
        console.log('redirecting to home state');
        $location.path('/');
    }

    vm.doLogin = function() {
        vm.processing = true;

        // clear the error
        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
            .success(function(data) {
                vm.processing = false;          
                console.log('HERE2');
                // if a user successfully logs in, redirect to users page
                if (data.success)           
                    $location.path('/user');
                else 
                    vm.error = data.message;           
            });
    };

});

app.controller('dashController', function($scope, Auth, toaster, $location, $state, $timeout, Dash, $rootScope, geolocation, settings_modal){
    $scope.pageClass = 'page-dash';
    var vm = this;
    $scope.name = "";
    $scope.requestCount = 20;
    $scope.ready = false;
    $scope.loggedin_user_data = {};
    $scope.destination = {};

    //get all logged in user data -- everything
    getinfo = function(){
        Auth.getUser()
            .success(function(data){
                console.log(data);
                $scope.name = data.firstname;
                vm.name = $scope.name;
                user_id = data.user_id;
                Dash.get_user_info(data.user_id)
                    .success(function(completeData){
                        $scope.loggedin_user_data = completeData;
                        console.log($scope.loggedin_user_data);
                        control_main();
                        $scope.ready = true;
                    })
            });
    }();

    control_main = function(){
        if($scope.currentstate != "user.carpoolmap")
            $timeout(control_main2);
        else
            $timeout(control_main3);

    }
    control_main2 = function(){
        console.log('main2');
        initialize();
    }
    control_main3 = function(){
        
        if($scope.currentstate == "user.carpoolmap")
           {
                //google.maps.event.addDomListener(window, "load", initialize);
                initialize();
           } 
    }

   
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;
    var college, home;

    initialize = function () {


        
        directionsDisplay = new google.maps.DirectionsRenderer();

        college = new google.maps.LatLng($scope.loggedin_user_data.college.geo[1], $scope.loggedin_user_data.college.geo[0]);
        home = new google.maps.LatLng($scope.loggedin_user_data.geo[1], $scope.loggedin_user_data.geo[0]);
        home1 = new google.maps.LatLng($scope.loggedin_user_data.geo[1], $scope.loggedin_user_data.geo[0]);
        
        var mapOptions = {
            zoom: 14,
            center: home
            };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        var cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#FF0000',
          fillOpacity: 0.25,
          map: map,
          center: home,
          radius: 1000
        });

        function pastelColors(){
            var r = (Math.round(Math.random()* 127) + 127).toString(16);
            var g = (Math.round(Math.random()* 127) + 127).toString(16);
            var b = (Math.round(Math.random()* 127) + 127).toString(16);
            return '#' + r + g + b;
        }
    

        var markers = [];
        var college_color = [];
        var infoWindow;
        // place a marker
        function setMarker(map, position, title, content, color) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: {
                        path: fontawesome.markers.MAP_MARKER,
                        scale: 0.6,
                        strokeWeight: 0.5,
                        strokeColor: 'black',
                        strokeOpacity: 3,
                        fillColor: color,
                        fillOpacity: 1,
                    }
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            
        }

        //filling the circle
        data = {}
        data.lat = $scope.loggedin_user_data.geo[1];
        data.lng = $scope.loggedin_user_data.geo[0];
        data.distance = 1;
        
        Dash.circle_fill(data)
            .success(function(userList){
                console.log(userList);
                    for(var i = 0; i<userList.length; i++){
                        
                        var position = new google.maps.LatLng(userList[i].geo[1], userList[i].geo[0]);
                        setMarker(map, position, userList[i].firstname, "title", "content", pastelColors());
                    }
                
                
            });


        //directionsDisplay.setMap(map); 
        //calcRoute();
    };


  function calcRoute() {
    var start = new google.maps.LatLng(37.334818, -121.884886);
    //var end = new google.maps.LatLng(38.334818, -181.884886);
    var end = new google.maps.LatLng(37.441883, -122.143019);
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(map);
      } else {
        alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
      }
    });
  }




    



    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
        console.log(toState.name,"statechange"); 
        $scope.currentstate = toState.name;

        control_main();
    });









    // logout function
    vm.doLogout = function() {
        Auth.logout();
    
        $state.go('home-low', {}, {reload: true});
    };



    $scope.add_college = function(){
        settings_modal.activate();
    }



                $scope.pop = function(){
                    $scope.requestCount++;
            toaster.pop({
                type: 'error',
                title: 'Title text',
                body: 'Body text',
                showCloseButton: true
            });
        };

});                

app.controller('verifyController', function($scope, $stateParams, myModal, Form, ngProgressFactory, sharedProperties){

    var vm = this;
    $scope.setObject = function(newValue1, newValue2) {
        $scope.objectValue = sharedProperties.getObject();
        $scope.objectValue.data1 = newValue1;
        $scope.objectValue.data2 = newValue2;
    };
    $scope.setString = function(newValue) {
        sharedProperties.setString(newValue);
    };
    console.log($stateParams.verifyId);  
    $scope.verifyId =   $stateParams.verifyId;
    this.show = myModal.activate;
    function verify(){
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setHeight('20px');
        $scope.progressbar.start();
        Form.verify($scope.verifyId)
            .success(function(data){
                if(!data.success){
                    sharedProperties.setSignal(false);
                    vm.modal_signal = "ERROR DURING VERIFICATION!";
                    vm.modal_message = data.message;
                }
                else{
                    sharedProperties.setSignal(true);
                    vm.modal_signal = "VERIFICATION COMPLETE!";
                    vm.modal_message = data.message;
                }
                $scope.setObject(vm.modal_signal, vm.modal_message );
            });
        
    };
                $scope.pop = function(){
                    $scope.requestCount++;
            toaster.pop({
                type: 'error',
                title: 'Title text',
                body: 'Body text',
                showCloseButton: true
            });
        };
    verify();
    $scope.progressbar.complete();
    $scope.setString('VERIFICATION');
    myModal.activate();

});


app.controller('settings_modal_control', function (settings_modal, $scope, sharedProperties, $location, $http, geolocation, $rootScope, $window, $timeout, locService, ngProgressFactory, Dash, toaster) {
  this.close = settings_modal.deactivate;
  $scope.objectValue = sharedProperties.getObject();
  $scope.stringValue1 = "ADD A COLLEGE";
  $scope.signal = sharedProperties.getSignal();
  this.redirect = function(){
    settings_modal.deactivate();
    $location.path('/');
  };
  this.resend = function(){
    ///not created yet
    $scope.signal = !$scope.signal;
  };





    var map;
    var marker;
    var geocoder = new google.maps.Geocoder;
    $scope.formData = {};
    $scope.formData.collegename = "";
    $scope.formData.streetaddress = "";
    $scope.formData.lat = 0;
    $scope.formData.lng = 0;

    // Functions
    // ----------------------------------------------------------------------------
   

        function initialize2() {

            var input = document.getElementById('searchTextField');
            var autocomplete = new google.maps.places.Autocomplete(input);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                
                $scope.formData.lat = place.geometry.location.lat();
                $scope.formData.lng = place.geometry.location.lng();
        });
        
    }

    function control_main(){
            $timeout(initialize2);
    }
   
    control_main();

    $scope.submit = function(){
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setHeight('20px');
        $scope.progressbar.start();

       Dash.create_college($scope.formData)
            .success(function(data){
                console.log(data);
                $scope.progressbar.complete();
                settings_modal.deactivate();
            });
        

    }
});
