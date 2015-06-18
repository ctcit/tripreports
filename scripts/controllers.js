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
            ['$scope', '$routeParams', '$location', '$q', 'globals', 'TripReport', 'User',
                function($scope, $params, $location, $q, globals, tripReportService, userService) {
            globals.tripId = $params.tripId;
            globals.tripReportScope = $scope;
            
            $scope.tripReport = tripReportService.get({'tripId': $params.tripId},
                function(tripReport) {
                    $scope.numImageRows = Math.ceil(tripReport.images.length / 3);
                    $scope.numImages = tripReport.images.length;
                    $scope.numMaps = tripReport.maps.length;
                    $scope.numGpxs = tripReport.gpxs.length;
                }, 
                function(fail) {
                        alert("Couldn't fetch trip report (" + fail.status + "). A network problem?");
                }
            );
            
            $scope.user = userService.get({}, 
                function(response) {
                    $scope.user = response;
                },
                function(fail) {
                    alert("Couldn't fetch user info (" + fail.status + "). A network problem?");
                }
            );
    
            $scope.editReport = function() {
                // Switch to the edit page if user is authenticated and
                // authorised.
                if ($scope.user.id == 0 || ($scope.user.roles.length == 0 && 
                        $scope.user.id != $scope.tripReport.uploader_id)) {
                    alert("Sorry, but you must be logged into the main website as a club officer or the " +
                            "trip report author to edit this report");
                } else if ($scope.tripReport.id != 0) {
                    globals.tripReportScope = null;
                    $location.url('/edit/' + $scope.tripReport.id);
                }
            };
            
            
            $scope.deleteReport = function() {
                // Delete this current trip report provided the current user is a 
                // club officer or the author, and provided they confirm it's
                // ok to delete it.
                if ($scope.user.id == 0 || ($scope.user.roles.length == 0 && 
                        $scope.user.id != $scope.tripReport.uploader_id)) {
                    alert("Sorry, but you must be logged into the main website as a club officer or the " +
                            "trip report author to delete a report");
                } else if (confirm('Completely delete trip report "' + $scope.tripReport.title +
                        '"? This cannot be undone. Are you quite sure?')) {
                    tripReportService.remove({'tripId': $params.tripId}, function(tripReport) {
                        //alert("Report has been deleted");
                        globals.tripReportScope = null;
                        $location.url('/');
                    })
                }
            };

            // Caption for a GPX or Map. Use caption attribute if given
            // else use name.
            $scope.itemCaption = function(item) {
                var caption = item.caption;
                if (caption.trim() === '') {
                    caption = item.name;
                }
                return caption;
            };
            
            
            // Return the topomap url to be used to view a gpx file on the ctc
            // website, given the gpx id.
             $scope.topomapLink = function(gpxid) {
                return "http://www.topomap.co.nz/NZTopoMap?v=2&gpx=http%3A%2F%2Fwww.topomap.co.nz%2Fproxy.ashx%3F" + 
                        encodeURIComponent(globals.SITE_URL + '/dbgpx.php?id=' + gpxid);
            };
            
            // Return the trip report's upload_date in the form Tue 4 January 2014
            $scope.uploadDate = function() {
                var phpDate, datePart, bits, date;
                phpDate = $scope.tripReport.upload_date;
                if (phpDate) { // If defined
                    datePart = phpDate.split(' ')[0];
                    bits = datePart.split('-');
                    date = new Date(bits[0], bits[1], bits[2]);
                    return date.toDateString();
                } else {
                    return '';
                }
            }
                    
                    
    }]);
    
    // =========================================================================
    // The controller for the view listing all trips in a given year
    tripReportControllers.controller('TripsInYearController', ['$scope', '$routeParams', '$http', 'globals',
        function($scope, $params, $http, globals) {
            var url = globals.SITE_URL + '/db/index.php/rest/yearstripreports/' + $params.year,
                NUM_RECENT = 10,
                i = 0;
            globals.tripId = 0;
            globals.tripReportScope = null;
            $scope.year = $params.year;
            $scope.loading = true;
            $http.get(url).then(function (response) {
                $scope.triplist = response.data;
                $scope.loading = false;
            }, function(response) {
                alert("Couldn't fetch trip reports (" + response.status + "). A network problem?");
            });
        }]);
    
    
    // =========================================================================
    // The controller for the view showing all years in which trip reports are available
     tripReportControllers.controller('TripYearsController', ['$scope', '$routeParams', '$http', 'globals', 
        function($scope, $params, $http, globals) {
            var url = globals.SITE_URL + '/db/index.php/rest/tripreportyears',
                NUM_RECENT = 10;  // The number of years to show by default
            globals.tripId = 0;
            globals.tripReportScope = null;
            $scope.numYears = 0;
            $http.get(url).then(function (response) {
                $scope.recentOnly = true;
                $scope.years = response.data;
                $scope.numYears = NUM_RECENT;
            }, function(response) {
                alert("Couldn't fetch trip report years. A network problem?");
            });
            
            // Update numYears if recentOnly changes
            $scope.checkboxChanged = function() {
                $scope.numYears = $scope.recentOnly ? NUM_RECENT : $scope.years.length;
            };
        }]);
    
    // =========================================================================
    // The controller for editing a trip report
    tripReportControllers.controller('TripEditController',
            ['$scope', '$routeParams', '$location', '$q', 'globals', 'TripReport', 'Image', 'Gpx',
        function($scope, $params, $location, $q, globals, tripReportService, imageService, gpxService) {
            var id;
            if ($params.tripId == undefined) {
                id = globals.tripId = 0;
            } else {
                id = globals.tripId = $params.tripId;
            }
            globals.tripReportScope = null;
            

            $scope.deletedImages = [];
            $scope.deletedGpxs = [];
            $scope.submissionErrors = false;
         
            $scope.tripReport = tripReportService.get({'tripId': id}, function(tripReport) {
                // Set resource types in here so template processes resources now
                $scope.resourceTypes = ['image', 'gpx', 'map'];  
            }, function(response) {
                alert("Couldn't fetch trip report (" + response.status + "). A network problem?");
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

            
            $scope.downsize = function(image) {
                // Downsize the given image so its maximum dimension
                // is globals.MAX_UPLOAD_IMAGE_DIMENSION. When done, set
                // image.dataUrl to the rescaled value and set image.resizing to
                // false. Scaling is done using an offscreen image and an offscreen
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
                             QUALITY = 0.6;

                         w = w * actualRatio;
                         h = h * actualRatio;
                         osCanvas.width = w;
                         osCanvas.height = h;
                         osCtx.drawImage(osImage, 0, 0, w, h);
                         if (ratio >= actualRatio)  {
                             // Image is now the right size
                             image.dataUrl = osCanvas.toDataURL("image/jpeg", QUALITY);
                             image.loaded = true;
                         } else {
                            // Go another round
                            osImage.src = osCanvas.toDataURL();
                         }
                    });
                };
                osImage.src = image.dataUrl;
            }
            
            
            $scope.addResource = function(resourceType, filename) {
                // Adds a new resource (image, map or gpx file) to the trip report.
                // At this stage the resource has not been uploaded so the
                // dataUrl is set to null.
                // Returns (a reference to) the new resource.
                var resources = $scope.tripReport[resourceType + 's'],
                    file = {
                        'id'     : 0,
                        'caption': filename,
                        'name'   : filename,
                        'dataUrl': null,
                        'loaded' : false,
                        'ordering': resources.length + 1 // 1-origin ordering
                    };
                resources.push(file);
                return file;
            }
            
 
            $scope.fileSelected = function(event, files, resourceType) {
                // Called when a file input is selected. Adds the file to
                // the list of resources, but with a zero id. Then initiates
                // converting of the file to a dataUrl (downsizing it if
                // it's an image).
                var reader = new FileReader(), 
                    file = $scope.addResource(resourceType, files[0].name);
                       
                reader.onload = function() {
                    $scope.$apply(function () {
                        file.dataUrl = reader.result;
                        if (resourceType !== 'gpx') { // Downsize maps and images
                            $scope.downsize(file);
                        } else {
                            file.loaded = true;
                        }
                    });
                };    
                reader.readAsDataURL(files[0]);
                event.srcElement.value = '';  // Reset file input for another file
            };
            
            
            $scope.badDate = function() {
                // Return true if a submitted form has an invalid date or duration
                return  ($scope.tripReport.day      == 0 ||
                         $scope.tripReport.month    == 0 ||
                         $scope.tripReport.duration == 0
                        );
            }
            
            $scope.badSubmittedDate = function() {
                // True if the date was bad while the form was being submitted
                return $scope.submissionErrors && $scope.badDate();
            }
            
            $scope.emptyBody = function() {
                // Return true if a submitted form has an empty body
                return $scope.submissionErrors && $scope.tripReport.body == '';
            }
            
            
            $scope.titleClass = function() {
                // Return a css class of 'error' if the submitted trip's title
                // is empty
                return $scope.submissionErrors && $scope.tripReport.title == '' ? 'error' : '';
            };
            
            $scope.submitOrSave = function() {
                // Return a value for use in the submit/save button
                return $scope.tripReport.id == 0 ? 'Submit' : 'Save changes';
            };
            
            $scope.getDateDisplay = function() {
                // Return a date display string for the current trip report of
                // the form 1-3 June 2014 or perhaps 30 April - 1 May 2014
                var months = ['January', 'February', 'March', 'April', 'May',
                       'June', 'July', 'August', 'September', 'October', 
                       'November', 'December'],
                    yearStart = parseInt($scope.tripReport.year),
                    monthStart = $scope.tripReport.month - 1,  // 0-origin
                    dayStart = $scope.tripReport.day,
                    date = new Date(yearStart, monthStart, dayStart),
                    endMsecs = date.getTime() + 1000 * 60 * 60 * 24 * ($scope.tripReport.duration - 1),
                    endDate = new Date(endMsecs),
                    dayEnd = endDate.getDate(),
                    monthEnd = endDate.getMonth(),
                    yearEnd = parseInt(endDate.getFullYear()),
                    result = '';
            
                if ($scope.badDate()) {
                    return 'Undefined date/duration';
                }
            
                // Assume trips are less than 11 months!
                if ($scope.tripReport.duration === 1) {
                    result = dayStart + ' ' + months[monthStart] + ' ' + yearStart;
                }
                else if (monthStart === monthEnd) { // Same month?
                    result = (dayStart + '-' + dayEnd + ' ' + 
                              months[monthStart] + ' ' + yearStart);
                } else if (yearStart === yearEnd) {  // Change of month only
                    result = (dayStart + ' ' + months[monthStart] + 
                                ' - ' + dayEnd + ' ' + months[monthEnd] +
                                ' ' + yearEnd);
                } else { // Trip crosses new-year boundary
                    result = (dayStart + ' ' + months[monthStart] + ' ' +
                                yearStart + ' - ' + dayEnd + ' ' + monthEnd + ' ' +
                                yearEnd);
                }
                return result;
            };
            
            $scope.updateDateDisplay = function() {
                // Called when user_set_date_display changes. If it's being
                // turned on, initialise it to the date generated by getDateDisplay
                if ($scope.tripReport.user_set_date_display == 1) { // Turning on?
                    $scope.tripReport.date_display = $scope.getDateDisplay();
                }
            }
            
            
            $scope.submit = function() {
                // Handle a click on the submit/save button
                
                function validate() {
                    return $scope.tripReport.title !== "" &&
                           !$scope.badDate() &&
                           $scope.tripReport.body !== ""
                }
                
                function uploadFile(file, service) {
                    // Local function to upload an image or gpx file
                    // to the server using the given service (a resource in
                    // angular parlance). Return the promise of the upload.
                    var promise;
                    response = service.save(                        
                        {name:      file.name,
                         caption:   file.caption,
                         dataUrl:   file.dataUrl
                        }
                    );
                    promise = response.$promise.then(function(data)  { 
                            file.id = data.id;
                        },
                        function(error) {
                            console.log('error', error); // FIXME
                        }
                    );
                    return promise;
                }    

                // First, send all new files (images and gpxs) to the server.
                var i, gpx, image, imageId, gpxId, images, response, promises;
                
                
                if (!validate()) {
                    $scope.submissionErrors = true;
                    alert("The trip report has errors. Please correct them and resubmit.");
                } else {
                    if (!$scope.tripReport.user_set_date_display) {
                        $scope.tripReport.date_display = $scope.getDateDisplay();
                    }
                    $scope.submissionErrors = false;
                    promises = [];
                     // First, delete all deleted files
                    for (i = 0; i < $scope.deletedImages.length; i++) {
                        imageId = $scope.deletedImages[i];
                        promises.push(imageService.delete({imageId: imageId}));
                    }
                    $scope.deletedImages = [];  // Done, so clear the list
                    
                    for (i = 0; i < $scope.deletedGpxs.length; i++) {
                        gpxId = $scope.deletedGpxs[i];
                        promises.push(gpxService.delete({gpxId: gpxId}));
                    }
                    $scope.deletedGpxs = [];
                    
                    // Now save (if new) or update 
                    // (otherwise) the actual trip report.
                    $q.all(promises).catch(function(response) {
                        alert("Deletion of an image or gpx failed (" + response.status + "). Check the result carefully");
                    }).finally(function(result) {
                        $scope.saveOrUpdate().then(
                                function(result) { // Success
                                    //alert("Upload successful");
                                    $location.url('/show/' + result.id);
                                },
                                function(response) { // Fail
                                    alert("Trip report upload failed with error " + response.status + ' ' + response.data);
                                }).finally(function() {
                                    $scope.saving = false;
                                });
                    });
                }
                
            };
            
            $scope.saveOrUpdate = function() {
                if ($scope.tripReport.id === 0) {
                    return $scope.tripReport.$save();
                } else {
                    return $scope.tripReport.$update();
                }
            }
            
            $scope.cancel = function() {
                // Handle a click on the cancel button
                if (confirm('Discard all your changes and go back to browsing trip reports. Are you QUITE SURE?!')) {
                    $location.path('#');
                }
            };
            
        }]);
  
  }());