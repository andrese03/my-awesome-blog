'use strict';

/**
 * PostCard directive
 * Andrés Encarnación 06/06/2016
 */

app.directive('postCard', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/postCard.html',
    replace: true,
    scope: {
      post: '=data'
    }
  };
});
