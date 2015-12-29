angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider)
{
    //Set default route
    $urlRouterProvider.otherwise('/');

	
     $stateProvider
        .state('home', {
            url : '/',
            templateUrl: 'app/views/pages/page-home.html',
            controller: 'homeController',
            controllerAs : 'home'
        })

        .state('login', {
            url : '/login',
            templateUrl: 'app/views/pages/login.html',
            controller: 'loginController',
            controllerAs : 'login'
        })

        .state('form', {
            url: '/form',
            templateUrl: 'app/views/pages/signup/form.html',
            controller: 'formController'
        })

        .state('form.profile', {
            url: '/profile',
            templateUrl: 'app/views/pages/signup/form-profile.html'
        })
        
        // url will be /form/interests
        .state('form.interests', {
            url: '/interests',
            templateUrl: 'app/views/pages/signup/form-interests.html'
        })
        
        // url will be /form/payment
        .state('form.payment', {
            url: '/payment',
            templateUrl: 'app/views/pages/signup/form-payment.html'
        })

        .state('user', {
            url : '/user',
            templateUrl: 'app/views/pages/userinfo.html',
            controller: 'mainController',
            controllerAs : 'login'
        });

	$locationProvider.html5Mode(true).hashPrefix('!')
});