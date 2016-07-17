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
.run(function($http, $q, $rootScope) {
    $rootScope.google_api_key = 'AIzaSyB-9nVkiHEVV79h74o_8YMMBXMLKG1PvCY';

    $rootScope.settings = {
        'seat_number': 2,
        'googleSheetsId':'1QsChUjmQrzyURwWAUtU61EziggAxuG3WO2gbXndRlKU',
        'spectator': false
    }
    $http.get('AllCards.json').then(function(res){
        var cards = {'data' : res.data, 'names':[]}; 
        filterCardObject(cards).then(function(res){
            $rootScope.cardsNames = res.names;
            $rootScope.cards = res
        });
    });

    function filterCardObject(obj){
        var deferred = $q.defer();
        angular.forEach(obj.data ,function(card ,key){
            obj.names.push(card.name)
            deferred.resolve(obj)
        });
        return deferred.promise;
    } 
})

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

.controller('AppCtrl',['$scope', '$rootScope', '$http', '$q', '$mdMedia', '$mdDialog', '$interval', function($scope, $rootScope, $http, $q, $mdMedia, $mdDialog, $interval) {
   

    $scope.settings = $rootScope.settings;
    $scope.draft_player = $rootScope.draft_player;

    // --------------------------------------------- //
    //                  Settings Popup               //
    // --------------------------------------------- //

        // Show Settings Modal (see https://material.angularjs.org/latest/demo/dialog)
        $scope.status = '  ';
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.showSettings = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: SettingsDialogController,
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

        function SettingsDialogController($scope, $rootScope, $mdDialog) {

            $scope.seatNumber = $rootScope.settings.seat_number;
            $scope.googleSheetsId = $rootScope.settings.googleSheetsId;
            $scope.spectator = $rootScope.settings.spectator;

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.save = function(answer) {
                $mdDialog.hide(answer);

                $rootScope.settings = {
                    'seat_number': $scope.seatNumber,
                    'googleSheetsId': $scope.googleSheetsId,
                    'spectator': $scope.spectator
                } 
            };
        }

    // --------------------------------------------- //
    //                  Pick Popup                   //
    // --------------------------------------------- //

        // Show Settings Modal (see https://material.angularjs.org/latest/demo/dialog)
        
        $scope.showPickDialog = function(ev) {
            var useFullScreen = $mdMedia('xs') && $scope.customFullscreen;
            $mdDialog.show({
                controller: PickDialogController,
                templateUrl: 'common/views/pick.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = 'Pick Chosen';
            }, function() {
                $scope.status = 'Pick Not Chosen';
            });

            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        function PickDialogController($scope, $rootScope, $mdDialog) {
            // search function to match full text
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
                var post_url = 'https://sheets.googleapis.com/v4/spreadsheets/'+sheetId+'/values/range?valueInputOption=RAW?key='+googleApiKey;
                var payload = {
                    range: "Sheet1!"+sheetLocation,
                    majorDimension: "DIMENSION_UNSPECIFIED",
                    values:[$scope.selectedItem]
                };
                $http({
                  method: 'PUT',
                  authorization: 'Basic '+ googleApiKey,
                  url: post_url,
                  contentType: 'application/json',
                  body:payload
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
        }

    // --------------------------------------------- //
    //           Google Sheets API Calls             //
    // --------------------------------------------- //


        // 1IUKyVd3REbUlfw0d-0cg7m1mDR-tE7vMldzm-CCyxnk
        
        function getSheet(sheetId){
            var api_key = $rootScope.google_api_key;
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

        $interval(function(){
            console.log('Interval Trigger: '+($scope.draft_player+1)+':'+($rootScope.settings.seat_number));

            if( ($scope.draft_player+1) != $rootScope.settings.seat_number){
                console.log('Not you');
                getSheet($rootScope.settings.googleSheetsId).then(function(response){
                    $scope.draft = response;
                    $scope.draft.players = response.values[0];
                    var picks = response.values.splice(1,response.values.length+1);
                    $rootScope.draft_round = picks.length;
                    $scope.draft_player = picks[picks.length-1].length;
                    formatDraftPicks($scope.draft.players, picks);
                });
            }

        }, 10000);

        $rootScope.$watch('settings', function(){
            console.log('Watch Sheets Triggered');
            getSheet($rootScope.settings.googleSheetsId).then(function(response){
                // change local settings
                $scope.settings = $rootScope.settings;
                $scope.draft = response;
                $scope.draft.players = response.values[0];
                var picks = response.values.splice(1,response.values.length+1);
                $rootScope.draft_round = picks.length;
                $scope.draft_player = picks[picks.length-1].length;
                formatDraftPicks($scope.draft.players, picks);

            });
        },true);

        function formatDraftPicks(player_array, picks_array){
            var numbPlayers = player_array.length;
            var playerArray = Array.apply(null,  Array(numbPlayers)).map(String.prototype.valueOf,"");
            var numbPicks = 45;
            var pickArray = Array.apply(null,  Array(numbPicks)).map(String.prototype.valueOf,"");
            $scope.draft.picks=picks_array;
            angular.forEach( pickArray, function(pick, key1){
                if($scope.draft.picks[key1] === undefined){
                    $scope.draft.picks[key1] = playerArray;
                }
                else if($scope.draft.picks[key1].length < numbPlayers){
                    angular.forEach( playerArray, function(player, key2){
                        if($scope.draft.picks[key1][key2] === undefined){
                            $scope.draft.picks[key1].push("");
                        }
                    });    
                }
                
            });
        }

    // --------------------------------------------- //
    //                 Card Database                 //
    // --------------------------------------------- //       

        $scope.viewCard = function($event, key1, key2){
            var cardname = $scope.draft.picks[key1][key2];
            $scope.cardView = $rootScope.cards.data[cardname];

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
}])
.directive('draft', function($window) {
    return function (scope, element) {
        var w = angular.element($window);
        var setHeight = function() {
            angular.element('draft').css({'height':w.height()});
        }

        w.trigger('resize', function () {
            setHeight()
        });

        setHeight()
    }
})
.directive('tbody', function($window) {
    return function(scope, element){
        var w = angular.element($window);
        var thead = angular.element('thead');

        var setHeight = function() {
            angular.element('tbody').css({'height':(w.height()-thead.height())});
        }

        w.trigger('resize', function () {
            setHeight()
        });

        setHeight()
    }
})
.directive('cardDragger', ['$document', function($document) {
  return {
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;
      var w_width =  angular.element(window).width();

      element.css({
       position: 'absolute',
       cursor: 'pointer',
       top:x,
       right:y,
      });

      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          right:  -x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    }
  }
}]);