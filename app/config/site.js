﻿(function () {
     'use strict';
 
    // change as appropriate; comment out to set it from window.location
     var site_url = 'http://192.168.2.8/ctc34';

     if (!site_url) {
         // Set global constant site.url from window.location
         var full_url = window.location.href,
             pathMatcher = new RegExp('(.*?)/tripreports.*'),
             bits = pathMatcher.exec(full_url),
             site_url = 'invalidurl';
         if (bits != null) {
             site_url = bits[1];
         } else {
             console.log("TripReport module fetched from an unexpected address");
         }
     }

     console.log("Setting site url to " + site_url);

     angular.module('tripReportApp').constant('site',
         {
             'url': site_url,
             'tripreportbaseurl': site_url + '/index.php/trip-reports',
             'resturl': site_url + '/db/index.php/rest',
             'imageurl': site_url
         });

}());


