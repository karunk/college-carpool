angular.module('formService', [])

.factory('Form', function($http) {

	// create a new object
	var formFactory = {};


	formFactory.get_college_name = function(){
		return $http.get('/api/college/');
	};
	formFactory.validate_email = function(email){
		return $http.post('/api/isthere/email', {
			email: email
		}).success(function(data){
			return data.success;
		})
	}
	formFactory.validate_mobile = function(mobile){
		return $http.post('/api/isthere/mobile', {
			mobile: mobile
		}).success(function(data){
			return data.success;
		})
	}
	formFactory.validate_username = function(username){
		return $http.post('/api/isthere/username', {
			username: username
		}).success(function(data){
			return data.success;
		})
	}
	formFactory.validate_rollno = function(rollno, college_id){
		return $http.post('/api/isthere/college-rollno', {
			rollno: rollno,
			college_id: college_id
		}).success(function(data){
			return data.success;
		});
	}
	formFactory.submit = function(formData){
		return $http.post('/api/user-registeration',{
			college   		: formData.college.name,
            username  		: formData.username,
            password  		: formData.password,
            email     		: formData.contact.email,
            mobile    		: formData.contact.mobile,
            firstname 		: formData.name.first,
            lastname  		: formData.name.last,
            rollno    		: formData.college.rollno,
            lat       		: formData.coords.lat,
            lng       		: formData.coords.lng,
            isVehicleOwner	: formData.type,
            vehicleCapacity : formData.vcapacity
		}).success(function(data){
			return data;
		});
	}
	formFactory.verification_email = function(formData, link){
		email_string = 'http://localhost:8080/verify/' + link;
		console.log(email_string);
		return $http.post('/api/sendemail',{
			recipient : formData.contact.email,
			subject	: 'College Carpool  -  VERIFY YOUR ACCOUNT',
			emailhtml: email_string
		});
	}
	formFactory.verify = function(token){
		return $http.post('/api/verify',{
			token: token
		});
	}
	return formFactory;

});