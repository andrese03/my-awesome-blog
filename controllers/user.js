'use strict';

/**
 * UserController
 * Andrés Encarnación 06/12/2016
 */

app.controller('UserController', function ($scope, $state, $stateParams, JSONPlaceholder, posts, user) {

  $scope.user = user.data;

  // Número de Post
  $scope.posts = posts.data;
  
  // Indica si quedan o no más resultados
  $scope.remain = posts.remain;

  $scope.currentPage = 1;

  // Mueve de página el historial
  $scope.morePosts = function () {
    $scope.currentPage++;
    JSONPlaceholder.getPostsByUser($stateParams.id, $scope.currentPage, 5)
    .then(function (result) {
      $scope.posts = $scope.posts.concat(angular.copy(result.data));
      $scope.remain = result.remain;
    })
    .catch(function (result) {
      $scope.currentPage--;
    });
  };

  $("html, body").scrollTop(0);
  
});