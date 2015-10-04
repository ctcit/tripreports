
(function () {
    'use strict';

    angular.module('tripReportApp').factory('currentTripReportService', [
        function () {

            var currentTripReport = null;

            return {
                get: function() { return currentTripReport; },
                set: function (tripReport) { currentTripReport = tripReport; },
                clear: function() { currentTripReport = null; }
            }
        }
    ]);

}());
