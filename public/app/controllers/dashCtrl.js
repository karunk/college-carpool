var app = angular.module('dashCtrl', ['lService','formService','dashService','ngAnimate'])


app.controller('dashController', function($q, $scope, Auth, toaster, $location, $state, $timeout, Dash, $rootScope, settings_modal, carpooler_modal, sharedProperties, ListModal, CarpoolerListModal){
    $scope.pageClass = 'page-dash';
    var vm = this;

    //variables
    vm.lineofsight = 1;
    $scope.listnoshow = false;
    $scope.CarpoolersNearMeListReady = false;
    $scope.dashReady = false;
    $scope.name = "";
    $scope.requestCount = 20;
    $scope.ready = false;
    $scope.loggedin_user_data = {};
    $scope.destination = {};
    data = {}
    $scope.enabled = false;
    $scope.college_data = [];
    $scope.no_of_requests;
    $scope.no_of_carpoolers;
    $scope.NearMeList = [];
    //map variables
    var markers = [];
    var MapMarkers = [];
    var tmpRawNearMeList = [];
    


    //get all logged in user data -- everything
    getinfo = function(){
        Auth.getUser()
            .success(function(data){
                
                $scope.name = data.firstname;
                vm.name = $scope.name;
                user_id = data.user_id;
                console.log('this is id', user_id)
                Dash.get_user_info(data.user_id)
                    .success(function(completeData){
                        $scope.loggedin_user_data = completeData;
                        $scope.no_of_carpoolers = completeData.carpoolers.length;
                        $scope.no_of_requests = completeData.carpool_requests.length;
                        data.lat = $scope.loggedin_user_data.geo[1];
                        data.lng = $scope.loggedin_user_data.geo[0];
                        data.distance = vm.lineofsight;
                        console.log('dis', vm.lineofsight);
                        Dash.circle_fill(data)
                            .success(function(userList){
                                    console.log(userList);
                                    $scope.NearMeList = userList;
                                    tmpRawNearMeList = userList;
                                    for(var i = 0; i<userList.length; i++){
                                        Dash.college_info_by_id(userList[i].college)
                                            .success(function(college_data){
                                                $scope.college_data[college_data._id] = college_data;
                                            });
                                        console.log(userList[i].college);
                                        markers.push([userList[i].firstname, userList[i].geo[1], userList[i].geo[0], userList[i].college, userList[i]]);
                                    }
                                    control_main();
                                    $scope.ready = true;
                            });
                    })
            });
    };


    $scope.refreshmap = function(){
        getinfo();
       // console.log(vm.lineofsight)
    }

    var initializedash = function(){
        getinfo();
    }();

    control_main = function(){
        console.log('hohoho', $scope.currentstate)
        if($scope.currentstate == undefined){
            $timeout(control_main2);
        }
        else if($scope.currentstate == "user.carpoolers"){
            
            $scope.NearMe();
           
        }
        else{
            $scope.listnoshow = false;
            $timeout(control_main3);
        }

    }
    control_main2 = function(){
        $scope.listnoshow = true;
        $scope.$apply();
        initializeMaps();

    }
    control_main3 = function(){
        
        if($scope.currentstate == "user.carpoolmap")
           {
                //google.maps.event.addDomListener(window, "load", initialize);
                initializeMaps();
           } 
    }
     $rootScope
                .$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        console.log(toState.name)
                        if(toState.name == 'user.carpoolers'){
                            Dash.getRequestList($scope.loggedin_user_data._id)
                                .success(function(data){
                                    $scope.no_of_requests = data.requests.length;
                                    Dash.getCarpoolerList($scope.loggedin_user_data._id)
                                        .success(function(data){
                                            $scope.no_of_carpoolers = data.carpooler_list.length;
                                            $scope.dashReady = true;
                                            console.log('hohoho')
                                        })
                                })
                        }
                    });


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
        bounds.extend(start);
        bounds.extend(end);
        map.fitBounds(bounds);
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
                console.log('HOHO',response)
                carpooler_modal_data['user_to_college_directions']         = user_direction_response;
                carpooler_modal_data['clicked_user_to_college_directions'] = clicked_marker_direction_response;
           

                $scope.setObject(carpooler_modal_data, $scope.loggedin_user_data);
                $scope.setString($scope.loggedin_user_data._id);
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

        try{

             map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
        }
        catch(e){
            console.log('MAP ERROR!');
            if($scope.currentstate == 'user.carpoolmap'){
                $state.go('user.carpoolmap');
            }
            $scope.$apply(function(){
                $scope.dashReady = true;
            });
        }
        try{
            google.maps.event.addListenerOnce(map, "tilesloaded", function () {
                $scope.$emit('mapInitialized', map);
            });
        }
        catch(e){
            return;
        }

        var cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#FF0000',
          fillOpacity: 0.25,
          map: map,
          center: latlng,
          radius: vm.lineofsight*1000
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
                   
                    $scope.setObject(carpooler_modal_data, $scope.loggedin_user_data);
                carpooler_modal.activate(); 

                }
            })(marker, i));
         
            MapMarkers.push([marker, $scope.college_data[markers[i][3]]]);
        }
        $scope.enabled = true;
    }
    $scope.$on('mapInitialized', function(event, map) {
        
        console.log('map done','hohoho');
        $scope.$apply(function(){
            $scope.dashReady = true;
        });
        console.log('dash ready');
        // in here you set some variable to actually hide the splash screen
    });


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
        console.log('here');
        $scope.requestCount++;
        toaster.pop({
            type: 'error',
            title: 'Title text',
            body: 'Body text',
            showCloseButton: true
        });
    };


    //MY CARPOOLERS CONTROL FUNCTIONS

    $scope.example1 = {
        closeEl: '.closecarpool',
        overlay: {
          templateUrl: 'app/views/pages/profile/pendingcarpoolers.html'
        }
    };

    $scope.RequestList = function(){
        //console.log($scope.loggedin_user_data._id);
        $scope.setString($scope.loggedin_user_data._id);
        ListModal.activate();
    };

    $scope.CarpoolerList = function(){
        //console.log($scope.loggedin_user_data._id);
        $scope.setString($scope.loggedin_user_data._id);
        CarpoolerListModal.activate();

    };
    
    
    $scope.NearMe = function(){
       $scope.NearMeList = tmpRawNearMeList
        var geodata = {
            "lng" : $scope.loggedin_user_data.geo[0],
            "lat" : $scope.loggedin_user_data.geo[1]
        }

    
        var geocoder = new google.maps.Geocoder;
        
        var FilterList = function(){
            $scope.NearMeList = []
            for(var i=0; i<CleanNearMeList.length; i++){
                if($scope.loggedin_user_data._id!=CleanNearMeList[i]._id)
                    $scope.NearMeList.push(CleanNearMeList[i]);

            }
            ListReady();
        }
        //utility function
        var contains = function(needle) {
            // Per spec, the way to identify NaN is that it is not equal to itself
            var findNaN = needle !== needle;
            var indexOf;

            if(!findNaN && typeof Array.prototype.indexOf === 'function') {
                indexOf = Array.prototype.indexOf;
            } else {
                indexOf = function(needle) {
                    var i = -1, index = -1;

                    for(i = 0; i < this.length; i++) {
                        var item = this[i];

                        if((findNaN && item !== item) || item === needle) {
                            index = i;
                            break;
                        }
                    }

                    return index;
                };
            }

            return indexOf.call(this, needle) > -1;
        };
        var ListReady = function(){
            console.log($scope.NearMeList)
            $scope.CarpoolersNearMeListReady = true;
            $scope.$apply();
        }
        

        //cleaning the nearmelist
        var CleanNearMeList = [];
        
        for(var i = 0; i<$scope.NearMeList.length; i++){

            var tmpObj = {};
            console.log('$$$',$scope.NearMeList[i]);
            tmpObj.firstname = $scope.NearMeList[i].firstname;
            tmpObj.lastname = $scope.NearMeList[i].lastname;
            tmpObj.mobile = $scope.NearMeList[i].mobile;
            tmpObj.college = $scope.college_data[$scope.NearMeList[i].college].collegename;
            tmpObj.vehicle = $scope.NearMeList[i].isVehicleOwner;
            tmpObj.email = $scope.NearMeList[i].email;
            tmpObj.latlng = new google.maps.LatLng($scope.NearMeList[i].geo[1], $scope.NearMeList[i].geo[0]);
            tmpObj._id = $scope.NearMeList[i]._id;
            
            (function(tmpObj){
                
                geocoder.geocode({'location': tmpObj.latlng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            
                            tmpObj.address = results[1].formatted_address;
                            
                        } 
                        else {
                            tmpObj.address = "";
                        }
                        } 
                        else {
                            tmpObj.address = "";
                        }
                    
                    CleanNearMeList.push(tmpObj);
                    if(CleanNearMeList.length == $scope.NearMeList.length)
                        FilterList();
                });
            })(tmpObj);
            
        }

    }






}); 


            










