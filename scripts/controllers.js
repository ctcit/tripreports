(function () {
    'use strict';

    /* Controllers for the TripReport subsystem (Angular-JS) */

    var tripReportControllers = angular.module('tripReportControllers', []);

    // Define a filter that can be used to pass DB HTML content directly through
    // to the output.
    tripReportControllers.filter('unsafe', function($sce) { return $sce.trustAsHtml; });   
    
    // The top level controller used for navigation and to provide global functions
    tripReportControllers.controller('NavController', ['$rootScope', '$location', 'globals',
        function($rootScope, $location, globals) {
            $rootScope.globals = globals;
            $rootScope.isCollapsed = true;
            $rootScope.isActive = function (viewLocation) { 
                // This version requires a regular expression which must fully match
                // the current location
                return new RegExp('^' + viewLocation + '$').test($location.path());
            };
        }  
    ]);
    
    // =========================================================================
    // The controller for the view of a particular trip
    tripReportControllers.controller('TripShowController',
            ['$scope', '$routeParams', 'globals', 'TripReport',
                function($scope, $params, globals, tripReportService) {
            globals.tripId = $params.tripId;

            
            $scope.tripReport = tripReportService.get({'tripId': $params.tripId}, function(tripReport) {
                $scope.numImageRows = Math.ceil(tripReport.images.length / 4);
                $scope.numImages = tripReport.images.length;
                $scope.numMaps = tripReport.maps.length;
                $scope.numGpxs = tripReport.gpxs.length;
            });


            // Caption for a GPX or Map. Use caption attribute if given
            // else use name.
            $scope.itemCaption = function(item) {
                var caption = item.caption;
                if (caption.trim() === '') {
                    caption = item.name;
                }
                return caption;
            };

            $scope.topomapLink = function(gpxid) {
                return "http://www.topomap.co.nz/NZTopoMap?v=2&gpx=http%3A%2F%2Fwww.topomap.co.nz%2Fproxy.ashx%3F" + 
                        encodeURIComponent('http://www.ctc.org.nz/dbgpx.php?id=' + gpxid);
            };
    }]);
    
    // =========================================================================
    // The controller for the view listing all trips in a given year
    tripReportControllers.controller('TripsInYearController', ['$scope', '$routeParams', '$http', 'globals',
        function($scope, $params, $http, globals) {
            var url = globals.SITE_URL + '/db/index.php/rest/yearstripreports/' + $params.year,
                NUM_RECENT = 10,
                i = 0;
            globals.tripId = 0;
            $scope.year = $params.year;
            $scope.loading = true;
            $http.get(url).then(function (response) {
                $scope.triplist = response.data;
                $scope.loading = false;
            });
        }]);
    
    
    // =========================================================================
    // The controller for the view showing all years in which trip reports are available
     tripReportControllers.controller('TripYearsController', ['$scope', '$routeParams', '$http', 'globals', 
        function($scope, $params, $http, globals) {
            var url = globals.SITE_URL + '/db/index.php/rest/tripreportyears',
                NUM_RECENT = 10;  // The number of years to show by default
            globals.tripId = 0;
            $scope.numYears = 0;
            $http.get(url).then(function (response) {
                $scope.recentOnly = true;
                $scope.years = response.data;
                $scope.numYears = NUM_RECENT;
            });
            
            // Update numYears if recentOnly changes
            $scope.checkboxChanged = function() {
                $scope.numYears = $scope.recentOnly ? NUM_RECENT : $scope.years.length;
            };
        }]);
    
    // =========================================================================
    // The controller for editing a trip report
    tripReportControllers.controller('TripEditController',
            ['$scope', '$routeParams', '$location', 'globals', 'TripReport', 'Image', 'Gpx',
        function($scope, $params, $location, globals, tripReportService, imageService, gpxService) {
            var id;
            if ($params.tripId == undefined) {
                id = globals.tripId = 0;
            } else {
                id = globals.tripId = $params.tripId;
            }
            

            $scope.deletedImages = [];
            $scope.deletedGpxs = [];
         
            $scope.tripReport = tripReportService.get({'tripId': id}, function(tripReport) {
                // Set resource types in here so template processes resources now
                $scope.resourceTypes = ['image', 'gpx', 'map'];  
            });
            
        
            $scope.imageUrl = function(resourceType, imageNum, thumbReqd) {
                var image;
                if ($scope.tripReport === undefined) {
                     return '#';
                 } else {
                    image = $scope.tripReport[resourceType + 's'][imageNum];
                    if (image.id == 0) {  // Local?
                        return image.dataUrl ? image.dataUrl : '';
                    } else if (thumbReqd) {
                        return globals.SITE_URL + '/dbthumb.php?id=' + image.id;
                    } else {
                        return globals.SITE_URL + '/dbcaptionedimage.php?id=' + image.id;
                    }
                }
            } 

            $scope.capitalise = function (word) {
                // Return the word with first char in upper case
                return word.charAt(0).toUpperCase() + word.substring(1);
            };
            
            $scope.moveUp = function(resource, resourceNum) {
                // Move up the given resouce. resource must be 'image',
                // 'map' or 'gpx'
                var field = resource + 's',
                    temp = $scope.tripReport[field][resourceNum];
                $scope.tripReport[field][resourceNum] = $scope.tripReport[field][resourceNum - 1];
                $scope.tripReport[field][resourceNum - 1] = temp;
            };
            
            $scope.moveDown = function(resource, resourceNum) {
                // Move down the given resouce. resource must be 'image',
                // 'map' or 'gpx'
                var field = resource + 's',
                    temp = $scope.tripReport[field][resourceNum];
                $scope.tripReport[field][resourceNum] = $scope.tripReport[field][resourceNum + 1];
                $scope.tripReport[field][resourceNum + 1] = temp;
            };
            
            $scope.delete = function(resourceType, index) {
                var resources = $scope.tripReport[resourceType + 's'],
                    id = 0,
                    resource = resources[index];
                if (confirm('Delete ' + resourceType + resource.name + ' (' + resource.caption + ')')) {
                    id = $scope.tripReport[resourceType + 's'][index].id;
                    if (id != 0) {  // If it's a server resource, mark it for deletion
                        if (resourceType === 'gpx') {
                            $scope.deletedGpxs.push(id);
                        } else {
                            $scope.deletedImages.push(id);
                        }
                    }
                    resources.splice(index, 1);  // Delete that item
                }    
            }

            
            $scope.downsize = function(imageDataUrl, resourceType, filename, sourceElement) {
                // Downsize the given imageDataUrl so its maximum dimension
                // is globals.MAX_UPLOAD_IMAGE_DIMENSION. When done, set
                // file.dataUrl to the rescaled value and set file.resizing to false.
                // Scaling is done using an offscreen image and an offscreen
                // canvas. Since Canvas resize operations are bilinear, we
                // scale by at most a factor of 2 on each scaling, iterating
                // as necessary.
                var osImage = new Image(),
                    osCanvas = document.createElement('canvas'),
                    osCtx = osCanvas.getContext('2d');
                osImage.onload = function() {
                    $scope.$apply(function() {
                        // When the off-screen image has been loaded, do the rescaling
                        // in the off-screen canvas.
                        var  w = osImage.width,
                             h = osImage.height,
                             ratio = globals.MAX_UPLOAD_IMAGE_DIMENSION / Math.max(w, h),
                             // Don't ever scale up and don't scale down by more than a
                             // factor of 2 per iteration.
                             actualRatio = Math.min(1, Math.max(ratio, globals.UPLOAD_IMAGE_QUALITY)),
                             dataUrl;

                         w = w * actualRatio;
                         h = h * actualRatio;
                         osCanvas.width = w;
                         osCanvas.height = h;
                         osCtx.drawImage(osImage, 0, 0, w, h);
                         if (ratio == actualRatio)  {
                             // Image is now the right size
                             dataUrl = osCanvas.toDataURL("image/jpeg", 0.6);
                             $scope.addResource(resourceType, filename, dataUrl);
                             //alert('Image size = ' + dataUrl.length);
                             sourceElement.value = '';  // Reset the file input for reuse
                         } else {
                            // Go another round
                            osImage.src = osCanvas.toDataURL();
                         }
                    });
                };
                osImage.src = imageDataUrl;
            }
            
            
            $scope.addResource = function(resourceType, filename, dataUrl) {
                // Adds a resource (image, map or gpx file) to the trip report.
                // The resource must have been converted to a dataUrl first,
                // ready for uploading.
                var resources = $scope.tripReport[resourceType + 's'],
                    file = {
                        'id'     : 0,
                        'caption': filename,
                        'name'   : filename,
                        'dataUrl': dataUrl,
                        'ordering': resources.length + 1 // 1-origin ordering
                    };
                resources.push(file);
            }
            
            
            $scope.fileSelected = function(event, files, resourceType) {
                // Called when a file input is selected. Converts the
                // file to a dataUrl (downsizing it if it's an image) and
                // then adds it to the trip report.
                var image,
                    reader = new FileReader();
            
                reader.onload = function() {
                    $scope.$apply(function () {
                        var resources = $scope.tripReport[resourceType + 's'];
                        if (resourceType !== 'gpx') { // Downsise maps and images
                            $scope.downsize(reader.result, resourceType, files[0].name, event.srcElement);
                        } else {
                            $scope.addResource(resourceType, files[0].name, reader.result);
                            event.srcElement.value = ''; // Reset file input for another file
                        };
                    });
                };    
                reader.readAsDataURL(files[0]);
            };
            
            $scope.submitOrSave = function() {
                // Return a value for use in the submit/save button
                return $scope.tripReport.id == 0 ? 'Submit' : 'Save changes';
            };
            
            
            $scope.submit = function() {
                // Handle a click on the submit/save button

                // First, send all new resources to the server.
                var i, resource, image, images;
                
                images = $scope.tripReport.images;
                images.concat($scope.tripReport.maps);
                for (i = 0; i < images.length; i++) {
                    resource = images[i];
                    if (resource.id === 0) {
                        image = new imageService();
                        image.name = resource.name;
                        image.caption = resource.caption;
                        image.dataUrl = resource.dataUrl;
                        resource.id = image.$save();
                        alert(resource.id);
                    }
                }
                
                for (i = 0; i < $scope.tripReport.gpxs.length; i++) {
                    resource = $scope.tripReport.gpxs[i];
                    if (resource.id === 0) {
                        gpxService.save(
                            {name:    resource.name,
                             caption: resource.caption,
                             dataUrl: resource.dataUrl
                             }
                        );
                        
                    }
                }
                
                // Next delete all deleted resources
                
            };
            
            $scope.cancel = function() {
                // Handle a click on the cancel button
                if (confirm('Discard all your changes and go back to browsing trip reports. Are you QUITE SURE?!')) {
                    $location.path('#');
                }
            };
     

        }]);
  
  }());