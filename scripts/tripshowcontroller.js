 // The controller used for displaying a single trip report
 
(function () {
    'use strict';

    angular.module('tripReportApp').controller('TripShowController',
        ['$scope', '$routeParams', '$location', '$q', 'globals', 'TripReport', 'User',
        function($scope, $params, $location, $q, globals, tripReportService, userService) {
            globals.tripId = $params.tripId;
            globals.tripReportScope = $scope;
            
            $scope.tripReport = tripReportService.get({'tripId': $params.tripId},
                function(tripReport) {
                    $scope.numImageRows = Math.ceil(tripReport.images.length / 3);
                    $scope.numImages = tripReport.images.length;
                    $scope.numMaps = tripReport.maps.length;
                    $scope.numGpxs = tripReport.gpxs.length;
                }, 
                function(fail) {
                        alert("Couldn't fetch trip report (" + fail.status + "). A network problem?");
                }
            );
            
            $scope.user = userService.get({}, 
                function(response) {
                    $scope.user = response;
                },
                function(fail) {
                    alert("Couldn't fetch user info (" + fail.status + "). A network problem?");
                }
            );
    
            $scope.editReport = function() {
                // Switch to the edit page if user is authenticated and
                // authorised.
                if ($scope.user.id == 0 || ($scope.user.roles.length == 0 && 
                        $scope.user.id != $scope.tripReport.uploader_id)) {
                    alert("Sorry, but you must be logged into the main website as a club officer or the " +
                            "trip report author to edit this report");
                } else if ($scope.tripReport.id != 0) {
                    globals.tripReportScope = null;
                    $location.url('/edit/' + $scope.tripReport.id);
                }
            };
            
            
            $scope.deleteReport = function() {
                // Delete this current trip report provided the current user is a 
                // club officer or the author, and provided they confirm it's
                // ok to delete it.
                if ($scope.user.id == 0 || ($scope.user.roles.length == 0 && 
                        $scope.user.id != $scope.tripReport.uploader_id)) {
                    alert("Sorry, but you must be logged into the main website as a club officer or the " +
                            "trip report author to delete a report");
                } else if (confirm('Completely delete trip report "' + $scope.tripReport.title +
                        '"? This cannot be undone. Are you quite sure?')) {
                    tripReportService.remove({'tripId': $params.tripId}, function(tripReport) {
                        //alert("Report has been deleted");
                        globals.tripReportScope = null;
                        $location.url('/');
                    })
                }
            };

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
                        encodeURIComponent(globals.SITE_URL + '/dbgpx.php?id=' + gpxid);
            };
            
            // Return the trip report's upload_date in the form Tue 4 January 2014
            $scope.uploadDate = function() {
                var phpDate, datePart, bits, date;
                phpDate = $scope.tripReport.upload_date;
                if (phpDate) { // If defined
                    datePart = phpDate.split(' ')[0];
                    bits = datePart.split('-');
                    date = new Date(bits[0], bits[1], bits[2]);
                    return date.toDateString();
                } else {
                    return '';
                }
            }     
    }]);
}());