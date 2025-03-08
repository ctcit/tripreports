 // The controller used for displaying a single trip report
 
(function () {
    'use strict';

    angular.module('tripReportApp').controller('TripShowController',
        ['$scope', '$state', '$stateParams', '$q', 'currentTripReportService', 'site', 'tripReportService',
        function ($scope, $state, $stateParams, $q, currentTripReportService, site, tripReportService) {

            $scope.siteURL = site.url;

            var currentTripReport = currentTripReportService.currentTripReport;
            var id = ($stateParams.tripId != undefined) ? $stateParams.tripId : (currentTripReport) ? currentTripReport.id : 0;

            $scope.loading = true;
            $scope.site = site; // Make global site config available to view
            tripReportService.get({ 'tripId': id },
                function (tripReport) {
                    currentTripReportService.currentTripReport = tripReport;
                    $scope.tripReport = tripReport;

                    $scope.numImageRows = Math.ceil(tripReport.images.length / 3);
                    $scope.numImages = tripReport.images.length;
                    $scope.numMaps = tripReport.maps.length;
                    $scope.numGpxs = tripReport.gpxs.length;
                    $scope.numImagesInRow = function (rowNum) {
                        return Math.min(4, tripReport.images.length - 4 * rowNum);
                    };
                }, 
                function (fail) {
                    currentTripReportService.currentTripReport = null;
                    alert("Couldn't fetch trip report (" + fail.status + "). A network problem?");
                }).$promise.finally(function() {
                    $scope.loading = false;
                });
            
            // Caption for a GPX or Map. Use caption attribute if given
            // else use name.
            $scope.itemCaption = function(item) {
                var caption = item.caption;
                if (caption.trim() === '') {
                    caption = item.name;
                }
                return caption;
            };
            
            
            // Return the topomap url to be used to view a gpx file on the ctc
            // website, given the gpx id.
             $scope.topomapLink = function(gpxid) {
                return "http://www.topomap.co.nz/NZTopoMap?v=2&gpx=http%3A%2F%2Fwww.topomap.co.nz%2Fproxy.ashx%3F" + 
                        encodeURIComponent(site.url + '/dbgpx.php?id=' + gpxid);
            };
            
            // Return the trip report's upload_date in the form Tue 4 January 2014
            $scope.uploadDate = function() {
                var phpDate, datePart, bits, date;
                phpDate = $scope.tripReport && $scope.tripReport.upload_date;
                if (phpDate) { // If defined
                    datePart = phpDate.split(' ')[0];
                    bits = datePart.split('-');
                    date = new Date(bits[0], bits[1] - 1 /* js month is 0-indexed */ , bits[2]);
                    return date.toDateString();
                } else {
                    return '';
                }
            }     
    }]);
}());
