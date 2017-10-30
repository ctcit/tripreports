// The controller for editing a trip report

(function () {
    'use strict';
    angular.module('tripReportApp').controller('TripEditController',
        ['$scope', '$state', '$stateParams', '$q', 'currentTripReportService',
            'site', 'tripReportService', 'imageService', 'gpxService',
         function ($scope, $state, $stateParams, $q, currentTripReportService,
             site, tripReportService, imageService, gpxService) {

            var MAX_UPLOAD_IMAGE_DIMENSION = 1000; // Max width or height in pixels
            var UPLOAD_IMAGE_QUALITY = 0.6;

            var currentTripReport = currentTripReportService.currentTripReport;
            var id = ($stateParams.tripId != undefined) ? $stateParams.tripId : (currentTripReport) ? currentTripReport.id : 0;

            $scope.deletedImages = [];
            $scope.deletedGpxs = [];
            $scope.submissionErrors = false;

            $scope.loading = true;
            tripReportService.get({ 'tripId': id },
                function (tripReport) {
                    currentTripReportService.currentTripReport = tripReport;
                    $scope.tripReport = tripReport;
                    // Set resource types in here so template processes resources now
                    $scope.resourceTypes = ['image', 'gpx', 'map'];
                }, function(response) {
                    alert("Couldn't fetch trip report (" + response.status + "). A network problem?");
                }).$promise.finally(function() {
                    $scope.loading = false;
                });


            $scope.imageUrl = function(resourceType, imageNum, thumbReqd) {
                var image;
                if ($scope.tripReport[resourceType + 's'] === undefined) {
                     return '#';
                 } else {
                    image = $scope.tripReport[resourceType + 's'][imageNum];
                    if (image.id == 0) {  // Local?
                        return image.dataUrl ? image.dataUrl : '';
                    } else if (thumbReqd) {
                        return site.imageurl + '/dbthumb.php?id=' + image.id;
                    } else {
                        return site.imageurl + '/dbcaptionedimage.php?id=' + image.id;
                    }dbthumb
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
                if ($scope.confirm('Delete ' + resourceType + resource.name + ' (' + resource.caption + ')')) {
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
                // is MAX_UPLOAD_IMAGE_DIMENSION. When done, set
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
                             ratio = MAX_UPLOAD_IMAGE_DIMENSION / Math.max(w, h),
                             // Don't ever scale up and don't scale down by more than a
                             // factor of 2 per iteration.
                             actualRatio = Math.min(1, Math.max(ratio, UPLOAD_IMAGE_QUALITY)),
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
                        'loaded' : false
                    };
                resources.push(file);
                return file;
            }


            $scope.fileSelected = function(event, files, resourceType) {
                // Called when a file input is selected. Adds the file(s) to
                // the list of resources, but with a zero id. Then initiates
                // converting of the files to dataUrls (downsizing in the
                // case of images).

                function initiateRead(file) {
                    var reader = new FileReader(),
                        fileResource = $scope.addResource(resourceType, file.name);

                    reader.readAsDataURL(file);

                    reader.onload = function() {
                        $scope.$apply(function () {
                            fileResource.dataUrl = reader.result;
                            if (resourceType !== 'gpx') { // Downsize maps and images
                                $scope.downsize(fileResource);
                            } else {
                                fileResource.loaded = true;
                            }
                        });
                    };
                }

                for (var i = 0; i < files.length; i++) {
                    initiateRead(files[i]);
                };
                event.srcElement.value = '';  // Reset file input for another file

            };


            $scope.badDate = function() {
                // Return true if a submitted form has an invalid date or duration
                // Applicable only for trip reports, not news reports.
                return  $scope.tripReport.trip_type != 'news' &&
                        ($scope.tripReport.day      == 0 ||
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
                // Deal with race problem (tripReport undefined) by checking
                // both if the tripReport is defined then if it has a non-zero id.
                return $scope.tripReport && $scope.tripReport.id ? 'Save changes' : 'Submit';
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
                                yearStart + ' - ' + dayEnd + ' ' + months[monthEnd] + ' ' +
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
                        alert("Deletion of an image or gpx failed (" +
                                response.status + "). Check the result carefully");
                    }).finally(function(result) {
                        $scope.saveOrUpdate().then(
                                function(result) { // Success
                                    //alert("Upload successful");
                                    $state.go('tripreports.show', { tripId: result.id });
                                },
                                function(response) { // Fail
                                    alert("Trip report upload failed with error " +
                                            response.status + ' ' + response.data);
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
                if ($scope.confirm('Discard all your changes and go back to browsing trip reports. Are you QUITE SURE?!')) {
                    $state.go('tripreports.years', {});
                }
            };

            $scope.confirm = function (message) {
                // Wrap so it can be easily mocked
                return confirm(message);
            }

        }]);
}());