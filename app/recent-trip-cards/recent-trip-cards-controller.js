 // The Controller for the view that lists all the trips in a given year
 
(function () {
    'use strict';

    angular.module('tripReportApp').controller('RecentTripCardsController',
        ['$scope', '$state', '$stateParams', '$http', 'currentTripReportService', 'site',
        function ($scope, $state, $stateParams, $http, currentTripReportService, site) {
            var url = site.url + '/db/index.php/rest/tripreports?limit=' + $stateParams.maxrecent;
            currentTripReportService.currentTripReport = null;
            $scope.loading = true;
            $scope.site = site;

            $scope.navigateToReport = function(tripreport) {
                url = site.tripreportbaseurl + '?goto=tripreports%2F' + tripreport.id;
                if (window.self !== window.top) {
                    // If inside an iframe, navigate the parent window
                    window.top.location.href = url;
                } else {
                    // If not inside an iframe, navigate the current window
                    window.location.href = url;
                }
            }

            $http.get(url).then(function (response) {
                    $scope.tripreports = response.data.filter(item => item.trip_type != 'news');
                    // PENDING - This is a pretty poor way of doing this - would be better to
                    // organise the data into a 2D array that we can iterate on to
                    $scope.numRows = Math.ceil($scope.tripreports.length / 3);
                    $scope.numCardsInRow = function (rowNum) {
                        return Math.min(3, $scope.tripreports.length - 3 * rowNum);
                    };
                }, function (response) {
                    alert("Couldn't fetch trip reports (" + response.status + "). A network problem?" + " Url:" + url);
                    $scope.tripReport = undefined;
                }).finally(function () {
                    $scope.loading = false;
                });
        }
    ]);
}());
