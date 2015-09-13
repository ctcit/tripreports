﻿'use strict';

describe('TripsInYearController: ', function () {
    var $scope;
    var createController;
    var $httpBackend;
    var globals;

    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('tripReportApp'));

    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function ($rootScope, $controller, _$httpBackend_, _globals_) {
        //create an empty scope
        $scope = $rootScope.$new();

        createController = function (year) {
            return $controller('TripsInYearController', { $scope: $scope, $routeParams: { year: year } });
        };

        $httpBackend = _$httpBackend_;
        globals = _globals_;
    }));

    var year = "1989";
    var tripsForYear = [{
                "id": "3",
                "trip_type": "club",
                "year": "1995",
                "month": "6",
                "day": "10",
                "duration": "1",
                "date_display": "10 June 1995",
                "user_set_date_display": "0",
                "title": "The Dome"
            },
            {
                "id": "1",
                "trip_type": "club",
                "year": "1995",
                "month": "1",
                "day": "14",
                "duration": "1",
                "date_display": "14 January 1995",
                "user_set_date_display": "0",
                "title": "Mt Enys"
            }];

    var controller;

    beforeEach(function () {
        $httpBackend
            .when('GET', globals.SITE_URL + '/db/index.php/rest/yearstripreports/' + year)
            .respond(tripsForYear);

        controller = createController(year);
        $httpBackend.flush();
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    
    // tests start here
    it('should return the list of trips for the specified year', function () {
        expect($scope.year).toEqual(year);
        expect($scope.triplist).toEqual(tripsForYear);
    });

});