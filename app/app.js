'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'myApp.view'
    , 'myApp.header'
    , 'ngRoute'
    , 'ngMaterial'
    , 'ngAnimate'
    , 'ngAria'
    , 'ngMessages'
    , 'md.data.table'
    // , 'material.svgAssetsCache'
])

.config(['$routeProvider', function($routeProvider) {
 	$routeProvider
	.when('/', {
		templateUrl: 'common/views/main.html',
    	controller: 'AppCtrl'
	})
    .otherwise({
    	templateUrl: 'common/404.html',
    });
}])

.config(function ($mdThemingProvider) {
    var customPrimary = {
        '50': '#ad18ff',
        '100': '#a400fe',
        '200': '#9300e4',
        '300': '#8300cb',
        '400': '#7200b1',
        '500': '#620098',
        '600': '#52007e',
        '700': '#410065',
        '800': '#31004b',
        '900': '#200032',
        'A100': '#b632ff',
        'A200': '#bf4bff',
        'A400': '#c865ff',
        'A700': '#100018'
    };
    var customAccent = {
        '50': '#6f0004',
        '100': '#880004',
        '200': '#a20005',
        '300': '#bb0006',
        '400': '#d50007',
        '500': '#ee0008',
        '600': '#ff222a',
        '700': '#ff3c42',
        '800': '#ff555b',
        '900': '#ff6f74',
        'A100': '#ff222a',
        'A200': '#ff0911',
        'A400': '#ee0008',
        'A700': '#ff888c'
    };
    var customWarn = {
        '50': '#ff8080',
        '100': '#ff6666',
        '200': '#ff4d4d',
        '300': '#ff3333',
        '400': '#ff1a1a',
        '500': '#ff0000',
        '600': '#e60000',
        '700': '#cc0000',
        '800': '#b30000',
        '900': '#990000',
        'A100': '#ff9999',
        'A200': '#ffb3b3',
        'A400': '#ffcccc',
        'A700': '#800000'
    };
    var customBackground = {
        '50': '#ffffff',
        '100': '#ffffff',
        '200': '#ffffff',
        '300': '#ffffff',
        '400': '#ffffff',
        '500': '#ffffff',
        '600': '#f0f0f0',
        '700': '#e0e0e0',
        '800': '#d1d1d1',
        '900': '#000000',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#e0e0e0',
        // 'contrastDarkColors': '50 100 200 300 400 500 600 700 800 900 A100 A200 A400 A700'
    };

    $mdThemingProvider.definePalette('customPrimary', customPrimary);
    $mdThemingProvider.definePalette('customAccent', customAccent);
    $mdThemingProvider.definePalette('customWarn', customWarn);
    $mdThemingProvider.definePalette('customBackground', customBackground);

    $mdThemingProvider.theme('default')
       .primaryPalette('customPrimary')
       .accentPalette('customAccent')
       .warnPalette('customWarn')
       .backgroundPalette('customBackground')
})

