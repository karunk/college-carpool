var app = angular.module('mainCtrl', ['lService'])

    


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
            var latlng = new google.maps.LatLng($scope.coords.lat, $scope.coords.long);

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
                    $scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
                    console.log('GEOLOCATION API HIT', $scope.coords);
                    locService.dataObj.coords = {lat:data.coords.latitude, long:data.coords.longitude};
                    initialize();
                }); 
            }
            else
                {
                    initialize(); 
                    $scope.coords = locService.dataObj.coords;
                }   
        }

        function control_main(){
                $timeout(get_location);
        }

        google.maps.event.addDomListener(window, 'load', control_main); 


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
                    console.log('HERE2 login');
                    // if a user successfully logs in, redirect to users page
                    if (data.success)           
                        $location.path('/user');
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




app.controller('formController', function($scope, $http, geolocation, $rootScope, $window, $timeout, locService){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    $scope.streetaddress_ok = false;
    $scope.formData.CaptchaControl = "";
    var map;
    var marker;
    var geocoder = new google.maps.Geocoder;
    $scope.currentstate = "1"



    // Set default initial coordinates to the center of the US
    if(locService.dataObj.ready == false){
        console.log('here');
            if(locService.dataObj.ready == false){
                geolocation.getLocation().then(function(data){
                    $scope.formData.coords = {lat:data.coords.latitude, long:data.coords.longitude};
                    console.log('GEOLOCATION API HIT', $scope.coords);
                    locService.dataObj.coords = {lat:data.coords.latitude, long:data.coords.longitude};
            var latlng = new google.maps.LatLng($scope.formData.coords.lat, $scope.formData.coords.long);
            map.setCenter(latlng);

                }); 
        $scope.formData.coords = {
            lat: 39.500,
            long: -98.350
        }      
    }}
    else
        {
            $scope.formData.coords = locService.dataObj.coords;
            $scope.formData.address = locService.dataObj.address;
            $scope.streetaddress_ok = true;
        }

    // Functions
    // ----------------------------------------------------------------------------
        function initialize() {
        var latlng = new google.maps.LatLng($scope.formData.coords.lat, $scope.formData.coords.long);
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
        initialize();
        var input = document.getElementById('searchTextField');
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();

            $scope.formData.coords.lat = place.geometry.location.lat();
            $scope.formData.coords.long = place.geometry.location.lng();
            var latlng = new google.maps.LatLng($scope.formData.coords.lat, $scope.formData.coords.long);
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

    //google.maps.event.addDomListener(window, 'load', control_main); 
    $scope.$watch('$scope.currentstate', control_main);

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

app.controller('dashController', function($scope, Auth, toaster){

    var vm = this;
    $scope.name = "";
    $scope.requestCount = 20;
    $scope.ready = false;
    getinfo = function(){
        console.log('hi');
        Auth.getUser()
            .success(function(data){
                console.log(data);
                $scope.name = data.firstname;
                vm.name = $scope.name;
                $scope.ready = true;
            });
    }();

        $scope.example1 = {
            closeEl: '.close',
            overlay: {
              templateUrl: 'app/views/pages/123/index.html',
              scroll: false,
            }
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

});                

app.controller('experimentController', function($scope){
    $scope.isOpen = false;

        $scope.open = function () {
            $scope.isOpen = true;
        };

        $scope.toggle = function () {
            $scope.isOpen = !$scope.isOpen;
        };

        $scope.close = function () {
            $scope.isOpen = false;
        };
    
     

});


