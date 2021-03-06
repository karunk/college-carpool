angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider)
{
    //Set default route
    $urlRouterProvider.otherwise('/');

	
     $stateProvider
        .state('home-high', {
            url : '/home',
            templateUrl: 'app/views/pages/page-home.html',
            controller: 'homeController',
            controllerAs : 'home'
        })
        .state('home-low', {
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
        .state('verify', {
            url: '/verify/{verifyId}',
            templateUrl: 'app/views/pages/signup/verify.html',
            controller: 'verifyController',
            controllerAs: 'verify'
        })
        .state('form', {
            url: '/form',
            templateUrl: 'app/views/pages/signup/form.html',
            controller: 'formController',
            controllerAs: 'form'
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
        
        .state('user', {
            url : '/user',
            templateUrl: 'app/views/pages/profile/index.html',
            controller: 'dashController',
            controllerAs : 'dash'
        })
        .state('user.carpoolmap', {
            url : '/map',
            templateUrl: 'app/views/pages/profile/map.html'
        })
        .state('user.settings', {
            url : '/settings',
            templateUrl: 'app/views/pages/profile/settings.html'
        })
        .state('user.carpoolers', {
            url : '/carpoolers',
            templateUrl: 'app/views/pages/profile/carpoolers.html'
        })
        .state('user.schedule', {
            url : '/schedule',
            templateUrl: 'app/views/pages/profile/schedule.html'
        })

	$locationProvider.html5Mode(true).hashPrefix('!')
});