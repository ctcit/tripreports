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

    var tripDetails1 = {
        "id": "3",
        "uploader_id": "17"
    };
    
    var tripDetails2 = {
        "id": "4",
        "uploader_id": "18"
    };
    
    var userDetails1 = {
        "id": "17",
        "roles": []
    };
    
    var userDetails2 = {
        "id": "200",
        "roles": ['webmaster']
    };

    beforeEach(function () {
        $httpBackend
            .whenGET(/app\/.*\.html/).respond(200, ''); // workaround for unexpected requests of views

        $httpBackend
            .when('GET', site.URL + '/db/index.php/rest/tripreports/' + tripDetails1.id)
            .respond(tripDetails1);
    
        $httpBackend
            .when('GET', site.URL + '/db/index.php/rest/tripreports/' + tripDetails2.id)
            .respond(tripDetails2);
    
        $httpBackend
            .when('GET', site.URL + '/db/index.php/rest/user')
            .respond(userDetails1);

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
        $state.go('tripreports.show', { tripId: tripDetails1.id }); // Hmmm... not running controller
        $httpBackend.flush();
        currentTripReportService.currentTripReport = tripDetails1; // workaround
        $rootScope.$digest();

        expect(element[0].innerText).toContain("Browse");
        expect(element[0].innerText).toContain("Edit");
        expect(element[0].innerText).toContain("Delete");

        expect(element[0].innerText).not.toContain("Create");
    });
    
    it('should allow the author of a report to edit and delete it', function() {
        $state.go('tripreports.show', { tripId: tripDetails1.id });
        $httpBackend.flush();
        $rootScope.$digest();
        expect($rootScope.authorised('edit', tripDetails1)).toBe(true);
        expect($rootScope.authorised('delete', tripDetails1)).toBe(true);
    });
    
    
    it('should allow a user with roles to edit and delete any trip report', function() {
        $state.go('tripreports.show', { tripId: tripDetails1.id });
        $httpBackend.flush();
        $rootScope.$digest();
        expect($rootScope.authorised('edit', tripDetails1)).toBe(true);
        expect($rootScope.authorised('delete', tripDetails1)).toBe(true);
    });
    
    it('should not allow a non-author of a report to edit and delete it', function() {
        $state.go('tripreports.show', { tripId: tripDetails2.id });
        $httpBackend.flush();
        $rootScope.$digest();
        expect($rootScope.authorised('edit', tripDetails2)).toBe(false);
        expect($rootScope.authorised('delete', tripDetails2)).toBe(false);
    });

});