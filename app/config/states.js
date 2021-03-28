(function () {
    'use strict';

    // State provider
    angular.module('tripReportApp').config(['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {

          $urlRouterProvider
              .when('/tripreports', '/tripreports')
              .otherwise('/tripreports');


          $stateProvider.
            state('tripreports', {
                views: {
                    'app-content': {
                        templateUrl: 'app/app.html'
                    }
                },
                resolve: {
                    currentUser: ['currentUserService',
                        function (currentUserService) {
                            return currentUserService.load();
                        }
                    ]
                }
            }).
            state('tripreports.years', {
                url: '/tripreports',
                views: {
                    'main-content': {
                        templateUrl: 'app/trip-years/trip-years.html',
                        controller: 'TripYearsController'
                    }
                }
            }).
            state('tripreports.foryear', {
                url: '/tripreportsforyear/:year',
                views: {
                    'main-content': {
                        templateUrl: 'app/trips-in-year/trips-in-year.html',
                        controller: 'TripsInYearController'
                    }
                }
            }).
            state('tripreports.recent', {
                url: '/recenttripreports/:maxrecent/:maxdays',
                views: {
                    'main-content': {
                        templateUrl: 'app/recent-trips/recent-trips.html',
                        controller: 'RecentTripsController'
                    }
                }
            }).
            state('tripreports.show', {
                url: '/tripreports/:tripId',
                views: {
                    'main-content': {
                        templateUrl: 'app/trip-show/trip-show.html',
                        controller: 'TripShowController'
                    }
                }
            }).
            state('tripreports.create', {
                url: '/tripreports/create',
                views: {
                    'main-content': {
                        templateUrl: 'app/trip-edit/trip-edit.html',
                        controller: 'TripEditController'
                    }
                }
            }).
            state('tripreports.edit', {
                url: '/tripreports/edit/:tripId',
                views: {
                    'main-content': {
                        templateUrl: 'app/trip-edit/trip-edit.html',
                        controller: 'TripEditController'
                    }
                }
            }).
            state('tripreports.cards', {
                url: '/recenttripreportcards/:maxrecent/:maxdays',
                views: {
                    'main-content': {
                        templateUrl: 'app/recent-trip-cards/recent-trip-cards.html',
                        controller: 'RecentTripCardsController'
                    }
                }
            });
      }]);

}());


