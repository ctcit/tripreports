'use strict';

describe('TripEditController: ', function () {
    var $scope;
    var createController;
    var $httpBackend;
    var site;
    var currentTripReportService;

    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('tripReportApp'));

    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function ($rootScope, $controller, _$httpBackend_, _site_, _currentTripReportService_) {
        //create an empty scope
        $scope = $rootScope.$new();

        createController = function (tripId) {
            return $controller('TripEditController', { $scope: $scope, $stateParams: { tripId: tripId } });
        };

        $httpBackend = _$httpBackend_;
        site = _site_;
        currentTripReportService = _currentTripReportService_;
    }));

    var tripDetails = {
        "id": "581",
        "trip_type": "club",
        "year": "2012",
        "month": "11",
        "day": "10",
        "duration": "1",
        "date_display": "10 November 2012",
        "user_set_date_display": "0",
        "title": "Orton Bradley to Mt  Herbert to Packhorse to Gebbies Pass",
        "body": "<p>TOO HOT TOO SOON...maybe that was the main complaint for the day...where was the cloud cover till noon?</p><p>7 members and two visitors started out from the impressive Orton Bradley Park. Following the valley track alongside a stream and through some impressive gum trees we broke onto farm land, starting the gentle long climb up. Leader was equipped with pruners after her last experience here putting your arms over your face and pushing through the gorse but this time an&nbsp;obvious amount of track clearance had been done .... until we reached a nice patch of NZ stinging nettles that the newcomers were acquainted with.</p><p>We found a shady spot to stop for morning tea and Les with his altimeter said we were more than half way to summit ... then some of the group including leader slowed more than occasionally ..... did Mt Herbert get higher with the quake or does one year older do this to you or no real climbs for a few months??????</p><p>Great views all round .... at the top the leader left to retrieve cars with David Cooke and the others feel I had the easier trip back, due mainly due to gorse as they dropped down to packhorse hut. They were told to toughen up.</p><p>After complaints of hardship, cramps and other rubbish we stopped at SHE cafe where most things were forgotten.</p><p>Trampers were Les Grant, David Cooke, Andrew Tromans, Lovisa Eriksson, Jean-Luc Devis, Michael Parker, visitor Ray friend of Michael Lavarias and Liz Tanner (leader and scribe).</p>",
        "map_copyright": "Topomap data is Crown Copyright Reserved.",
        "uploader_id": "1918",
        "uploader_name": "Liz Tanner",
        "upload_date": "2012-11-11 18:08:41",
        "gpxs": [{
            "id": "79",
            "name": "Black Hill - 9 October 2011.gpx",
            "caption": "Black Hill via Redcliffe Stream",
            "ordering": "0"
        }, {
            "id": "80",
            "name": "Black Hill - 9 October 2011.gpx",
            "caption": "Black Hill via Redcliffe Stream",
            "ordering": "0"
        }],
        "images": [
            {
                "id": "1319",
                "name": "tn.jpg",
                "type": "jpeg",
                "width": "150",
                "height": "113",
                "t_width": "165",
                "t_height": "124",
                "caption": "rest time",
                "timestamp": "2012-11-12 17:17:56",
                "ordering": "0"
            },
            {
                "id": "1320",
                "name": "tn.jpg1.jpg",
                "type": "jpeg",
                "width": "150",
                "height": "113",
                "t_width": "165",
                "t_height": "124",
                "caption": "the view  a lot of yellow",
                "timestamp": "2012-11-12 17:17:56",
                "ordering": "1"
            },
            {
                "id": "1321",
                "name": "tn.jpg2.jpg",
                "type": "jpeg",
                "width": "150",
                "height": "113",
                "t_width": "165",
                "t_height": "124",
                "caption": "downward bound",
                "timestamp": "2012-11-12 17:17:56",
                "ordering": "2"
            }
        ],
        "maps": [
            {
                "id": "923",
                "name": "Black Hill map.jpg",
                "type": "jpeg",
                "width": "1024",
                "height": "685",
                "t_width": "165",
                "t_height": "110",
                "caption": "Black Hill Freshmap image",
                "timestamp": "2011-10-16 01:30:23",
                "ordering": "0"
            },
            {
                "id": "924",
                "name": "Black Hill google Earth image.jpg",
                "type": "jpeg",
                "width": "1024",
                "height": "758",
                "t_width": "165",
                "t_height": "122",
                "caption": "Black Hill Google Earth image",
                "timestamp": "2011-10-16 01:30:23",
                "ordering": "1"
            }
        ],
        "deleter_id": null,
        "last_modified": "2012-11-11 18:08:41"
    };


    var controller;

    beforeEach(function () {
        $httpBackend
            .whenGET(/app\/.*\.html/).respond(200, ''); // workaround for unexpected requests of views

        $httpBackend
            .when('GET', site.URL + '/db/index.php/rest/user')
            .respond({ "id": 0 });

        $httpBackend
            .when('GET', site.URL + '/db/index.php/rest/tripreports/' + tripDetails.id)
            .respond(tripDetails);

        controller = createController(tripDetails.id);
        $httpBackend.flush();
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    //--------------


    // tests start here
    describe('loading', function () {
        it('should return the details for the specified trip', function () {
            expect(currentTripReportService.currentTripReport.id).toEqual(tripDetails.id);
        });
    });

    //----

    describe('trip date range formatting', function () {

        it('should format the single day trip date range correctly', function () {
            //"year": "2012",
            //"month": "11",
            //"day": "10",
            //"duration": "1",
            //"date_display": "10 November 2012",
            expect($scope.getDateDisplay()).toEqual('10-10 November 2012');
        });

        it('should format the multi-day trip date range correctly (within month)', function () {
            currentTripReportService.currentTripReport.duration = 5;
            expect($scope.getDateDisplay()).toEqual('10-14 November 2012');
        });

        it('should format the multi-day trip date range correctly (across months)', function () {
            currentTripReportService.currentTripReport.duration = 5;
            currentTripReportService.currentTripReport.day = 29;
            expect($scope.getDateDisplay()).toEqual('29 November - 3 December 2012');
        });

        it('should format the multi-day trip date range correctly (across years)', function () {
            currentTripReportService.currentTripReport.duration = 5;
            currentTripReportService.currentTripReport.day = 29;
            currentTripReportService.currentTripReport.month = 12;
            expect($scope.getDateDisplay()).toEqual('29 December 2012 - 2 January 2013');
        });

    });

    //----

    describe('resource positioning', function () {

        it('should move an image down', function () {
            var currentTripReport = currentTripReportService.currentTripReport;
            expect(currentTripReport.id).toEqual(tripDetails.id);
            expect(currentTripReport.images.length).toEqual(3);
            expect(currentTripReport.images[0].id).toEqual('1319');
            expect(currentTripReport.images[1].id).toEqual('1320');
            expect(currentTripReport.images[2].id).toEqual('1321');

            $scope.moveDown('image', 0);
            expect(currentTripReport.images[0].id).toEqual('1320');
            expect(currentTripReport.images[1].id).toEqual('1319');
            expect(currentTripReport.images[2].id).toEqual('1321');

            $scope.moveDown('image', 1);
            expect(currentTripReport.images[0].id).toEqual('1320');
            expect(currentTripReport.images[1].id).toEqual('1321');
            expect(currentTripReport.images[2].id).toEqual('1319');

        });

        it('should move an image up', function () {
            var currentTripReport = currentTripReportService.currentTripReport;
            expect(currentTripReport.id).toEqual(tripDetails.id);
            expect(currentTripReport.images.length).toEqual(3);
            expect(currentTripReport.images[0].id).toEqual('1319');
            expect(currentTripReport.images[1].id).toEqual('1320');
            expect(currentTripReport.images[2].id).toEqual('1321');

            $scope.moveUp('image', 2);
            expect(currentTripReport.images[0].id).toEqual('1319');
            expect(currentTripReport.images[1].id).toEqual('1321');
            expect(currentTripReport.images[2].id).toEqual('1320');

            $scope.moveUp('image', 1);
            expect(currentTripReport.images[0].id).toEqual('1321');
            expect(currentTripReport.images[1].id).toEqual('1319');
            expect(currentTripReport.images[2].id).toEqual('1320');

        });

        it('should move a GPX down', function () {
            var currentTripReport = currentTripReportService.currentTripReport;
            expect(currentTripReport.id).toEqual(tripDetails.id);
            expect(currentTripReport.gpxs.length).toEqual(2);
            expect(currentTripReport.gpxs[0].id).toEqual('79');
            expect(currentTripReport.gpxs[1].id).toEqual('80');

            $scope.moveDown('gpx', 0);
            expect(currentTripReport.gpxs[0].id).toEqual('80');
            expect(currentTripReport.gpxs[1].id).toEqual('79');

        });

        it('should move a GPX up', function () {
            var currentTripReport = currentTripReportService.currentTripReport;
            expect(currentTripReport.id).toEqual(tripDetails.id);
            expect(currentTripReport.gpxs.length).toEqual(2);
            expect(currentTripReport.gpxs[0].id).toEqual('79');
            expect(currentTripReport.gpxs[1].id).toEqual('80');

            $scope.moveUp('gpx', 1);
            expect(currentTripReport.gpxs[0].id).toEqual('80');
            expect(currentTripReport.gpxs[1].id).toEqual('79');

        });

        it('should move a map down', function () {
            var currentTripReport = currentTripReportService.currentTripReport;
            expect(currentTripReport.id).toEqual(tripDetails.id);
            expect(currentTripReport.maps.length).toEqual(2);
            expect(currentTripReport.maps[0].id).toEqual('923');
            expect(currentTripReport.maps[1].id).toEqual('924');

            $scope.moveDown('map', 0);
            expect(currentTripReport.maps[0].id).toEqual('924');
            expect(currentTripReport.maps[1].id).toEqual('923');

        });

        it('should move a map up', function () {
            var currentTripReport = currentTripReportService.currentTripReport;
            expect(currentTripReport.id).toEqual(tripDetails.id);
            expect(currentTripReport.maps.length).toEqual(2);
            expect(currentTripReport.maps[0].id).toEqual('923');
            expect(currentTripReport.maps[1].id).toEqual('924');

            $scope.moveUp('map', 1);
            expect(currentTripReport.maps[0].id).toEqual('924');
            expect(currentTripReport.maps[1].id).toEqual('923');

        });
    });

    //----

    describe('resource deletion', function () {

        beforeEach(function () {
            // Mock out the confirmation prompt
            $scope.confirm = function (message) {
                return true; // Todo
            }
        });

        it('should delete an image', function () {
            var currentTripReport = currentTripReportService.currentTripReport;
            expect(currentTripReport.id).toEqual(tripDetails.id);
            expect(currentTripReport.images.length).toEqual(3);
            expect(currentTripReport.images[0].id).toEqual('1319');
            expect(currentTripReport.images[1].id).toEqual('1320');
            expect(currentTripReport.images[2].id).toEqual('1321');

            $scope.delete('image', 0);
            expect(currentTripReport.images.length).toEqual(2);
            expect(currentTripReport.images[0].id).toEqual('1320');
            expect(currentTripReport.images[1].id).toEqual('1321');

            $scope.delete('image', 1);
            expect(currentTripReport.images.length).toEqual(1);
            expect(currentTripReport.images[0].id).toEqual('1320');

            $scope.delete('image', 0);
            expect(currentTripReport.images.length).toEqual(0);

        });

        it('should delete a GPX', function () {
            var currentTripReport = currentTripReportService.currentTripReport;
            expect(currentTripReport.id).toEqual(tripDetails.id);
            expect(currentTripReport.gpxs.length).toEqual(2);
            expect(currentTripReport.gpxs[0].id).toEqual('79');
            expect(currentTripReport.gpxs[1].id).toEqual('80');

            $scope.delete('gpx', 1);
            expect(currentTripReport.gpxs.length).toEqual(1);
            expect(currentTripReport.gpxs[0].id).toEqual('79');

            $scope.delete('gpx', 0);
            expect(currentTripReport.gpxs.length).toEqual(0);

        });

        it('should delete a map', function () {
            var currentTripReport = currentTripReportService.currentTripReport;
            expect(currentTripReport.id).toEqual(tripDetails.id);
            expect(currentTripReport.maps.length).toEqual(2);
            expect(currentTripReport.maps[0].id).toEqual('923');
            expect(currentTripReport.maps[1].id).toEqual('924');

            $scope.delete('map', 0);
            expect(currentTripReport.maps.length).toEqual(1);
            expect(currentTripReport.maps[0].id).toEqual('924');

            $scope.delete('map', 0);
            expect(currentTripReport.maps.length).toEqual(0);
        });

    });
});