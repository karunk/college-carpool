var app = angular.module('mainCtrl', [])

    


app.controller('homeController', function($scope, $rootScope, $location, Auth, $state, geolocation, $timeout) {
    
//HOME-PAGE CONTROLLER ------------------------------------------------------------------------------------------

    var vm = this;

    //Color Scheme Class------------------------

        $scope.pageClass = 'page-home-low';

    //-----------------------------------------

    //-----MORPHING MODALS------------------------------

        $scope.example1 = {
            closeEl: '.close',
            modal: {
              templateUrl: 'app/views/pages/login.html'
            }
        };


        $scope.example2 = {
            closeEl: '.close',
            overlay: {
            templateUrl: 'app/views/pages/more-info.html'
            }
        };

    //----------------------------------------------------



    // Geolocation Functions
    // ----------------------------------------------------------------------------

        var markers = [];
        function setMarker(map, position, title, content) {
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
                
                google.maps.event.addListener(marker, 'click', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: content
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
            }

        function initialize(lat) {
            var latlng = new google.maps.LatLng($scope.coords.lat, $scope.coords.long);
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
            setMarker(map, latlng, 'Are you here?', 'This position was detected by HTML5 Geolocation');
        }

        function get_location(){
            geolocation.getLocation().then(function(data){
                $scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
                initialize();
            });        
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


        vm.loggedIn = Auth.isLoggedIn();
        if(vm.loggedIn){
            console.log('in here');
            Auth.getUser()
                .success(function(data){
                    console.log(data);
                    vm.college = data.college;
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
    
});




app.controller('formController', function($scope, $state, $rootScope, geolocation) {
    
    // we will store all of our form data in this object
    $scope.formData = {};
    $scope.pageClass = 'page-about';
    $scope.user = {};
    $scope.currentstate = '';
    

    $scope.submitForm = function() {

        console.log('hihi');
        // check to make sure the form is completely valid

        };

    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
        console.log(toState.name); 
        $scope.currentstate = toState.name;
        if(toState.name == "profile")
            initialize();
    });


    function initialize() {
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var myOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
                myOptions);
    }
    google.maps.event.addDomListener(window, "load", initialize);


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

app.controller('dashController', function($scope, Auth){

    $scope.submitForm = function(isValid) {

        // check to make sure the form is completely valid
        if (isValid) {
          alert('our form is amazing');
        }
    };




    getinfo = function(){
        console.log('hi');
        Auth.getUser()
            .success(function(data){
                console.log(data);
            });
    };
});                


app.controller('mainController', function($scope, $rootScope, $location, Auth) {
        $scope.pageClass = 'page-home';

    var vm = this;

    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
        vm.loggedIn = Auth.isLoggedIn();    
        console.log('HERE');

        // get user information on page load
        Auth.getUser()
            .then(function(data) {
                vm.user = data.data;
            }); 
    }); 

    // function to handle login form
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

    // function to handle logging out
    vm.doLogout = function() {
        console.log('here');
        Auth.logout();
        vm.user = '';
        
        $location.path('/login');
    };

    vm.createSample = function() {
        console.log('here');
    };


});