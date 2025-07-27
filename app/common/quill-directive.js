// Create a new file: app/directives/quill-directive.js
angular.module('tripReportApp').directive('quillEditor', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            var quill = new Quill(element[0], {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        ['link', 'image'],
                        ['clean']
                    ]
                },
                placeholder: 'Enter your trip report here...'
            });

            // Update model when Quill content changes
            quill.on('text-change', function() {
                var html = quill.root.innerHTML;
                if (html === '<p><br></p>') html = '';
                
                scope.$apply(function() {
                    ngModel.$setViewValue(html);
                });
            });

            // Update Quill when model changes
            ngModel.$render = function() {
                if (ngModel.$viewValue) {
                    quill.root.innerHTML = ngModel.$viewValue;
                }
            };

            // Initialize with model value
            if (ngModel.$viewValue) {
                quill.root.innerHTML = ngModel.$viewValue;
            }
        }
    };
});