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

	dashFactory.sendCarpoolRequest = function(ClickeduserId, LoggedInUserId){
		console.log(ClickeduserId);
		console.log(LoggedInUserId);
		return $http.post('api/user/carpool/'+ClickeduserId, {
			user_id : LoggedInUserId,
			action  : 'add_request'
		}).success(function(data){
			return data;
		})
	};

	dashFactory.AcceptRequest = function(ClickeduserId, LoggedInUserId){
		console.log(ClickeduserId);
		console.log(LoggedInUserId);
		return $http.post('api/user/carpool/'+ClickeduserId, {
			user_id : LoggedInUserId,
			action  : 'add_carpool'
		}).success(function(data){
			return data;
		})
	};
	dashFactory.RejectRequest = function(ClickeduserId, LoggedInUserId){
		console.log(ClickeduserId);
		console.log(LoggedInUserId);
		return $http.put('api/user/carpool/'+ClickeduserId, {
			user_id : LoggedInUserId,
			action  : 'delete_request'
		}).success(function(data){
			return data;
		})
	};
	dashFactory.Unfriend = function(ClickeduserId, LoggedInUserId){
		console.log(ClickeduserId);
		console.log(LoggedInUserId);
		return $http.put('api/user/carpool/'+ClickeduserId, {
			user_id : LoggedInUserId,
			action  : 'delete_carpool'
		}).success(function(data){
			return data;
		})
	};

	dashFactory.getRequestList = function(LoggedInUserId){
		return $http.post('api/user/carpool/requestlist', {
			user_id : LoggedInUserId,
		}).success(function(data){
			return data;
		})
	};

	dashFactory.getCarpoolerList = function(LoggedInUserId){
		return $http.post('api/user/carpool/carpoolerlist', {
			user_id : LoggedInUserId,
		}).success(function(data){
			return data;
		})
	};

	return dashFactory;

});