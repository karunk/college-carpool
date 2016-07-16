var app = angular.module('dashCtrl', ['lService','formService','dashService','ngAnimate'])


app.controller('dashController', function($scope, Auth, toaster, $location, $state, $timeout, Dash, $rootScope, settings_modal, carpooler_modal, sharedProperties, ListModal, CarpoolerListModal){
    $scope.pageClass = 'page-dash';
    var vm = this;

    //variables
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
    //map variables
    var markers = [];
    var MapMarkers = [];
    
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
                        data.distance = 1;
                      
                        Dash.circle_fill(data)
                            .success(function(userList){
                                  
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
                   
                    $scope.setObject(carpooler_modal_data, $scope.loggedin_user_data);
                carpooler_modal.activate(); 

                }
            })(marker, i));
         
            MapMarkers.push([marker, $scope.college_data[markers[i][3]]]);
        }
        $scope.enabled = true;
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
    



}); 













