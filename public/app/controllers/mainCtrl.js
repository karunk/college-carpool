var app = angular.module('mainCtrl', ['lService','formService','dashService','ngAnimate'])

    


app.controller('homeController', function($scope, $rootScope, $location, Auth, $state, geolocation, $timeout, locService) {
    
//HOME-PAGE CONTROLLER ------------------------------------------------------------------------------------------

    var vm = this;
    
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
                        
                            if (results[1]) {
                                
                                $scope.address = results[1].formatted_address;
                                locService.dataObj.address = results[1].formatted_address;
                                locService.dataObj.ready = true;
                                
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
          
                $timeout(get_location);
        }

        //google.maps.event.addDomListener(window, 'load', control_main); 
        control_main();

    //RE-RENDERING MAP-----------------------------------

        $scope.currentstate = "home-low";

        $rootScope.$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams){
            $scope.currentstate = toState.name;
            
            if($scope.currentstate == "home-low") 
                control_main();
        });




    //-----------------------------------------------------

    //AUTHENTICATION CONTROL ----------------------------


        vm.college = "COLLEGE";
        vm.loggedIn = Auth.isLoggedIn();

        if(vm.loggedIn){
            
            Auth.getUser()
                .success(function(data){
                    
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
               
                    if(locService.dataObj.ready == false){
                        geolocation.getLocation().then(function(data){
                            $scope.formData.coords = {lat:data.coords.latitude, lng:data.coords.longitude};
                            
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
                $scope.formData.coords.lat = e.latLng.lat();
                $scope.formData.coords.lng = e.latLng.lng();
                $scope.$apply();
             
                var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
                marker.setPosition(latlng);

                geocoder.geocode({'location': latlng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            
                            $scope.formData.streetaddress = results[1].formatted_address;
                            $scope.streetaddress_ok = true;
                            $scope.$apply();
                            
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
        
        
    }

    function control_main(){
        if($scope.currentstate == "1" || $scope.currentstate == "form.profile")
        {
            $timeout(initialize2);
        }
    }


    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
        
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
       
        $location.path('/');
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
                    $location.path('/user');
                else 
                    vm.error = data.message;           
            });
    };

});

app.controller('dashController', function($scope, Auth, toaster, $location, $state, $timeout, Dash, $rootScope, geolocation, settings_modal, carpooler_modal, sharedProperties){
    $scope.pageClass = 'page-dash';
    var vm = this;
    $scope.name = "";
    $scope.requestCount = 20;
    $scope.ready = false;
    $scope.loggedin_user_data = {};
    $scope.destination = {};
    data = {}
    var markers = [];
    $scope.college_data = [];
    //get all logged in user data -- everything
    getinfo = function(){
        Auth.getUser()
            .success(function(data){
                
                $scope.name = data.firstname;
                vm.name = $scope.name;
                user_id = data.user_id;
                Dash.get_user_info(data.user_id)
                    .success(function(completeData){
                        $scope.loggedin_user_data = completeData;
                        
                        data.lat = $scope.loggedin_user_data.geo[1];
                        data.lng = $scope.loggedin_user_data.geo[0];
                        data.distance = 1;
                      
                        Dash.circle_fill(data)
                            .success(function(userList){
                                  
                                    for(var i = 0; i<userList.length; i++){
                                        Dash.college_info_by_id(userList[i].college)
                                            .success(function(college_data){
                                                $scope.college_data[college_data._id] = college_data;
                                            });
                                        console.log(userList[i]);
                                        markers.push([userList[i].firstname, userList[i].geo[1], userList[i].geo[0], userList[i].college, userList[i]]);
                                    }
                                    control_main();
                                    $scope.ready = true;
                            });
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
       
        initializeMaps();
    }
    control_main3 = function(){
        
        if($scope.currentstate == "user.carpoolmap")
           {
                //google.maps.event.addDomListener(window, "load", initialize);
                initializeMaps();
           } 
    }

    //modal data
    var carpooler_modal_data = {};
   //map control variables
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;
    var clicked_marker_direction_response, user_direction_response;
    //map control functions
    function pastelColors(){
        var r = (Math.round(Math.random()* 127) + 127).toString(16);
        var g = (Math.round(Math.random()* 127) + 127).toString(16);
        var b = (Math.round(Math.random()* 127) + 127).toString(16);
        return '#' + r + g + b;
    }

    function calcRoute(start, end) {
        var start = start;
        var end = end;
     
     
        var bounds = new google.maps.LatLngBounds();
        //bounds.extend(start);
        //bounds.extend(end);
        //map.fitBounds(bounds);
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
                clicked_marker_direction_response = response;

                carpooler_modal_data['user_to_college_directions']         = user_direction_response;
                carpooler_modal_data['clicked_user_to_college_directions'] = clicked_marker_direction_response;
           

                $scope.setObject(carpooler_modal_data, $scope.loggedin_user_data);
                carpooler_modal.activate(); 

            } else {
                alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        });
    }

    function calcRoute_loggedin(){
        var start = new google.maps.LatLng($scope.loggedin_user_data.geo[1], $scope.loggedin_user_data.geo[0]);
        var end   = new google.maps.LatLng($scope.loggedin_user_data.college.geo[1], $scope.loggedin_user_data.college.geo[0]);

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                user_direction_response = response;
                
            } else {
                alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        });

    }





    $scope.setString = function(newValue) {
        sharedProperties.setString(newValue);
    };
    $scope.setObject = function(newValue1, newValue2) {
        $scope.objectValue = sharedProperties.getObject();
        $scope.objectValue.data1 = newValue1;
        $scope.objectValue.data2 = newValue2;
    };


    function initializeMaps() {
        calcRoute_loggedin();
        directionsDisplay = new google.maps.DirectionsRenderer();
        
        var latlng = new google.maps.LatLng($scope.loggedin_user_data.geo[1], $scope.loggedin_user_data.geo[0]);
        var myOptions = {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);

        var cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#FF0000',
          fillOpacity: 0.25,
          map: map,
          center: latlng,
          radius: 1000
        });

        var infowindow = new google.maps.InfoWindow(), marker, i;
        

        for (i = 0; i < markers.length; i++) {  

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(markers[i][1], markers[i][2]),
                map: map,
                icon: {
                    path: fontawesome.markers.MAP_MARKER,
                    scale: 0.6,
                    strokeWeight: 0.5,
                    strokeColor: 'black',
                    strokeOpacity: 3,
                    fillColor: pastelColors(),
                    fillOpacity: 1,
                }
            });
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(markers[i][0]);
                    infowindow.open(map, marker);
                    //directionsDisplay.setMap(map); 
                    var start =  new google.maps.LatLng(markers[i][1],markers[i][2]);
                    var end   =  new google.maps.LatLng($scope.college_data[markers[i][3]].geo[1], $scope.college_data[markers[i][3]].geo[0]);
                    
                    calcRoute(start, end);

                    carpooler_modal_data['user_data']         = markers[i][4];
                    carpooler_modal_data['user_college_data'] = $scope.college_data[markers[i][3]];
                    console.log('karun',carpooler_modal_data);
                    $scope.setObject(carpooler_modal_data, $scope.loggedin_user_data);
                carpooler_modal.activate(); 

                }
            })(marker, i));
         

        }
    }
   




    



    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
        
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

