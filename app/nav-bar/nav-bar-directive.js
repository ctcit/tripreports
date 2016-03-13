 // The top level controller used for navigation and to provide global functions
 
(function () {
    'use strict';

    // Directive for the navigation bar, which is shown only if we're the
    // top level window.
    angular.module('tripReportApp').directive('navBar', [function () {

        return {
            restrict: 'E',
            replace: true,
            //templateUrl: 'app/nav-bar/nav-bar.html', // difficult to test when view is in separate file
            template:
                '<nav class="navbar navbar-inverse navbar-fixed-top"\n\
                      role="navigation"\n\
                      ng-controller="NavBarController"\n\
                      ng-if="!isInFrame()">\
                    <div class="container">\
                        <div class="navbar-header">\
                            <button type="button" class="navbar-toggle"\
                                    ng-init="isCollapsed = true"\
                                    ng-click="isCollapsed = !isCollapsed">\
                                <span class="sr-only">Toggle navigation</span>\
                                <span class="icon-bar"></span>\
                                <span class="icon-bar"></span>\
                                <span class="icon-bar"></span>\
                            </button>\
                            <a class="navbar-brand" href="#">CTC Trip Reports</a>\
                        </div>\
                        <div class="navbar-collapse" ng-class="{collapse: isCollapsed}">\
                            <ul class="nav navbar-nav" ng-click="isCollapsed = true">\
                                <li ng-class="{ active: isBrowseActive() }">\
                                    <a ui-sref="tripreports.years">Browse</a>\
                                </li>\
                                <li ng-if="currentTripReport()" id="edit" ng-class="{ active: isEditActive() }">\
                                    <a href="" ng-click="editReport()">Edit</a>\
                                </li>\
                                <li ng-if="currentTripReport()" id="delete" ng-class="{ active: isDeleteActive() }">\
                                    <a href="" ng-click="deleteReport()">Delete</a>\
                                </li>\
                                <li ng-if="!currentTripReport()" id="create" ng-class="{ active: isCreateActive() }">\
                                    <a ui-sref="tripreports.create">Create</a>\
                                </li>\
                            </ul>\
                        </div>\
                    </div>\
                </nav>',
            controllerAs: 'navBarController'
        };
    }]);


    angular.module('tripReportApp').controller('NavBarController',
        ['$rootScope', '$state', 'currentUserService', 'currentTripReportService',
        function ($rootScope, $state, currentUserService, currentTripReportService) {
            
            $rootScope.bodyStyle = function () {
                if ($rootScope.isInFrame()) {
                    return {};//{"padding-top": "0px"};
                } else {
                    return {"padding-top": "50px"};
                }
            }
          
                
            // Function to check if we're in an iframe. true if we are.
            $rootScope.isInFrame = function () { 
                try {
                    //return false;//Testing
                    return window.self !== window.top;
                } catch (e) {
                    return true;
                }
            }
            
            $rootScope.currentTripReport = function () {
                return currentTripReportService.currentTripReport;
            }

            $rootScope.isCollapsed = true;

            function isState(state) { 
                return $state.$current.name == state;
            };
            
            function authorised (editOrDelete, tripReport) {
                // Given a string 'edit' or 'delete', confirm that the
                // current user has the appropriate rights on the given
                // tripReport. Return true if so, issue an alert and return
                // false if not.
                if (currentUserService && currentUserService.isLoggedIn() &&
                      (currentUserService.hasRoles() || currentUserService.currentUser().id == tripReport.uploader_id)) {
                    return true;
                } else {
                    alert("Sorry, but you must be logged into the main website as a club officer " +
                        "or the trip report author to " + editOrDelete + " this report");
                    return false;
                }   
            };
            
            $rootScope.canEdit = function () {
                var tripReport = $rootScope.currentTripReport();
                if (!tripReport) {
                    return false;
                } else {
                    return currentUserService && currentUserService.isLoggedIn() && 
                      (currentUserService.hasRoles() || currentUserService.currentUser().id == tripReport.uploader_id);
                }
            }
            
            $rootScope.authorised = authorised;  // Hack/hook for testing

            $rootScope.isBrowseActive = function () {
                return isState('tripreports.years') || isState('tripreports.foryear');
            }
            $rootScope.isEditActive = function () {
                return isState('tripreports.edit');
            }
            $rootScope.isDeleteActive = function () {
                return false;  // No such state, currently
            }
            $rootScope.isCreateActive = function () {
                return isState('tripreports.create');
            }
            
            $rootScope.editReport = function () {
                // Switch to the edit page if user is authenticated and authorised.
                var currentTripReport = currentTripReportService.currentTripReport;
                if (currentTripReport && authorised('edit', currentTripReport)) {
                    $state.go('tripreports.edit', { tripId: currentTripReport.id });
                }
            };

            $rootScope.deleteReport = function () {
                // Delete this current trip report provided the current user is a 
                // club officer or the author, and provided they confirm it's
                // ok to delete it.
                var currentTripReport = currentTripReportService.currentTripReport;
                if (currentTripReport && 
                        authorised('edit', currentTripReport) &&
                        confirm('Completely delete trip report "' + currentTripReport.title +
                            '"? This cannot be undone. Are you quite sure?')) {
                    currentTripReportService.remove({ 'tripId': $params.tripId }, function (tripReport) {
                        //alert("Report has been deleted");
                        $state.go('tripreports.years');
                    });
                };
            };
            $rootScope.navigateToTripReport = function (event, tripid) {
                // This is the key -> preventing default navigation
                event.preventDefault();
                $state.go('tripreports.show', { tripId: tripid});
            };
        
        }
    ]);
    
    // Add an event listener for changes in the state (i.e. route). Attempt
    // to update the main site URL in the top window if we're running in an
    // embedded iframe. 
    angular.module('tripReportApp').run(
        ['$rootScope', '$location', 'site',
         function ($rootScope, $location, site) {
            var goto, newLocation;
            $rootScope.$on('$stateChangeSuccess', function () {
                if ($rootScope.isInFrame && $rootScope.isInFrame()) {
                    goto = $location.url();
                    if (goto[0] === '/') {
                        goto = goto.substring(1);
                    }
                    goto = goto.replace('/', '%2F');
                    newLocation = site.tripreportbaseurl + '?goto=' + goto;
                    //newLocation = '../index.php/trip-reports?goto=' + goto;
                    window.top.history.pushState('string', '', newLocation);
                    console.log('New parent url: ' + newLocation);
                }
            })
         }]
    );

}());
