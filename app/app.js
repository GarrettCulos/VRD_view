'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'myApp.picker'
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
    	// controller: 'AppCtrl'
	})
    .otherwise({
    	templateUrl: 'common/404.html',
    });
}])
.run(function($rootScope) {
    $rootScope.google_api_key = 'AIzaSyB-9nVkiHEVV79h74o_8YMMBXMLKG1PvCY';

    $rootScope.settings = {
        'seat_number': 2,
        'googleSheetsId':'1QsChUjmQrzyURwWAUtU61EziggAxuG3WO2gbXndRlKU',
        'spectator': false
    }
    $rootScope.cardsNames = [];
    $rootScope.cards = [];
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
        '400': '#f8f8f8',
        '500': '#ebebeb',
        '600': '#dedede',
        '700': '#d1d1d1',
        '800': '#c5c5c5',
        '900': '#b8b8b8',
        'A100': '#ffffff',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#ababab'
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
    //                  Settings Pop-up               //
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
    //                  Pick Pop-up                   //
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
            }
        };

    // --------------------------------------------- //
    //           Google Sheets API Calls             //
    // --------------------------------------------- //


        // 1IUKyVd3REbUlfw0d-0cg7m1mDR-tE7vMldzm-CCyxnk
        
        function getSheet(sheetId){
            var api_key = $rootScope.google_api_key;
            var deferred = $q.defer();
            if(sheetId){
                var url = 'https://sheets.googleapis.com/v4/spreadsheets/'+sheetId+'/values/Sheet1!B1:I48?key='+api_key;
                $http({
                    method: 'GET',
                    url: url,
                }).success(function(response) {
                    deferred.resolve(response);
                    return deferred.promise;
                });
            }
            return deferred.promise;
        }

        $interval(function(){
            // console.log('Interval Trigger: '+($scope.draft_player+1)+':'+($rootScope.settings.seat_number));

            if( ($scope.draft_player+1) != $rootScope.settings.seat_number){
                // console.log('Not you');
                getSheet($rootScope.settings.googleSheetsId).then(function(response){
                    // set draft
                    $scope.draft = response;
                    // set players drafting
                    $scope.draft.players = response.values[0];
                    // set draft array
                    var picks = response.values.splice(1,response.values.length+1);
                    // determine draft round
                    $rootScope.draft_round = picks.length;
                    // determine the player who's drafting
                    $scope.draft_player = picks[picks.length-1].length;
                    // fill in empty picks of draft so it displays correctly
                    formatDraftPicks($scope.draft.players, picks);
                    // return picked cards list for filtering EPO
                    returnPickList(picks).then(function(res){
                        $scope.pickList = res;
                    });
                });
            }
        }, 5000);

        $rootScope.$watch('[settings.googleSheetsId, settings.seat_number]', function(){
            console.log('Watch Sheets Triggered');
            // change local settings
            $scope.settings = $rootScope.settings;

            getSheet($rootScope.settings.googleSheetsId).then(function(response){
                // set draft
                $scope.draft = response;
                // set players drafting
                $scope.draft.players = response.values[0];
                // set draft array
                var picks = response.values.splice(1,response.values.length+1);
                // determine draft round
                $rootScope.draft_round = picks.length;
                // determine the player who's drafting
                $scope.draft_player = picks[picks.length-1].length;
                // fill in empty picks of draft so it displays correctly
                formatDraftPicks($scope.draft.players, picks);
                // return picked cards list for filtering EPO
                returnPickList(picks).then(function(res){
                    $scope.pickList = res;
                });


            });
        },true);

        function returnPickList(pick_array){
            var arr = [];
            var deferred = $q.defer();
            angular.forEach( pick_array, function(pick_round, key1){
                angular.forEach( pick_round, function(pick, key2){
                    arr.push(pick.toLowerCase());
                    deferred.resolve(arr)
                });    
            });
            return deferred.promise;
        }

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
        
        $scope.viewCard = function(cardname){
            // var cardname = $scope.draft.picks[key1][key2];
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

        $scope.EPO = [];

        $http.get('AllCards.json').then(function(res){
            var cards = {'data' : res.data, 'names':[]}; 
            filterCardObject(cards).then(function(res){
                // redefine cards and cardsNames
                $rootScope.cardsNames = res.names;
                $rootScope.cards = res;
                
                //create Expected Pick Order array
                cardAnalysis($rootScope.cards).then(function(resp){
                    $rootScope.cards = resp;
                    angular.forEach(resp.data, function(card, key){
                        if(card.VRD_EPO !== undefined){
                            $scope.EPO.push(card);
                        }
                    });
                });
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

        function cardAnalysis(cards){
            var deferred = $q.defer();   
            var old_sheets= [   
                '1IUKyVd3REbUlfw0d-0cg7m1mDR-tE7vMldzm-CCyxnk',
                '1zApva1kM-OyAbCFZTpvcJq7rhWNoOsJ88jw8QjjXgoU',
                '1V1BIspMPOk-AeJjB7xmfqxMu-9W2-Yk1d2ycFbZOyf0',
                '1j_V7zcnQGdk42rIf3oPXiqTPpF9WfQ6hwgKeGiJwp7c'
            ];
            var sheets_data = [];
            // console.log($rootScope.cards);
            angular.forEach(old_sheets, function(sheet_id, key){
                var sheet_id = old_sheets[key];
                getSheet(sheet_id).then(function(response){
                    var pick_rows = response.values.length;
                    var null_pick_order = [];
                    var pick_order = [];
                    for( var i=1; i<pick_rows; i++){
                        if(i%2 == 0){
                            for( var j=7; j>=0; j--){
                                pick_order.push(response.values[i][j]);

                                if(cards.data[response.values[i][j]] !== undefined){
                                    // Number of time the card has been drafter
                                    var VRD_numTD = cards.data[response.values[i][j]].VRD_numTD;
                                    if(VRD_numTD === undefined){
                                        VRD_numTD = 1;
                                    } else {
                                        VRD_numTD++;
                                    }
                                    
                                    // VRD Expected Pick Order
                                    var VRD_EPO = cards.data[response.values[i][j]].VRD_EPO
                                    if(VRD_EPO === undefined){
                                        VRD_EPO = ((i-1)*8)+(8-j);
                                    } else {
                                        // if (VRD_EPO < 8){ console.log(VRD_EPO + ' --- ' + ((((i-1)*8)+(8-j)+(VRD_EPO*(VRD_numTD -1)))/VRD_numTD) + ' --- ' + response.values[i][j]); }
                                        VRD_EPO = ((((i-1)*8)+(8-j)+(VRD_EPO*(VRD_numTD -1)))/VRD_numTD);
                                    }
                                    cards.data[response.values[i][j]].VRD_numTD = VRD_numTD;
                                    cards.data[response.values[i][j]].VRD_EPO = VRD_EPO;
                                } else {
                                    // if the card is misspelled 
                                    null_pick_order.push({
                                        'name': response.values[i][j],
                                        'VRD_EP)':(i-1)*8+(8-j), 
                                        'VRD_numTD':1
                                    });
                                }

                                deferred.resolve(cards);
                            }    
                        } else {
                            for( var j=0; j<8; j++){
                                pick_order.push(response.values[i][j]);

                                if(cards.data[response.values[i][j]] !== undefined){
                                    // Number of time the card has been drafter
                                    var VRD_numTD = cards.data[response.values[i][j]].VRD_numTD;
                                    if(VRD_numTD === undefined){
                                        VRD_numTD = 1;
                                    } else {
                                        VRD_numTD++;
                                    }
                                    
                                    // VRD Expected Pick Order
                                    var VRD_EPO = cards.data[response.values[i][j]].VRD_EPO
                                    if(VRD_EPO === undefined){
                                        VRD_EPO = ((i-1)*8)+j+1;
                                    } else {
                                        // if (VRD_EPO < 8){console.log(VRD_EPO + ' --- ' + (((((i-1)*8)+j+1)+(VRD_EPO*(VRD_numTD-1)))/VRD_numTD)+ ' --- ' + response.values[i][j]);}
                                        VRD_EPO = (((((i-1)*8)+j+1)+(VRD_EPO*(VRD_numTD-1)))/VRD_numTD);
                                    }
                                    cards.data[response.values[i][j]].VRD_numTD = VRD_numTD;
                                    cards.data[response.values[i][j]].VRD_EPO = VRD_EPO;
                                } else {
                                    // if the card is misspelled 
                                    null_pick_order.push({
                                        'name': response.values[i][j],
                                        'VRD_EPO':(i-1)*8+(8-j), 
                                        'VRD_numTD':1
                                    });
                                }

                                deferred.resolve(cards);
                            }
                        }
                    }
                    sheets_data[key] = pick_order;
                });
            });
            
            return deferred.promise;
        }

        $scope.removeCard = function(item){
            $scope.EPO.splice($scope.EPO.indexOf(item),1);
        }

    // --------------------------------------------- //
    //                 Card filter                   //
    // --------------------------------------------- //        

    var cardFilter = {};
    cardFilter.hidden = false;
    cardFilter.colors = {
        white: true,
        black: true,
        red: true,
        blue: true,
        green: true
    };
    cardFilter.colourless = true;
    cardFilter.types = {
        land : true,
        creature: true,
        artifact: true,
        else: true
    };
    $scope.cardFilter  = cardFilter;

    $scope.toggleHidden = function(){
        if($scope.cardFilter.visible == false){
            $scope.cardFilter.visible = true;
        } else{
            $scope.cardFilter.visible = false;
        }
    };

    $scope.updateFilter = function(updateFilter){
        $scope.cardFilter = updateFilter;
        $scope.cardFilter.visible = false;
    };

    $scope.resetFilter = function(){
        $scope.updateFilter(cardFilter);
        $scope.formdata = cardFilter;
    };

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

.directive('expectedPickOrder',function($window) {
    return function (scope, element) {
        var w = angular.element($window);
        var filterdiv = angular.element('card-filter-search');

        var setHeightWidth = function() {
            angular.element('expected-pick-order table').css({'height':(w.height()-filterdiv.height())});
            angular.element('expected-pick-order').css({'width':258});
        }
        
        w.trigger('resize', function () {
            setHeightWidth()
        });

        setHeightWidth()
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
}])

.directive('cardFilterSearch', function($window) {
    return function(scope, element){
        // var w = angular.element($window);
        // var thead = angular.element('this');

        // var setHeight = function() {
        //     angular.element('tbody').css({'height':(w.height()-thead.height())});
        // }

        // w.trigger('resize', function () {
        //     setHeight()
        // });

        // setHeight()
    }
})

.directive('cardSearch', function() {
    return function(scope, element){


    }
})

.filter('cardChosen', function() {
    return function(cards, pickList, filterOptions) {
        var filtered = [];

        function cardType(card, option){
            var cardAllowed = true;
            // filter colors
            if(card.types !== undefined){
                for( var i = 0; i<card.types.length; i++){
                    if(option[card.types[i].toLowerCase()] !== undefined && !option[card.types[i].toLowerCase()]){
                        cardAllowed = false;
                    }
                }    
            }
            return cardAllowed;
        }

        function cardColor(card, option){
            var cardAllowed = true;
            // filter colors
            if(card.colors !== undefined){
                for( var i = 0; i<card.colors.length; i++){
                    if(!option[card.colors[i].toLowerCase()]){
                        cardAllowed = false;
                    }
                }    
            }
            return cardAllowed;
        }

        angular.forEach(cards, function(item) {
            if(pickList.indexOf(item.name.toLowerCase()) < 0) {
                if(cardColor(item, filterOptions.colors) && cardType(item, filterOptions.types)){
                    filtered.push(item);    
                }
            }
        });
        return filtered;
    };
});