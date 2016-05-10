var app = angular.module('familiar', ['app.routes',
							'mainCtrl',  
							'ngAnimate', 
							'authService', 
							'ui.bootstrap', 
							'ngInput',
							'ngMorph',
                           
                            
                            'geolocation',
                            'wu.staticGmap',
                            'ngLetterAvatar',
                            'toaster',
                            'angular-notification-icons',
                            'ngPlacesMap',
                            'noCAPTCHA',
                            'vModal',
                            'ngProgress'
							])


// application configuration to integrate token into requests
app.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});
app.config(['noCAPTCHAProvider', function (noCaptchaProvider) {
    noCaptchaProvider.setSiteKey('6Ler6xgTAAAAAOTg3ammRxsjM4yCMfRqEPSF1yta');
    noCaptchaProvider.setTheme('dark');
  }
]);

app.factory('myModal', function (vModal) {
  return vModal({
    controller: 'MyModalController',
    controllerAs: 'myModalCtrl',
    templateUrl: 'app/views/pages/signup/verification-modal.html'
  });
})


app.factory('settings_modal', function (vModal) {
  return vModal({
    controller: 'settings_modal_control',
    controllerAs: 'myModalCtrl',
    templateUrl: 'app/views/pages/profile/add_college_modal.html'
  });
})

app.factory('carpooler_modal', function(vModal){
  console.log('here');
  return vModal({
    controller: 'carpooler_modal_control',
    controllerAs: 'myModalCtrl',
    templateUrl: 'app/views/pages/profile/carpooler_modal.html'
  });
})

app.controller('MyModalController', function (myModal, $scope, sharedProperties, $location) {
  this.close = myModal.deactivate;
  $scope.objectValue = sharedProperties.getObject();
  $scope.stringValue1 = sharedProperties.getString();
  $scope.signal = sharedProperties.getSignal();
  this.redirect = function(){
    myModal.deactivate();
    $location.path('/');
  };
  this.resend = function(){
    ///not created yet
    $scope.signal = !$scope.signal;
  };
})

app.service('sharedProperties', function() {
    var stringValue = 'Verify your account to continue';
    var objectValue = {
        data1: 'test object value',
        data2: 'test object value'
    };
    var signal = false;
    return {
        getString: function() {
            return stringValue;
        },
        setString: function(value) {
            stringValue = value;
        },
        getObject: function() {
            return objectValue;
        },
        getSignal: function(){
            return signal;
        },
        setSignal: function(value){
            signal = value;
        }
    }
});
