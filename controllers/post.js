'use strict';

/**
 * PostController
 * Andrés Encarnación 06/12/2016
 */

app.controller('PostController', function ($state, $scope, post) {
  
  $scope.post = post.data;

  $scope.displayBlogLimits = function () {
    alert('Lo siento, esto es solo un demo de un blog. :(');
  };

  $("html, body").scrollTop(0);
  
});