(function () {
    'use strict';

    // Directive to navigate to new state 
    angular.module('tripReportApp').directive('navToState', [function () {

        var controller = ['$state',
        function ($state) {

            this.url = "";

            this.navigateToState = function (event, name, params) {
                // This is the key -> preventing default navigation
                event.preventDefault();

                var paramsObj = JSON.parse(params);
                $state.go(name, paramsObj);
            };
        }];

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {},
            bindToController: {
                name: '@',
                params: '@'
            },
            controller: controller,
            controllerAs: 'navToStateController',
            template:
                '<div>' +
                    '<a ' +
                        'ng-href="../index.php/trip-reports?goto={{navToStateController.url}}" ' +
                        'ng-click="navToStateController.navigateToState($event, \'{{navToStateController.name}}\', \'{{navToStateController.params}}\')" ' +
                        'ng-transclude>' +
                    '</a>' +
                '</div>'
        };
    }]);

}());
