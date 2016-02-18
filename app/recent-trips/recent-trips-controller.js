 // The Controller for the view that lists all the trips in a given year
 
(function () {
    'use strict';

    angular.module('tripReportApp').controller('RecentTripsController',
        ['$scope', '$state', '$stateParams', '$http', 'currentTripReportService', 'site',
        function ($scope, $state, $stateParams, $http, currentTripReportService, site) {
            var url = site.url + '/db/index.php/rest/recenttripreports/' + $stateParams.maxrecent + '/' + $stateParams.maxdays;  
            currentTripReportService.currentTripReport = null;
            //$scope.maxrecent = $stateParams.maxrecent; // Don't think these are needed
            //$scope.maxdays = $stateParams.maxdays;
            $scope.loading = true;
            $http.get(url).then(function (response) {
                    $scope.triplist = response.data;
                }, function (response) {
                    alert("Couldn't fetch trip reports (" + response.status + "). A network problem?" + " Url:" + url);
                    $scope.tripReport = undefined;
                }).finally(function () {
                    $scope.loading = false;
                });
        } 
    ]);
}());
