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
                        ['link'],
                        ['blockquote'],
                        ['clean']
                    ]
                },
                placeholder: 'Enter your trip report here...'
            });

            // Convert Quill content to proper HTML
            function convertToProperHTML() {
                var html = quill.root.innerHTML;
                
                // First, handle newline characters that Quill sometimes uses
                html = html.replace(/\n/g, '</p><p>');
                
                // Handle &nbsp; sequences that represent line breaks
                html = html.replace(/&nbsp;&nbsp;/g, '</p><p>');
                html = html.replace(/(&nbsp;\s*){2,}/g, '</p><p>');
                
                // Clean up empty paragraphs with just breaks, whitespace, or &nbsp;
                html = html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '');
                html = html.replace(/<p>\s*<\/p>/gi, '');
                html = html.replace(/<p>\s*&nbsp;\s*<\/p>/gi, '');
                html = html.replace(/<p>(&nbsp;|\s)*<\/p>/gi, '');
                
                // Handle paragraphs that end with <br> tags or &nbsp;
                html = html.replace(/<br\s*\/?>\s*<\/p>/gi, '</p>');
                html = html.replace(/&nbsp;\s*<\/p>/gi, '</p>');
                
                // Handle multiple consecutive <br> tags and convert them to paragraph breaks
                html = html.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '</p><p>');
                
                // Handle single <br> tags that should be paragraph breaks (when between content)
                html = html.replace(/([^>])\s*<br\s*\/?>\s*([^<])/gi, '$1</p><p>$2');
                
                // Handle &nbsp; sequences between content that should be paragraph breaks
                html = html.replace(/([^>])\s*&nbsp;\s*&nbsp;\s*([^<])/gi, '$1</p><p>$2');
                html = html.replace(/([^>])\s*&nbsp;\s*([^<])/gi, '$1 $2'); // Single &nbsp; becomes space
                
                // Clean up any remaining isolated <br> tags at the start/end of paragraphs
                html = html.replace(/<p>\s*<br\s*\/?>/gi, '<p>');
                html = html.replace(/<br\s*\/?>\s*<\/p>/gi, '</p>');
                
                // Clean up &nbsp; at start/end of paragraphs
                html = html.replace(/<p>\s*&nbsp;/gi, '<p>');
                html = html.replace(/&nbsp;\s*<\/p>/gi, '</p>');
                
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
                
                // Final cleanup - remove any lingering empty paragraphs with whitespace/nbsp
                html = html.replace(/<p>[\s&nbsp;]*<\/p>/gi, '');
                
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