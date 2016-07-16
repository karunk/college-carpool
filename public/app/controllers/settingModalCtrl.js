var app = angular.module('settingModalCtrl', ['lService','formService','dashService','ngAnimate'])




app.controller('settings_modal_control', function (settings_modal, $scope, sharedProperties, $location, $http, $rootScope, $window, $timeout, locService, ngProgressFactory, Dash, toaster) {
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
