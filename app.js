'use strict';

/**
 * Main App
 * Andrés Encarnación 06/12/2016
 */

var app = angular.module('myAwesomeBlog', [
  'ngSanitize',
  'ui.router'
]);

app.config(function ($stateProvider, $urlRouterProvider) {

  // For any unmatched url, redirect to /login
  $urlRouterProvider.otherwise('blog/home');

  $stateProvider
  .state('blog', {
    url: '/blog?page?q',
    template: '<ui-view>',
    abstract: true,
    params: {
      page: '1'
    }
  })
  .state('blog.home',{
    url:'/home',
    controller:'HomeController',
    templateUrl:'views/home.html',
    resolve: {
      posts: function($stateParams, JSONPlaceholder) {
        var page = Number($stateParams.page);
        var query = $stateParams.q;
        return (!query)
        ? JSONPlaceholder.getPosts(page)
        : JSONPlaceholder.getPostsByCriteria(query);
      }
  }})
  .state('blog.user',{
    url:'/user/:id',
    controller:'UserController',
    templateUrl:'views/user.html',
    resolve: {
      user: function ($stateParams, JSONPlaceholder) {
        return JSONPlaceholder.getUser($stateParams.id);
      },
      posts: function($stateParams, JSONPlaceholder) {
        return JSONPlaceholder.getPostsByUser($stateParams.id, 1, 5);
      }
  }})
  .state('blog.post',{
    url:'/post/:id',
    controller:'PostController',
    templateUrl:'views/post.html',
    resolve: {
      post: function($stateParams, JSONPlaceholder) {
        return JSONPlaceholder.getPost($stateParams.id);
      }
  }});

});