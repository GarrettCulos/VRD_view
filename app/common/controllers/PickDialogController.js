'use strict';

angular.module('myApp.picker', ['ngRoute', 'ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'md.data.table'])

.controller('PickDialogController', ['$scope', '$rootScope', '$http', '$q', '$mdDialog', '$mdMedia', function($scope, $rootScope, $http, $q, $mdDialog, $mdMedia) {

    // search function to match full text
    console.log($rootScope);
    $scope.localSearch = function(str) {
        var matches = [];
        $rootScope.cardsNames.forEach(function(card) {
            if (card.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) {
                matches.push(card);
            }
        });
        return matches;
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.submit = function(answer) {
        var seatToSheet = ["A","B","C",'D','E','F','G','H','I','J','K'];
        var seat = $rootScope.settings.seat_number;
        var sheetId = $rootScope.settings.googleSheetsId;
        var googleApiKey = $rootScope.google_api_key;
        var sheetsRound = $rootScope.draft_round +1;
        var sheetLocation = seatToSheet[seat]+sheetsRound;
        console.log(googleApiKey);
        var post_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+sheetId+'/values/Sheet1!C1?valueInputOption=RAW?key='+googleApiKey;
        var payload = {
            majorDimension: "DIMENSION_UNSPECIFIED",
            values:[$scope.selectedItem]
        };
        $http({
            method: 'PUT',
            url: post_url,
            contentType: 'application/json',
            authorization: 'Bearer '+googleApiKey,
            body: payload,
        }).success(function(response) {
            console.log(response);
            $mdDialog.hide(answer);
        }).error(function(response){
            $mdDialog.hide(answer);
        });
    
        
        // sent pick to sheets
    };

    $scope.viewCard = function(cardname){
        $http.get('https://api.deckbrew.com/mtg/cards?name='+cardname).then(function(res){
            if(res.data.length == 1){
                var chosen_key =1000;
                angular.forEach(res.data[0].editions, function(editions, key){
                    if(editions.set != "International Collector's Edition" && editions.set != "Collector's Edition" && editions.set != "Vintage Masters"){
                        if(chosen_key > key){
                            $scope.cardImage = res.data[0].editions[res.data[0].editions.length-1].image_url;
                            chosen_key = key;
                        }
                    }
                });
            } else {
                angular.forEach(res.data, function(card,key){
                    if(card.name == cardname){
                        $scope.cardImage = res.data[key].editions[res.data[key].editions.length-1].image_url;
                    }
                });
            }
        });
    }

}]);