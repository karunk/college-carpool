var app = angular.module('familiar', [
              'app.routes',
              'settingModalCtrl', 
              'homeCtrl',
              'formCtrl',
              'loginCtrl',
              'dashCtrl',
              'verifyCtrl',
              'carpoolInfoCtrl', 
							'ngAnimate', 
							'authService', 
							'ui.bootstrap', 
							'ngInput',
							'ngMorph',
              'ngLetterAvatar',
              'toaster',
              'angular-notification-icons',
              'ngPlacesMap',
              'noCAPTCHA',
              'vModal',
              'ngProgress',
              'angular-spinkit',
              'uiSwitch'
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

app.factory('errorModal', function (vModal) {
  return vModal({
    controller: 'ErrorModalController',
    controllerAs: 'myModalCtrl',
    templateUrl: 'app/views/pages/signup/error-modal.html'
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
app.factory('ListModal', function(vModal){

  return vModal({
    controller: 'ListController',
    controllerAs: 'list',
    templateUrl: 'app/views/pages/profile/pendingcarpoolers.html'
  });
})
app.factory('CarpoolerListModal', function(vModal){

  return vModal({
    controller: 'CarpoolerListController',
    controllerAs: 'Clist',
    templateUrl: 'app/views/pages/profile/carpooler-list.html'
  });
})

app.controller('ListController', function (ListModal, $scope, sharedProperties, $location, Dash, toaster) {
  this.close = ListModal.deactivate;
  $scope.logged_in_user_id = sharedProperties.getString();

  $scope.Requests = {};
  $scope.Req = [];
  $scope.ListReady = false;
  $scope.ListEmpty = false;
  this.test = function(){
    Dash.getRequestList($scope.logged_in_user_id)
        .success(function(data){ 
            if(data.requests.length == 0)
              $scope.ListEmpty = true;
            for(var i=0; i<data.requests.length; i++){
              $scope.Requests[data.requests[i]._id] = data.requests[i];
              Dash.get_user_info(data.requests[i]._id)
                  .success(function(data){
                    $scope.Requests[data._id].firstname      = data.firstname;
                    $scope.Requests[data._id].lastname       = data.lastname;
                    $scope.Requests[data._id].collegename    = data.college.collegename;
                    $scope.Requests[data._id].mobile         = data.mobile;
                    $scope.Requests[data._id].email          = data.email;
                    $scope.Requests[data._id].isVehicleOwner = data.isVehicleOwner;
                    $scope.Requests[data._id].listshow       = true;
                    $scope.ListReady = true;
                    $scope.Req.push($scope.Requests[data._id]);
                  })
            } 
    });

  };
  this.test();

  $scope.AcceptRequest = function(_id){
    console.log(_id);
    $scope.Requests[_id].listshow = false;
    $scope.Requests[_id].decision = 'accepted';
    Dash.AcceptRequest(_id, $scope.logged_in_user_id)
        .success(function(data){
          console.log(data);
        })
  }
  $scope.CancelRequest = function(_id){
    console.log(_id);
    $scope.Requests[_id].listshow = false;
    $scope.Requests[_id].decision = 'cancelled';
    Dash.RejectRequest(_id, $scope.logged_in_user_id)
        .success(function(data){
          console.log(data);
        })
  }

});


app.controller('CarpoolerListController', function (CarpoolerListModal, $scope, sharedProperties, $location, Dash, toaster) {
  this.close = CarpoolerListModal.deactivate;
  $scope.logged_in_user_id = sharedProperties.getString();

  $scope.CarpoolersD = {};
  $scope.CarpoolersA = [];
  $scope.ListReady = false;
  $scope.ListEmpty = false;
  this.test = function(){
    Dash.getCarpoolerList($scope.logged_in_user_id)
        .success(function(data){ 
            if(data.carpooler_list.length == 0)
              $scope.ListEmpty = true;
            for(var i=0; i<data.carpooler_list.length; i++){
              $scope.CarpoolersD[data.carpooler_list[i]._id] = data.carpooler_list[i];
              Dash.get_user_info(data.carpooler_list[i]._id)
                  .success(function(data){
                    $scope.CarpoolersD[data._id].firstname      = data.firstname;
                    $scope.CarpoolersD[data._id].lastname       = data.lastname;
                    $scope.CarpoolersD[data._id].collegename    = data.college.collegename;
                    $scope.CarpoolersD[data._id].mobile         = data.mobile;
                    $scope.CarpoolersD[data._id].email          = data.email;
                    $scope.CarpoolersD[data._id].isVehicleOwner = data.isVehicleOwner;
                    $scope.CarpoolersD[data._id].listshow       = true;
                    $scope.ListReady = true;
                    $scope.CarpoolersA.push($scope.CarpoolersD[data._id]);
                  })
            } 
    });

  };
  this.test();
  $scope.Unfriend = function(_id){
    console.log(_id);
    $scope.CarpoolersD[_id].listshow = false;
    $scope.CarpoolersD[_id].decision = 'unfriended';
    Dash.Unfriend(_id, $scope.logged_in_user_id)
        .success(function(data){
          console.log(data);
          Dash.getCarpoolerList($scope.logged_in_user_id)
              .success(function(data){
                str='c';
                str+=data.carpooler_list.length;
                sharedProperties.setString(str);
                
            });
    })
  }




});










app.controller('ErrorModalController', function (errorModal, $scope, sharedProperties, $location) {
  this.close = errorModal.deactivate;
  $scope.objectValue = sharedProperties.getObject();
  $scope.stringValue1 = sharedProperties.getString();
  $scope.signal = sharedProperties.getSignal();
  this.redirect = function(){
    console.log('here');
    errorModal.deactivate();
    $location.path('/');
  };
  this.resend = function(){
    ///not created yet
    $scope.signal = !$scope.signal;
  };
})

app.controller('MyModalController', function (myModal, $scope, sharedProperties, $location) {
  this.close = myModal.deactivate;
  $scope.objectValue = sharedProperties.getObject();
  $scope.stringValue1 = sharedProperties.getString();
  $scope.signal = sharedProperties.getSignal();
  this.redirect = function(){
    console.log('here');
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
