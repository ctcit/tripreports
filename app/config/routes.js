//(function () {
//    'use strict';

//    // Route provider
//    angular.module('tripReportApp').config(['$routeProvider',
//      function ($routeProvider) {
//          $routeProvider.
//            when('/', {
//                templateUrl: 'app/trip-years/trip-years.html',
//                controller: 'TripYearsController',
//                resolve: {
//                    currentUser: ['currentUserService',
//                        function (currentUserService) {
//                            return currentUserService.load();
//                        }
//                    ]
//                }
//            }).
//            when('/tripreportsforyear/:year', {
//                templateUrl: 'app/trips-in-year/trips-in-year.html',
//                controller: 'TripsInYearController'
//            }).
//            when('/create', {
//                templateUrl: 'app/trip-edit/trip-edit.html',
//                controller: 'TripEditController'
//            }).
//            when('/edit/:tripId', {
//                templateUrl: 'app/trip-edit/trip-edit.html',
//                controller: 'TripEditController'
//            }).
//            when('/:showordelete/:tripId', {
//                templateUrl: 'app/trip-show/trip-show.html',
//                controller: 'TripShowController'
//            }).
//            otherwise({
//                redirectTo: '/'
//            });
//      }]);


//}());


