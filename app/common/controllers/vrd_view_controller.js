'use strict';

angular.module('myApp.view', ['ngRoute'])

.controller('vrd_view_controller', ['$scope', '$http', '$q', '$mdMedia', '$mdDialog', function($scope, $http, $q, $mdMedia, $mdDialog) {



	// $scope.draft = null // draft object (player data, card data)

	// $scope.getJiraTasks = function(){

	// 	// Fetch Jira Data`
	// 	$scope.fetching_tasks = true;

	// 	$http({
	// 		method: 'GET',
	// 		url: '/account/fetch_accounts'
	// 	}).then(function successCallback(response){

	// 		$scope.JiraAccounts = response.data;
	// 		if($scope.JiraAccounts){

	// 			$http({
	// 				method: 'GET',
	// 				url: '/pull_jiras/jira_accounts'
	// 			}).then(function successCallback(res){

	// 				$scope.fetching_tasks = false;
	// 				modify_task_list(
	// 					res.data
	// 				).then(function(response){		
	// 					$scope.taskList = response;
	// 					console.log($scope.taskList);
	// 				});

	// 			}, function errorCallback(res){
	// 				$scope.fetching_tasks = false;
	// 			});

	// 		} else {
	// 			$scope.addSettings(); 
	// 		}



	// 	}, function errorCallback(response){
	// 		// console.log(response);
	// 		$scope.fetching_tasks = false;

	// 	});
	// }

}]);