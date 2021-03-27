'use strict';

describe('TripShowController: ', function () {
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
            return $controller('TripShowController', { $scope: $scope, $stateParams: { tripId: tripId } });
        };

        $httpBackend = _$httpBackend_;
        site = _site_;
        currentTripReportService = _currentTripReportService_;
    }));

    var tripDetails = {
        "id": "3",
        "trip_type": "club",
        "year": "1995",
        "month": "6",
        "day": "10",
        "duration": "1",
        "date_display": "10 June 1995",
        "user_set_date_display": "0",
        "title": "The Dome",
        "body": "<p class=\"mapreference\">Map  K33<\/p>\r\n\r\n<p>The original plan for this Arthur's Pass base camp trip was (on the\r\nSaturday) to climb Mt Philistine, with most of the party then\r\ntraversing around to Mt Rolleston and coming down the Otira slide.\r\nThe forecast for the weekend was not promising (nor'westers and rain)\r\nso Frank announced at club night that the traverse was off.  This lead\r\nto a certain amount of uncertainty as to who would go up to the club\r\nhut, and what trips would be done. <\/p>\r\n\r\n<p>Not knowing what was planned, Mike Southerwood, Mike Plug and I\r\narranged to travel up to the club hut on Friday afternoon, and to do a\r\nday trip to the Dome on the Saturday.  Mike S regarded the Dome as\r\nunfinished business, having been on a club trip a couple of years ago\r\nthat tried to do the Dome as a day trip, but ran out of time.  We\r\nplanned to make an early start, so turned in before 10.  Sometime\r\nlater, the rest of the group (Simon and Dayle, then Frank, Mike Stewart,\r\nHonora and Les) arrived.  They were somewhat surprised to find us in\r\nbed already---mumblings about \"bedtime for moderate parties\" were\r\nheard through the wall.<\/p>\r\n\r\n<p>The next morning, the V-team was up before 5:30 (Frank came up with\r\nthe name \"V-team\"---he diplomatically wanted to avoid labelling one\r\nthe A-team, and the other the B-team.  The \"V\" was for vegetarian, in\r\nhonour of Mike Southerwood's dietary habits).  The R-team (I'll call\r\nthem that because they did a day trip up Rolleston) were still tucked\r\nup in bed.  The day didn't get off to a particularly auspicious start.\r\nI didn't smell my toast burning, but the smoke alarm did and gave the\r\nR-team an unwelcome wakeup call.  Then Mike Plug, seemingly not quite\r\nawake, went to fill up an already full zip, and caused a spectacular\r\nfountain.<\/p>\r\n\r\n<p>We got away by 6:30 with no further incident, and by 7 were walking\r\nbeside the Bealey River in the dark, looking for a place to cross.\r\nThe crossing place chosen wasn't a particularly good one, as the river\r\nwas flowing quite swiftly at that point.  The river wasn't deep, but\r\nrequired care none-the-less.  Luckily the weather was mild, so I didn't\r\nmind too much that my boots were full of cold water at 7 in the morning.<\/p>\r\n\r\n<p>We walked across the broad shingle and sand flats that make up the\r\njunction of the Bealey, Mingha and Edwards Rivers, and easily found\r\nthe sign pointing to the start of the track leading up the Edwards\r\nRiver.  Finding the track in the dark proved to be more difficult than\r\nfinding the sign, but it wasn't long before we were making good time\r\nalong the track.  It was much darker in the bush than it had been in\r\nthe open river beds, but by the time we had covered about half the\r\ntrack the torches had been turned off.<\/p>\r\n\r\n<p>The track ended back in the Edwards river bed, having taken us past a\r\ngorgy section.  There was still a few inches of snow from the Queen's\r\nBirthday weekend fall.  A party of about three had travelled up river,\r\nprobably to the Edwards River hut.  When we reached the fork where\r\nthe East Edwards joins the Edwards, we followed the East Edwards.\r\nThe East Edwards valley was much narrower than the one we had been in.\r\nThe many large boulders in it slowed progress.<\/p>\r\n\r\n<p>Before long we reached the bottom of a stream, whose shingle bed cut\r\nstraight through the bush.  It was 9AM, and we were directly below the\r\nDome, with about 1000m to climb.  The first part of the climb (well\r\nover half of it) was up a steep scree slope.  Initially, we stayed\r\nclose to the bush on the right hand side so as to stay in areas of\r\nfirmer footing.  Higher up were some small rocky ribs, and tongues of\r\nvegetation.  We moved more into the centre of the scree to take\r\nadvantage of them.  I went further left thinking that the going looked\r\neasier there, but all three of us reached the lip at the top of the\r\nscree at much the same time.<\/p>\r\n\r\n<p>Near the lip, we had a brief rest.  The day had started cloudy, but by\r\nlate morning all of the cloud in the immediate area had cleared,\r\ngiving good views of the mountains to the north.  I began to wish I\r\nhad brought a sun hat.  There had been no snow at the bottom of the\r\nscree, but it at our resting spot it was deep enough for us to break\r\nout the ice axes.  The next part of the climb was up a gentle slope,\r\nthat gradually steepened into a steep climb to the tops.  Mike S left\r\nfirst saying that someone else could take over the plugging when he\r\nwas overtaken, although as it happened Mike P and I didn't overtake\r\nhim.<\/p>\r\n\r\n<p>After travelling over the flat-ish area, we threaded our way between\r\nand over bluffs before reaching the top of the ridge.  Turning to our\r\nleft, we reached the Dome shortly after and had a short lunch break\r\nthere.<\/p>\r\n\r\n<p>The return journey began by walking along the top of the ridge.\r\nThis\r\nfirst involved dropping down to a saddle, then climbing to a peak that\r\nis a bit lower than the Dome.  Progress wasn't fast because the ridge\r\nwas quite a sharp, rocky one covered in snow and a little ice.  After\r\nthe peak the ridge became very wide and quite unusual, consisting of a\r\nseries of mounds and depressions.  Going was much easier, and we soon\r\nreached the scree that we wanted to descend.  It too cut straight\r\nthrough the bush, and took us back down to the Edwards at a point we \r\nhad passed several hours before. <\/p>\r\n\r\n<p>My gammy knee was getting a bit sore, so I lagged a bit behind the two\r\nMikes going down the scree.  This gave me a good view of Mike P trying\r\nto develop a new technique for going down scree.  He had a new pair\r\nof boots and wanted them to last a bit longer than some of the earlier\r\nones.  He'll have to work on his technique a bit more if his shorts\r\nare going to last.  The scree was good, except for a section near the\r\nbottom which was scoured out.  We kept in a soft area on the right \r\nto get past it.<\/p>\r\n\r\n<p>Upon getting back to the Edwards we had a short tea break before\r\nheading back down the valley and later onto the track.  Sunset found\r\nus in about the same place as sunrise, and as darkness fell so did the\r\nrain.  This pleased Mike P no end, who had been wanting to try out his\r\nnew jacket all day.  The Bealey River end of the track proved\r\ndifficult to find for a second time, so near the end of the track we\r\njust cut through the bush back into the river bed.  We crossed\r\nthe Edwards, then the Mingha.  At this point Mike S got a little\r\ndis-oriented, as we went back across the Mingha, then crossed\r\nit for a third time.<\/p>\r\n\r\n<p>Upon reaching the Bealey we found a crossing where the river was\r\nflowing quite slowly.  This crossing turned out to be a bit deeper.  I\r\nwas glad to have the longest legs, so that my shorts (just) remained\r\ndry.  We got back to the hut around 7.  The R-team, having\r\nsuccessfully climbed the low peak of Rolleston, were lolling around\r\nthe hut, mildly curious as to whether a search party might be needed\r\nto go and look for the V-team.<\/p>\r\n\r\n<p>The next morning the Mikes (now known as the \"eager weasels\") were off\r\nat about 7 to climb Mt Aiken.  Simon, Honora and I left about 10 for\r\nChristchurch, leaving the others to get their acts together.  When we\r\nleft the plan was a hill behind Cass (Mt Cass?), possibly followed by\r\nsome bouldering at Castle Hill.<\/p>\r\n\r\n<p>The V-team: Paul Ashton (scribe), Mike Plug, Mike Southerwood.\r\nThe R-team: Mike Stewart, Honora Renwick, Dayle Drummond,\r\nSimon Hassall, Frank King, Les Jones.<\/p>",
        "map_copyright": null,
        "uploader_id": "0",
        "uploader_name": "",
        "upload_date": "1995-07-10 00:00:00",
        "gpxs": [],
        "images": [{
            "id": "2",
            "name": "dome.jpg",
            "type": "jpeg",
            "width": "598",
            "height": "437",
            "t_width": "160",
            "t_height": "117",
            "caption": "Paul and Mike P on the ridge",
            "timestamp": "2011-01-05 21:40:46",
            "ordering": "1"
        }],
        "maps": [],
        "deleter_id": null,
        "last_modified": "2011-01-05 21:40:46"
    };


    var controller;

    beforeEach(function () {
        $httpBackend
            .whenGET(/app\/.*\.html/).respond(200, ''); // workaround for unexpected requests of views

        $httpBackend
            .when('GET', site.url + '/db/index.php/rest/user')
            .respond({ "id": 0 });

        $httpBackend
            .when('GET', site.url + '/db/index.php/rest/tripreports/' + tripDetails.id)
            .respond(tripDetails);

        controller = createController(tripDetails.id);
        $httpBackend.flush();
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    // tests start here
    it('should return the details for the specified trip', function () {
        expect(currentTripReportService.currentTripReport.id).toEqual(tripDetails.id);
    });

    it('should convert and format the upload date correctly', function () {
        expect(currentTripReportService.currentTripReport.upload_date).toEqual('1995-07-10 00:00:00');
        expect($scope.uploadDate()).toEqual('Mon Jul 10 1995');
    });

});
