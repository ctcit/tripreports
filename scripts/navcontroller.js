 // The top level controller used for navigation and to provide global functions
 
(function () {
    'use strict';

    angular.module('tripReportApp').controller('NavController',
        ['$rootScope', '$location', 'globals',
        function($rootScope, $location, globals) {
            $rootScope.globals = globals;
            $rootScope.isCollapsed = true;
            $rootScope.isActive = function (viewLocation) { 
                // This version requires a regular expression which must fully match
                // the current location
                return new RegExp('^' + viewLocation + '$').test($location.path());
            };
        }  
    ]);
}());
