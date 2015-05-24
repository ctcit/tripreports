(function () {
    'use strict';

    /* App Module */

    var tripReportApp = angular.module('tripReportApp', [
      'ngRoute',
      'ngResource',
      'tripReportControllers'
    ]);
    
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
    
    // This is meant to prevent caching of old view code, but doesn't
    // always work.
    tripReportApp.run(function($rootScope, $templateCache) {
       $rootScope.$on('$viewContentLoaded', function() {
          $templateCache.removeAll();
       });
    });
    
    
    tripReportApp.factory('globals', function() {
        var globals = {
            SITE_URL: 'http://192.168.20.22/ctc',
            MAX_UPLOAD_IMAGE_DIMENSION: 1000, // Max width or height in pixels
            UPLOAD_IMAGE_QUALITY: 0.6,
            tripId: 0  // The ID of the trip report currently being shown or edited
        };
        return globals;
    })
    
    // The interface to the CTC Trip Reports REST services
    tripReportApp.factory('TripReport', ['$resource', 'globals',
        function($resource, globals) {
            return $resource(
                        globals.SITE_URL + '/db/index.php/rest/tripreports/:tripId',
                        {'tripId': '@id'},
                        {
                            update: {'method': 'PUT', 'isArray': false}
                        }
            );
        }
    ]);
    
    
    // The interface to the CTC Images REST services
    tripReportApp.factory('Image', ['$resource', 'globals',
        function($resource, globals) {
            return $resource(globals.SITE_URL + '/db/index.php/rest/images/:imageId', {'imageId': '@id'});
        }
    ]);
    
    
    // The interface to the CTC GPX REST services
    tripReportApp.factory('Gpx', ['$resource', 'globals',
        function($resource, globals) {
            return $resource(globals.SITE_URL + '/db/index.php/rest/gpxs/:gpxId', {'gpxId': '@id'});
        }
    ]);

    // Route provider
    tripReportApp.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider.
          when('/tripreports', {
            templateUrl: 'partials/tripreportyears.html',
            controller: 'TripYearsController'
          }).
          when('/tripreportsforyear/:year', {
            templateUrl: 'partials/tripreportlist.html',
            controller: 'TripsInYearController'
          }).
          when('/tripreports/create', {
            templateUrl: 'partials/edit.html',
            controller: 'TripEditController'
          }).
          when('/tripreports/edit/:tripId', {
            templateUrl: 'partials/editReport.html',
            controller: 'TripEditController'
          }).
          when('/tripreports/:tripId', {
            templateUrl: 'partials/tripreport.html',
            controller: 'TripShowController'
          }).
          otherwise({
            redirectTo: '/tripreports'
          });
      }]);
  
    // Directive used to initialise ckEditor RichText plugin
    // See http://stackoverflow.com/questions/18917262/updating-textarea-value-with-ckeditor-content-in-angular-js
    tripReportApp.directive('ckEditor', [function () {
        return {
            require: '?ngModel',
            link: function ($scope, element, attrs, ngModel) {
                var config, ck, updateModel, savedData;

                config = {
                    // CKEditor config
                };

                ck = CKEDITOR.replace(element[0], config);

                if (!ngModel) {
                    return;
                }

                ck.on('instanceReady', function() {
                    var data = ngModel.$viewValue;
                    if (data) {
                        ck.setData(data);
                    } else if (savedData) { 
                        // Hack to handle some weird sort of race problem.
                        // It seems the call to render with valid data
                        // can occur before the instance is ready but
                        // when instanceReady fires the data isn't valid!
                        // So we use the valid data supplied already.
                        ck.setData(savedData);
                    }
                });

                function updateModel() {
                    $scope.$apply(function() {
                        ngModel.$setViewValue(ck.getData());
                    });
                }

                ck.on('change', updateModel);
                ck.on('dataReady', updateModel);
                ck.on('key', updateModel);

                ngModel.$render = function() {
                    var data = ngModel.$viewValue;
                    if (data) {
                        ck.setData(data);
                        savedData = data;
                    }
                };
            }
      };
    }]);

    // Directive to provide an onChange event handler for input type=file
    // From http://stackoverflow.com/questions/16631702/file-pick-with-angular-js
    tripReportApp.directive('fileChange', ['$parse', function($parse) {

        return {
          require: 'ngModel',
          restrict: 'A',
          link: function ($scope, element, attrs, ngModel) {

            // Get the function provided in the file-change attribute.
            // Note the attribute has become an angular expression,
            // which is what we are parsing. The provided handler is 
            // wrapped up in an outer function (attrHandler) - we'll 
            // call the provided event handler inside the handler()
            // function below.
            var attrHandler = $parse(attrs['fileChange']);

            // This is a wrapper handler which will be attached to the
            // HTML change event.
            var handler = function (e) {

              $scope.$apply(function () {

                // Execute the provided handler in the directive's scope.
                // The files variable will be available for consumption
                // by the event handler.
                attrHandler($scope, { $event: e, files: e.target.files });
              });
            };

            // Attach the handler to the HTML change event 
            element[0].addEventListener('change', handler, false);
          }
        };
    }]);
}());
