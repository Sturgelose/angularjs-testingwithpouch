'use strict';
angular.module('main')
.constant('Config', {

  // gulp environment: injects environment vars
  // https://github.com/mwaylabs/generator-m-ionic#gulp-environment
  ENV: {
    /*inject-env*/
    'CALLHOME_SECTION_URL': 'http://satellite.esn.org/callhome/api/section.json?mobile-api=1',
    'CALLHOME_COUNTRY_URL': 'http://satellite.esn.org/callhome/api/country.json'
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  // https://github.com/mwaylabs/generator-m-ionic#gulp-build-vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

});
