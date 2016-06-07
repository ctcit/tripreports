
(function () {
    'use strict';

    angular.module('tripReportApp').factory('currentTripReportService', [
        function () {

            var currentTripReport = null;

            return {
                currentTripReport: currentTripReport
            };
        }
    ]);

}());
