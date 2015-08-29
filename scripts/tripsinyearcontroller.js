 // The Controller for the view that lists all the trips in a given year
 
(function () {
    'use strict';

    angular.module('tripReportApp').controller('TripsInYearController',
        ['$scope', '$routeParams', '$http', 'globals',
        function($scope, $params, $http, globals) {
            var url = globals.SITE_URL + '/db/index.php/rest/yearstripreports/' + $params.year,
                NUM_RECENT = 10,
                i = 0;
            globals.tripId = 0;
            globals.tripReportScope = null;
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
