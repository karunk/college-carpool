var app = angular.module('homeCtrl', ['lService','formService','dashService','ngAnimate'])


app.controller('homeController', function($scope, $rootScope, $location, Auth, $state, $timeout, locService, errorModal, sharedProperties) {
    
//HOME-PAGE CONTROLLER ------------------------------------------------------------------------------------------

    var vm = this;
    
    //Color Scheme Class------------------------

        $scope.pageClass = 'page-home-low';
        $scope.everythingReady = false;
        $scope.welcome_map = false;
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
            google.maps.event.addListenerOnce(map, "tilesloaded", function () {
                $scope.$emit('mapInitialized', map);
            });
        }


        $scope.setErrorDialogInfo = function(newValue1, newValue2, newValue3) {
            $scope.objectValue = sharedProperties.getObject();
            $scope.objectValue.data1 = newValue1;
            $scope.objectValue.data2 = newValue2;
            sharedProperties.setString(newValue3);
        };

        function GeoSuccess(position) {
            $scope.coords = {lat:position.coords.latitude, lng:position.coords.longitude};
            locService.dataObj.coords = {lat:position.coords.latitude, lng:position.coords.longitude};
            initialize();
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

        function GetLocation(){
            if(locService.dataObj.ready == false){
                if("geolocation" in navigator){
                    navigator.geolocation.getCurrentPosition(GeoSuccess, GeoError);
                }
                else{
                    $scope.setErrorDialogInfo("","", "Your browser does not support getting geolocation data!");
                }
            }
            else
                {
                    $scope.coords = locService.dataObj.coords;
                    initialize(); 
                    
                }   
        }

        function control_main(){
          
                $timeout(GetLocation);
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
        $scope.$on('mapInitialized', function(event, map) {
            
            $scope.$apply(function(){
                $scope.welcome_map = true;
            });
            console.log('map done', $scope.welcome_map);
            // in here you set some variable to actually hide the splash screen
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


