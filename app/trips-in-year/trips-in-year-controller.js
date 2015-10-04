 // The Controller for the view that lists all the trips in a given year
 
(function () {
    'use strict';

    angular.module('tripReportApp').controller('TripsInYearController',
        ['$scope', '$routeParams', '$http', 'currentTripReportService', 'site',
        function ($scope, $params, $http, currentTripReportService, site) {
            var url = site.URL + '/db/index.php/rest/yearstripreports/' + $params.year;
                //NUM_RECENT = 10,
                //i = 0;
                
            currentTripReportService.clear();
            $scope.year = $params.year;
            $scope.loading = true;
            $http.get(url).then(function (response) {
                $scope.triplist = response.data;
            }, function(response) {
                alert("Couldn't fetch trip reports (" + response.status + "). A network problem?");
                $scope.tripReport = undefined;
            });
            $scope.loading = false;
        } 
    ]);
}());
