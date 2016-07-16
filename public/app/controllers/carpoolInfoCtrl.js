var app = angular.module('carpoolInfoCtrl', ['lService','formService','dashService','ngAnimate'])



app.controller('carpooler_modal_control', function(Auth, carpooler_modal, $scope, sharedProperties, $location, $http, $rootScope, $window, $timeout, locService, ngProgressFactory, Dash, toaster){
    var vm = this;
    this.close = carpooler_modal.deactivate;
    $scope.objectValue = sharedProperties.getObject();

    console.log($scope.objectValue);
    
    $scope.isFriend     = false;
    $scope.isRequested  = false;
    $scope.isYou = false;
    function relationship(){
        console.log($scope.clicked_marker_data.requests_list);
        console.log($scope.loggedin_user_data._id);
        if($scope.clicked_marker_data._id == $scope.loggedin_user_data._id){
            $scope.isYou = true;
            console.log('this is u');
        }
        for(var i=0; i<$scope.clicked_marker_data.requests_list.length; i++){
            if($scope.clicked_marker_data.requests_list[i]._id == $scope.loggedin_user_data._id){
                $scope.isRequested  = true;
                break;
            } 
        }
        for(var i=0; i<$scope.clicked_marker_data.carpoolers_list.length; i++){
            if($scope.clicked_marker_data.rcarpoolers_list[i]._id == $scope.loggedin_user_data._id){
                $scope.isFriend  = true;
                break;
            } 
        }
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

        _id             : undefined,
        carpoolers_list : $scope.objectValue.data2.carpoolers,
        requests_list   : $scope.objectValue.data2.carpool_requests,
        user_geo        : $scope.objectValue.data2.geo,
        collegename     : $scope.objectValue.data2.college.collegename,
        college_geo     : $scope.objectValue.data2.college.geo,
        direction_data  : $scope.objectValue.data1.user_to_college_directions
    }

    
    
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



    
    function GetLoggedInUserData(){
        console.log($scope.clicked_marker_data)
        Auth.getUser()
            .success(function(data){
                $scope.loggedin_user_data._id = data.user_id;
                relationship();
                
            });
    };
    GetLoggedInUserData();

    $scope.toggle = true;
    $scope.pop = function(title, body){
        console.log('here');
        $scope.requestCount++;
        toaster.pop({
            type: 'info',
            title: title,
            body: body,
            showCloseButton: true
        });
    };
    $scope.sendRequest = function(){
        $scope.toggle = false;
        Auth.getUser()
            .success(function(data){
                $scope.loggedin_user_data._id = data.user_id;
                Dash.sendCarpoolRequest($scope.clicked_marker_data._id, $scope.loggedin_user_data._id)
                    .success(function(data){ 
                        $scope.pop('REQUEST SENT','Carpool request sent to '+$scope.clicked_marker_data.firstname+' '+$scope.clicked_marker_data.lastname);
                        console.log(data);
                });
            });
    }

});