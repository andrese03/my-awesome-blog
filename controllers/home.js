'use strict';

/**
 * HomeController
 * Andrés Encarnación 06/12/2016
 */

app.controller('HomeController', function ($scope, $state, $stateParams, JSONPlaceholder, posts) {

  $scope.currentPage = Number($stateParams.page) || 1;

  // Número de Post
  $scope.posts = posts.data;
  
  // Indica si quedan o no más resultados
  $scope.remain = posts.remain;
  
  // Parámetro de búsqueda
  $scope.search = $stateParams.q || '';

  // Indica si se está buscando algo
  $scope.theresASearch = ($scope.search.length)
  ? true
  : false;

  // Búsca los posts
  $scope.searchPosts = function () {
    JSONPlaceholder.getPostsByCriteria($scope.search)
    .then(function (result) {
      $scope.posts = angular.copy(result.data);
      $scope.theresASearch = true;
      $state.transitionTo($state.current, {q: $scope.search}, {reload: false, inherit: false, notify: false});
    });
  };

  // Limpia la búsqueda
  $scope.clearSearch = function () {
    $scope.theresASearch = false;
    $scope.search = '';
    $state.transitionTo($state.current, {q: $scope.search}, {reload: false, inherit: false, notify: false});
    $scope.movePage(0);
  }

  // Mueve de página el historial
  $scope.movePage = function (page) {
    $scope.currentPage += page;
    JSONPlaceholder.getPosts($scope.currentPage)
    .then(function (result) {
      $scope.posts = angular.copy(result.data);
      $scope.remain = result.remain;
      $state.transitionTo($state.current, {page: $scope.currentPage}, {reload: false, inherit: false, notify: false});
      $("html, body").animate({ scrollTop: 0 }, "slow");
    })
    .catch(function (result) {
      $scope.currentPage -= page;
    });
  };
  
});