app.controller('carpooler_modal_control', function(carpooler_modal, $scope, sharedProperties, $location, $http, geolocation, $rootScope, $window, $timeout, locService, ngProgressFactory, Dash, toaster){
    this.close = carpooler_modal.deactivate;
    $scope.objectValue = sharedProperties.getObject();
    console.log($scope.objectValue);
    
    $scope.isFriend     = false;
    $scope.isRequested  = false;
    function relationship(){
        if($scope.clicked_marker_data.carpoolers_list.indexOf($scope.loggedin_user_data._id)!=-1)
            $scope.isFriend = true;
        else if($scope.clicked_marker_data.requests_list.indexOf($scope.loggedin_user_data._id)!=-1)
            $scope.isRequested = true;
    }

    $scope.clicked_marker_data = {

        _id             : $scope.objectValue.data1.user_data._id,
        firstname       : $scope.objectValue.data1.user_data.firstname,
        lastname        : $scope.objectValue.data1.user_data.lastname,
        collegename     : $scope.objectValue.data1.user_college_data.collegename,
        college_geo     : $scope.objectValue.data1.user_college_data.geo,
        rollno          : $scope.objectValue.data1.user_data.rollno,
        email           : $scope.objectValue.data1.user_data.email,
        carpoolers_list : $scope.objectValue.data1.user_data.carpoolers,
        requests_list   : $scope.objectValue.data1.user_data.carpool_requests,
        user_geo        : $scope.objectValue.data1.user_data.geo,
        direction_data  : $scope.objectValue.data1.clicked_user_to_college_directions,
        isVehicleOwner  : $scope.objectValue.data1.user_data.isVehicleOwner,
        vehicleCapacity : $scope.objectValue.data1.user_data.vehicleCapacity
    }

    $scope.loggedin_user_data = {

        //_id             : $scope.objectValue.data2.user_data._id,
        carpoolers_list : $scope.objectValue.data2.carpoolers,
        requests_list   : $scope.objectValue.data2.carpool_requests,
        user_geo        : $scope.objectValue.data2.geo,
        collegename     : $scope.objectValue.data2.college.collegename,
        college_geo     : $scope.objectValue.data2.college.geo,
        direction_data  : $scope.objectValue.data1.user_to_college_directions
    }

    relationship();
    var service = new google.maps.DistanceMatrixService();
    var origin1 = new google.maps.LatLng($scope.loggedin_user_data.user_geo[1], $scope.loggedin_user_data.user_geo[0]);
    var destinationA = new google.maps.LatLng($scope.clicked_marker_data.user_geo[1], $scope.clicked_marker_data.user_geo[0]);;

    function callback(response, status) {
        $scope.travel_time = response.rows[0].elements[0].duration;
        $scope.travel_distance = response.rows[0].elements[0].distance;
        
    }
    service.getDistanceMatrix(
    {
        origins: [origin1],
        destinations: [destinationA],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC,

        avoidHighways: false,
        avoidTolls: false,
    }, callback);

    function percentage_overlap_calc(){
        console.log($scope.loggedin_user_data.direction_data);
    };

    percentage_overlap_calc();

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
                
                $scope.progressbar.complete();
                settings_modal.deactivate();
            });
        

    }
});
