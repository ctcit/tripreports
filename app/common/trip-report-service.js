(function () {
    'use strict';

    // The interface to the CTC Trip Reports REST services
    angular.module('tripReportApp').factory('tripReportService', ['$resource', 'site',
        function ($resource, site) {
            return $resource(
                site.url + '/db/index.php/rest/tripreports/:tripId',
                { tripId: '@id' },
                {
                    save:   { 'method': 'POST', 'withCredentials': true },
                    update: { 'method': 'PUT', 'withCredentials': true },
                    remove: { 'method': 'DELETE', 'withCredentials': true }
                }
            );
        }
    ]);

}());
