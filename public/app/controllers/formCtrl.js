var app = angular.module('formCtrl', ['lService','formService','dashService','ngAnimate'])





app.controller('formController', function($scope, $http, $rootScope, $window, $timeout, locService, Form, myModal, sharedProperties, ngProgressFactory){

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


    function GeoSuccess(position) {
        $scope.formData.coords = {lat:position.coords.latitude, lng:position.coords.longitude};
        locService.dataObj.coords = {lat:position.coords.latitude, lng:position.coords.longitude};
        var latlng = new google.maps.LatLng($scope.formData.coords.lat, $scope.formData.coords.lng);
        map.setCenter(latlng);
        //initialize();
      };
    function GeoError(error) {
        console.log(error.message);
        switch (error.code) {
            case error.PERMISSION_DENIED:
                $scope.error = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                $scope.error = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                $scope.error = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                $scope.error = "An unknown error occurred."
                break;
        }
        $scope.$apply();
        $scope.setErrorDialogInfo("","", $scope.error);
        errorModal.activate();
    };
    function initialize2() {       
        if(locService.dataObj.ready == false){
           if("geolocation" in navigator){
                navigator.geolocation.getCurrentPosition(GeoSuccess, GeoError);
            }     
        }
        else{
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
                
