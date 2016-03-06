var app = angular.module('familiar', ['app.routes',
							'mainCtrl',  
							'ngAnimate', 
							'authService', 
							'ui.bootstrap', 
							'720kb.fx',
							'ngInput',
							'ngMorph',
                            '720kb.tooltips',
                            'ngMap',
                            'geolocation',
                            'wu.staticGmap',
                            'ngLetterAvatar',
                            'toaster',
                            'angular-notification-icons',
                            'ngPlacesMap',
                            'noCAPTCHA'
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


