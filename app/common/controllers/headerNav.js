'use strict';

angular.module('myApp.header', ['ngRoute'])

.controller('HeaderController', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$scope.isActive = function(page){
		if( page == $location.path() ){
			return 'active';
		}
		return '';
	};

	$scope.goTo = function(page){
		$location.path(page)
	};
}])

.directive('headernav', function(){
  return{
    templateUrl: 'common/views/headerNav.html'
  }
});