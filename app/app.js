(function () {
    'use strict';

    /* App Module */

    var tripReportApp = angular.module('tripReportApp', [
      'ngRoute',
      'ngResource',
      'ui.router'
    ]);
    
    // Set global constant site.url from window.location
    var full_url = window.location.href,
        pathMatcher = new RegExp('(.*?)/tripreports.*'),
        bits = pathMatcher.exec(full_url),
        site_url = 'invalidurl';
    if (bits != null) {
        site_url = bits[1];
    } else {
        console.log("TripReport module fetched from an unexpected address");
    }
    console.log("Setting site url to " + site_url);
    // tripReportApp.constant('site', {'url': site_url});
    
    // TODO find a better solution to having to reconfigure the following links manually
    tripReportApp.constant('site',
        {'url': 'http://localhost/joomla',
         'tripreportbaseurl': 'http://localhost/joomla/index.php/trip-reports',
         'resturl': 'http://localhost/ctc/db/index.php/rest',
         'imageurl': 'http://localhost/ctc'});
    
    
    tripReportApp.config( [
        '$compileProvider',
        function($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):|data:image\//);
        }
    ]);

    
    // Define global functions for the app
    
    tripReportApp.run(function ($rootScope, $sce) {
        $rootScope.range = function(start, stop) {
            // Equivalent to Python's range function
            var i = 0,
                n = start, // Assume stop not given
                list = [];
            if (stop) {
                i = start;
                n = stop;
            }
            for (; i < n; i++) {
                list.push(i);
            }
            return list;
        };
        
        
        $rootScope.pluralise = function(s, n) {
            // Return string s with an 's' added if n > 1
            return n > 1 ? s + 's' : s;
        };
        
        $rootScope.trusted = function(s) {
            return $sce.trustAsHtml(s);
        };
    });
    
    tripReportApp.filter('unsafe', function ($sce) {
        return $sce.trustAsHtml;
    });

    // This is meant to prevent caching of old view code, but doesn't
    // always work.
    tripReportApp.run(function($rootScope, $templateCache) {
       $rootScope.$on('$viewContentLoaded', function() {
          $templateCache.removeAll();
       });
    });
    
    tripReportApp.run(function ($state) {
        $state.go('tripreports.years');
    });

}());
