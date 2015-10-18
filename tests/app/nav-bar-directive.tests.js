'use strict';

describe('NavBarController: ', function () {
    var $compile;
    var $rootScope;
    var createController;
    var $state;
    var $httpBackend;
    var site;
    var currentUserService;
    var currentTripReportService;

    var element;

    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('tripReportApp'));

    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function (_$compile_, _$rootScope_, $controller, _$httpBackend_, _site_, _$state_, _currentUserService_, _currentTripReportService_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        $httpBackend = _$httpBackend_;
        site = _site_;
        $state = _$state_;
        currentUserService = _currentUserService_;
        currentTripReportService = _currentTripReportService_;
    }));

    var tripDetails = {
        "id": "3"
    };

    beforeEach(function () {
        $httpBackend
            .whenGET(/app\/.*\.html/).respond(200, ''); // workaround for unexpected requests of views

        $httpBackend
            .when('GET', site.URL + '/db/index.php/rest/user')
            .respond({ "id": 0 });

        $httpBackend
            .when('GET', site.URL + '/db/index.php/rest/tripreports/' + tripDetails.id)
            .respond(tripDetails);

        $httpBackend.flush();

        element = $compile("<nav-bar></nav-bar>")($rootScope);
        $rootScope.$digest();
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    // tests start here
    it('should have only Browse and Create buttons visible when showing trip years', function () {

        expect(element[0].innerText).toContain("Browse");
        expect(element[0].innerText).toContain("Create");

        expect(element[0].innerText).not.toContain("Edit");
        expect(element[0].innerText).not.toContain("Delete");
    });

    it('should have only Browse and Create buttons visible when showing trips in year', function () {
        $state.go('tripreports.foryear', { year: 2000 }); // Hmmm... not running controller
        $httpBackend.flush();

        expect(element[0].innerText).toContain("Browse");
        expect(element[0].innerText).toContain("Create");

        expect(element[0].innerText).not.toContain("Edit");
        expect(element[0].innerText).not.toContain("Delete");
    });

    it('should have only Browse, Edit, and Delete buttons visible when showing a specific trip', function () {
        $state.go('tripreports.show', { tripId: tripDetails.id }); // Hmmm... not running controller
        $httpBackend.flush();
        currentTripReportService.currentTripReport = tripDetails; // workaround
        $rootScope.$digest();

        expect(element[0].innerText).toContain("Browse");
        expect(element[0].innerText).toContain("Edit");
        expect(element[0].innerText).toContain("Delete");

        expect(element[0].innerText).not.toContain("Create");
    });

});