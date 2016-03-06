angular.module('lService', [])

// ===================================================
// locService to get geolocation data when homepage loads and save it
// ===================================================
.service('locService', function() {

  // private variable
  var _dataObj = {
  	ready : false
  };

  // public API
  this.dataObj = _dataObj;
});
