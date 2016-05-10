angular.module('dashService', [])

.factory('Dash', function($http) {

	// create a new object
	var dashFactory = {};


	dashFactory.get_user_info = function(user_id){
		return $http.get('/api/user/'+user_id);
	};

	dashFactory.create_college = function(data){
		return $http.post('api/create-college', {
			collegename	: data.collegename,
			lng			: data.lng,
			lat			: data.lat
		}).success(function(data){
			return data.success;
		})
	};

	dashFactory.circle_fill = function(data){
		return $http.post('api/geo/inradius', {
			longitude : data.lng,
			latitude  : data.lat,
			distance  : data.distance
		}).success(function(list){
			return list;
		});
	}

	dashFactory.college_info_by_id = function(id){
		return $http.get('api/college/'+id)
	};
	/*formFactory.validate_email = function(email){
		return $http.post('/api/isthere/email', {
			email: email
		}).success(function(data){
			return data.success;
		})
	}*/

	return dashFactory;

});