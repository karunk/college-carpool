var app = angular.module('mainCtrl', [])



app.controller('homeController', function($scope, $rootScope, $location, Auth) {
    //HOME-PAGE CONTROLLER ------------------------------------------------------------------------------------------

    $scope.pageClass = 'page-home';

    
    var vm = this;
    console.log('home');


    vm.loggedIn = Auth.isLoggedIn();
    if(vm.loggedIn){
        console.log('in here');
        Auth.getUser()
            .success(function(data){
                console.log(data);
                vm.college = data.college;
            });
    }


    vm.doLogout = function() {
        
        vm.processing = true;

        Auth.logout();
        
        
        $location.path('/login');
    };

    
});



app.controller('formController', function($scope) {
    
    // we will store all of our form data in this object
    $scope.formData = {};
    
    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');
    };
    
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