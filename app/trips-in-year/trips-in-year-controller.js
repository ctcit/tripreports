 // The Controller for the view that lists all the trips in a given year
 
(function () {
    'use strict';

    angular.module('tripReportApp').controller('TripsInYearController',
        ['$scope', '$state', '$stateParams', '$http', 'currentTripReportService', 'site',
        function ($scope, $state, $stateParams, $http, currentTripReportService, site) {
            var url = site.URL + '/db/index.php/rest/yearstripreports/' + $stateParams.year;
                 
            currentTripReportService.currentTripReport = null;
            $scope.year = $stateParams.year;
            $scope.loading = true;
            $http.get(url).then(function (response) {
                    $scope.triplist = response.data;
                }, function (response) {
                    alert("Couldn't fetch trip reports (" + response.status + "). A network problem?");
                    $scope.tripReport = undefined;
                }).finally(function () {
                    $scope.loading = false;
                });
        } 
    ]);
}());
