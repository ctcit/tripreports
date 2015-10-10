 // The top level controller used for navigation and to provide global functions
 
(function () {
    'use strict';

    // Directive for the navigation bar
    angular.module('tripReportApp').directive('navBar', [function () {

        return {
            restrict: 'E',
            templateUrl: 'app/nav-bar/nav-bar.html',
            controllerAs: 'NavBarController'
        };
    }]);


    angular.module('tripReportApp').controller('NavBarController',
        ['$rootScope', '$location', 'currentUser', 'currentTripReportService',
        function ($rootScope, $location, currentUserService, currentTripReportService) {

            $rootScope.currentTripReport = currentTripReportService.get();

            $rootScope.isCollapsed = true;
            $rootScope.isActive = function (viewLocation) { 
                // This version requires a regular expression which must fully match
                // the current location
                return new RegExp('^' + viewLocation + '$').test($location.path());
            };

            $rootScope.editReport = function () {
                // Switch to the edit page if user is authenticated and authorised.
                var currentTripReport = currentTripReportService.get();
                if (!currentTripReport) {
                    if (!currentUserService.isLoggedIn() || (!currentUserService.hasRoles() && currentUserService.currentUser.id != currentTripReport.uploader_id)) {
                        alert("Sorry, but you must be logged into the main website as a club officer or the " +
                                "trip report author to edit this report");
                    } else {
                        $location.url('/edit/' + currentTripReport.id);
                    }
                }
            };

            $rootScope.deleteReport = function () {
                // Delete this current trip report provided the current user is a 
                // club officer or the author, and provided they confirm it's
                // ok to delete it.
                var currentTripReport = currentTripReportService.get();
                if (!currentTripReport) {
                    if (!currentUserService.isLoggedIn() || (!currentUserService.hasRoles() && currentUserService.currentUser.id != currentTripReport.uploader_id)) {
                        alert("Sorry, but you must be logged into the main website as a club officer or the " +
                            "trip report author to delete a report");
                    } else if (confirm('Completely delete trip report "' + currentTripReport.title +
                            '"? This cannot be undone. Are you quite sure?')) {
                        tripReportService.remove({ 'tripId': $params.tripId }, function (tripReport) {
                            //alert("Report has been deleted");
                            $location.url('/');
                        })
                    }
                }
            };


        }
    ]);

}());
