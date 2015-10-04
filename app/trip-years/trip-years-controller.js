// The controller for the view showing all years in which trip reports are available
(function () {
    'use strict';

    angular.module('tripReportApp').controller('TripYearsController',
        ['$scope', '$routeParams', '$http', 'currentTripReportService', 'site',
        function ($scope, $params, $http, currentTripReportService, site) {
            var url = site.URL + '/db/index.php/rest/tripreportyears',
                NUM_RECENT = 10;  // The number of years to show by default
            currentTripReportService.clear();
            $scope.numYears = 0;
            $http.get(url).then(function (response) {
                $scope.recentOnly = true;
                $scope.years = response.data;
                $scope.numYears = NUM_RECENT;
            }, function(response) {
                alert("Couldn't fetch trip report years. A network problem?");
            });
            
            // Update numYears if recentOnly changes
            $scope.checkboxChanged = function() {
                $scope.numYears = $scope.recentOnly ? NUM_RECENT : $scope.years.length;
            };
        }
    ]);
}());