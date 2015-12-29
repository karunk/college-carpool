angular.module('familiar', ['app.routes',
							'mainCtrl',  
							'angularVideoBg', 
							'ngAnimate', 
							'authService', 
							'ui.bootstrap', 
							'720kb.fx',
							'ngInput'])


// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});