(function () {
    'use strict';

    /* Controllers for the TripReport subsystem (Angular-JS) */

    var tripReportControllers = angular.module('tripReportControllers', []);

    // Define a filter that can be used to pass DB HTML content directly through
    // to the output.
    tripReportControllers.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
}());