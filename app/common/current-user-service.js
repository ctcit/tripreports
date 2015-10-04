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
                isLoggedIn: function () { return currentUser != null; },
                hasRoles: function() { return currentUser && currentUser.roles && currentUser.roles.length > 0; },

                load: function () {
                    return $http.get(site.URL + '/db/index.php/rest/user')
                        .success(function (user) {
                            currentUser = user;
                        })
                       .error(function (fail) {
                           currentUser = null;
                           alert("Couldn't fetch user info (" + fail.status + "). A network problem?");
                       })
                }
            }
        }
    ]);

}());
