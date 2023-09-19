// Directive and its controller for a 'Loading' icon that displays a spinner
// while loading data from the site.

(function () {
    'use strict';

    // Directive for the loading control
    angular.module('tripReportApp').directive('loading', [function () {

        return {
            restrict: 'E',
            replace: true,
            template: '\
                <p>\
                    <button ng-show="loading" class="btn btn-loading">\
                        Loading...\
                        <i class="fa fa-spinner fa-spin"></i>\
                    </button>\
                </p>',
            controllerAs: 'LoadingController'
        };
    }]);


    angular.module('tripReportApp').controller('LoadingController',
        ['$scope',
        function ($scope) {
            $scope.loading = false;
        }
        ]);

}());
