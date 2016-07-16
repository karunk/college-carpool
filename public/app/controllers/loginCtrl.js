var app = angular.module('loginCtrl', ['lService','formService','dashService','ngAnimate'])






app.controller('loginController', function($scope, Auth, $location) {
    $scope.pageClass = 'page-about';
    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();
    if(vm.loggedIn){
       
        $location.path('/');
    }

    vm.doLogin = function() {
        vm.processing = true;

        // clear the error
        vm.error = '';

        Auth.login(vm.loginData.username, vm.loginData.password)
            .success(function(data) {
                vm.processing = false;          
               
                // if a user successfully logs in, redirect to users page
                if (data.success){
                    $location.path('/user');
                }
                else 
                    vm.error = data.message;           
            });
    };

});