var app = angular.module('mainCtrl', [])

    


app.controller('homeController', function($scope, $rootScope, $location, Auth, $state, geolocation, $timeout) {
    //HOME-PAGE CONTROLLER ------------------------------------------------------------------------------------------





    $scope.pageClass = 'page-home';
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



    var vm = this;
    console.log('home');
    $scope.now = false;




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