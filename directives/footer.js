'use strict';

/**
 * Footer directive
 * Andrés Encarnación 06/12/2016
 */

app.directive('footer', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/footer.html',
    replace: true
  };
});