.controller('AppCtrl',['$scope', '$http', '$q', '$mdMedia', '$mdDialog', function($scope, $http, $q, $mdMedia, $mdDialog) {
   
    // --------------------------------------------- //
    //                  Settings Popup               //
    // --------------------------------------------- //

        // Show Settings Modal (see https://material.angularjs.org/latest/demo/dialog)
        $scope.status = '  ';
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.settings = {
            'seat_number': 2,
            'googleSheetsId':'1IUKyVd3REbUlfw0d-0cg7m1mDR-tE7vMldzm-CCyxnk',
            'spectator': false
        }

        $scope.showSettings = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'common/views/settings.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = 'Settings completed';
            }, function() {
                $scope.status = 'Settings not completed';
            });

            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.save = function(answer) {
                $mdDialog.hide(answer);

                $scope.settings = {
                    'seat_number': $scope.seat_number,
                    'googleSheetsId': $scope.googleSheetsId,
                    'spectator': $scope.spectator
                } 
            };
        }

    // --------------------------------------------- //
    //           Google Sheets API Calls             //
    // --------------------------------------------- //

        // 1IUKyVd3REbUlfw0d-0cg7m1mDR-tE7vMldzm-CCyxnk
        function getSheet(sheetId){
            var api_key = 'AIzaSyB-9nVkiHEVV79h74o_8YMMBXMLKG1PvCY';
            var deferred = $q.defer();
            if(sheetId){
                var url = 'https://sheets.googleapis.com/v4/spreadsheets/'+sheetId+'/values/Sheet1!B1:I48?key='+api_key;
                $http.get(url).success(function(response) {
                    deferred.resolve(response);
                    return deferred.promise;
                });
            }
            return deferred.promise;
        }

        $scope.$watch('settings.googleSheetsId', function(){
            getSheet($scope.settings.googleSheetsId).then(function(response){
                $scope.draft = response;
                $scope.draft.players = response.values[0];
                $scope.draft.picks = response.values.splice(1,response.values.length+1);
            });
        },true);

    // --------------------------------------------- //
    //                 Card Database                 //
    // --------------------------------------------- //
            

        function filterCardObject(obj){
            var deferred = $q.defer();
            angular.forEach(obj.data ,function(card ,key){
                obj.names.push(card.name)
                deferred.resolve(obj)
            });
            return deferred.promise;
        }

        $http.get('AllCards.json').then(function(res){
            var cards = {'data' : res.data, 'names':[]}; 
            filterCardObject(cards).then(function(res){
                $scope.cardsNames = res.names;
                $scope.cards = res
            });
        });

        $scope.viewCard = function($event, key1, key2){
            var cardname = $scope.draft.picks[key1][key2];
            $scope.cardView = $scope.cards.data[cardname];
            
            // angular.element(document).find('#popup').css({ 
            //     // 'top': $event.clientY,
            //     // 'left': $event.clientX
            // });

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

    // --------------------------------------------- //
    //                 Card Analysis                 //
    // --------------------------------------------- //


        var old_sheets= [   
            '1QsChUjmQrzyURwWAUtU61EziggAxuG3WO2gbXndRlKU',
            '1IUKyVd3REbUlfw0d-0cg7m1mDR-tE7vMldzm-CCyxnk',
            '1zApva1kM-OyAbCFZTpvcJq7rhWNoOsJ88jw8QjjXgoU',
            '1V1BIspMPOk-AeJjB7xmfqxMu-9W2-Yk1d2ycFbZOyf0',
            '1j_V7zcnQGdk42rIf3oPXiqTPpF9WfQ6hwgKeGiJwp7c'
        ];
        var sheets_data = [];

        angular.forEach(old_sheets, function(sheet_id, key){
            getSheet(sheet_id).then(function(response){
                var pick_rows = response.values.length;
                var pick_order = [];
                for( var i=1; i<pick_rows; i++){
                    for( var j=0; j<8; j++){
                        pick_order.push(response.values[i][j]);
                    }
                }

                sheets_data[key] = pick_order;
            });
        });
        console.log(sheets_data);
}])

.controller('cardAutoComplete', ['$scope', '$http', '$q', '$mdMedia', '$mdDialog', '$log', function($scope, $http, $q, $mdMedia, $mdDialog, $log){

    // --------------------------------------------- //
    //                 Card Database                 //
    // --------------------------------------------- //
        
    var self = this;

    function filterCardObject(obj){
        var deferred = $q.defer();
        angular.forEach(obj.data ,function(card ,key){
            obj.names.push(card.name)
            deferred.resolve(obj)
        });
        return deferred.promise;
    }

    $http.get('AllCards.json').then(function(res){
        var cards = {'data' : res.data, 'names':[]}; 
        filterCardObject(cards).then(function(res){
            self.cardsNames = res.names;
            // self.querySearch = querySearch();
            // self.selectedItemChange = selectedItemChange;
            // self.searchTextChange = searchTextChange;
        });
    });

    self.querySearch = function(query) {
        return query ? self.cardsNames.filter( createFilterFor(query) ) : self.cardsNames;
    }

    self.searchTextChange = function(text) {
        $log.info('Text changed to ' + text);
    }

    self.selectedItemChange = function(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }
    
    // Create filter function for a query string
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(card) {
            return (self.cardsNames.indexOf(lowercaseQuery) === 0);
        };
    }
}]);