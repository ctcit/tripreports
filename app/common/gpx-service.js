(function () {
    'use strict';

    // The interface to the CTC GPX REST services
    angular.module('tripReportApp').factory('gpxService', ['$resource', 'site',
        function ($resource, site) {
            return $resource(
                site.URL + '/db/index.php/rest/gpxs/:gpxId',
                { gpxId: '@id' },
                {
                    save: { 'method': 'POST', 'withCredentials': true },
                    remove: { 'method': 'DELETE', 'withCredentials': true }
                }
            );
        }
    ]);

}());
