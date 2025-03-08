(function () {
    'use strict';

    angular.module('tripReportApp').factory('currentUserService', ['$http', 'site',
        function ($http, site) {

            // Obtain the currently-logged in user (i.e., the user who
            // has authenticated on the main CTC website on the same machine as
            // the one on which this code is running).

            var currentUser = null;
            return {
                currentUser: function () { return currentUser; },
                isLoggedIn: function () { return currentUser != null && currentUser.id != 0; },
                hasRoles: function() { return currentUser && currentUser.roles && currentUser.roles.length > 0; },

                load: function () {
                    $http.get(site.url + '/db/index.php/rest/user')
                        .then(function (response) {
                            currentUser = response.data;
                            return currentUser;
                        })
                        .catch(function (error) {
                            currentUser = null;
                            alert("Couldn't fetch user info (" + (error.data ? error.data.error : 'unknown error') + "). A network problem?");
                            console.trace();
                            return currentUser;
                        });
                }
            }
        }
    ]);

}());
