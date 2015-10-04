(function () {
    'use strict';

    // The interface to the CTC TripImages REST services
    angular.module('tripReportApp').factory('imageService', ['$resource', 'site',
        function ($resource, site) {
            return $resource(
                site.URL + '/db/index.php/rest/tripimages/:imageId',
                { imageId: '@id' },
                {
                    save: { 'method': 'POST', 'withCredentials': true },
                    remove: { 'method': 'DELETE', 'withCredentials': true }
                }
            );
        }
    ]);

}());
