'use strict';

/**
 * Capitalizar Textos
 * Andrés Encarnación 06/12/2016
 */

app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});