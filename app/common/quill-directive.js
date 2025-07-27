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
                        ['blockquote'],
                        ['clean']
                    ]
                },
                placeholder: 'Enter your trip report here...'
            });

            // Convert Quill content to proper HTML
            function convertToProperHTML() {
                var html = quill.root.innerHTML;
                
                // Clean up empty paragraphs with just breaks or whitespace
                html = html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '');
                html = html.replace(/<p>\s*<\/p>/gi, '');
                html = html.replace(/<p>\s*&nbsp;\s*<\/p>/gi, '');
                
                // Handle paragraphs that end with <br> tags
                html = html.replace(/<br\s*\/?>\s*<\/p>/gi, '</p>');
                
                // Handle multiple consecutive <br> tags and convert them to paragraph breaks
                html = html.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p>');
                
                // Handle single <br> tags that should be paragraph breaks (when between content)
                html = html.replace(/([^>])\s*<br\s*\/?>\s*([^<])/gi, '$1</p><p>$2');
                
                // Clean up any remaining isolated <br> tags at the start/end of paragraphs
                html = html.replace(/<p>\s*<br\s*\/?>/gi, '<p>');
                html = html.replace(/<br\s*\/?>\s*<\/p>/gi, '</p>');
                
                // Handle text that's not wrapped in paragraphs
                if (html && !html.trim().startsWith('<')) {
                    html = '<p>' + html + '</p>';
                }
                
                // Split content that's not properly wrapped
                html = html.replace(/^([^<][^]*?)(<[ph])/gi, '<p>$1</p>$2');
                
                // Clean up multiple consecutive empty paragraphs
                html = html.replace(/(<\/p>\s*<p>\s*){2,}/gi, '</p><p>');
                
                // Remove completely empty paragraphs at start/end
                html = html.replace(/^(\s*<p>\s*<\/p>\s*)+/gi, '');
                html = html.replace(/(\s*<p>\s*<\/p>\s*)+$/gi, '');
                
                return html.trim();
            }

            // Update model when Quill content changes
            quill.on('text-change', function() {
                var html = convertToProperHTML();
                if (html === '<p></p>' || html === '<p><br></p>' || html === '') {
                    html = '';
                }
                
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