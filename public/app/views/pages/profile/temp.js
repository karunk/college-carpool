app.controller('settings_modal_control', function (settings_modal, $scope, sharedProperties, $location, $http, geolocation, $rootScope, $window, $timeout, locService, ngProgressFactory) {
  this.close = settings_modal.deactivate;
  $scope.objectValue = sharedProperties.getObject();
  $scope.stringValue1 = "HELLO";
  $scope.signal = sharedProperties.getSignal();
  this.redirect = function(){
    
    initialize();
  };
  this.resend = function(){
    ///not created yet
    $scope.signal = !$scope.signal;
  };
  var map;
function initialize() {

    var mapOptions = {
        zoom: 16,
        draggable: true,
        center: {
            lat: 30.241532,
            lng: -97.894202
        }
    };

    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
}

});