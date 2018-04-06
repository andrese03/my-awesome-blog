'use strict';

/**
 * Wrap de Servicios de JSONPlaceholderAPI
 * Andrés Encarnación 06/12/2016
 */

app.factory('JSONPlaceholderAPI', function($http, $q, $filter, Utils) {

  var APIEndpoint = 'https://jsonplaceholder.typicode.com/';
  var JSONPlaceholderAPI = {};
  
  // Servicio de Prueba
  JSONPlaceholderAPI.test = function () {
    var deferred = $q.defer();

    var result = {
      result: 1,
      message: 'Test exitoso!',
      data: true
    };

    deferred.resolve(result);

    return deferred.promise;
  };

  // Obtener publicaciones
  JSONPlaceholderAPI.getPosts = function (page, limit, params) {
    var deferred = $q.defer();
    var url = APIEndpoint + 'posts/';
    var data = null;
    var remain = null;
    
    // Por defecto son diez valores y en la primera página
    if (page !== false || limit !== false) {
      page = page || 1;
      limit = limit || 10;
    }
    
    var skip = ( limit * (page - 1) );

    $http({
      method: 'GET', 
      url: url,
      params: params
    })
    .then(function (result) {
      
      // Lógica de la búsqueda paginada
      if (page && limit) {
        data = _(result.data).slice(skip).take(limit + 1).value();
        remain = (data.length === (limit + 1));
      }
      else {
        data = result.data;
      }

      // Removemos el elemento extra con el que se confirma si hay más elementos
      if (remain)
        data.pop();

      // Le agregamos otras cosas como fecha
      data = data.map(function (post) {
        post.createdDate = moment().subtract(post.id, 'd').hour(_.random(8,16)).minute(_.random(1,60)).toDate();
        return post;
      });

      return JSONPlaceholderAPI.getUsers();
    })
    .then(function (result) {

      // Asignar Usuarios a las Noticias
      data.forEach(function (post) {
        post.user = _.find(result.data, {id: post.userId});
      })
      deferred.resolve({ data, remain });   
    })
    .catch(function (result) {
      deferred.reject(result.data);
    });

    return deferred.promise;
  };

  JSONPlaceholderAPI.getPostsByUser = function (userId, page, limit) {
    var deferred = $q.defer();
    var url = APIEndpoint + 'posts/';
    var _this = this;
    var data = null;
    var criteria = { userId: Number(userId) };

    _this.getPosts(page, limit, criteria)
    .then(function (result) {
      deferred.resolve(result);
    })
    .catch(function (result) {
      deferred.reject(result.data);
    });

    return deferred.promise;
  };

  JSONPlaceholderAPI.getPostsByCriteria = function (criteria) {
    var deferred = $q.defer();
    var url = APIEndpoint + 'posts/';
    var _this = this;
    var data = null;

    _this.getPosts(false, false)
    .then(function (result) {
      data = $filter('filter')(result.data, { '$': criteria });
      deferred.resolve({data});
    })
    .catch(function (result) {
      deferred.reject(result.data);
    });

    return deferred.promise;
  };

  // Obtener una publicación
  JSONPlaceholderAPI.getPost = function (postId) {
    var deferred = $q.defer();
    var post = null;
    
    if (!postId)
      throw new Error('Error, postId is required.');

    var url = APIEndpoint + 'posts/' + postId;

    $http({
      method: 'GET',
      url: url
    })
    .then(function (result) {
      post = result.data;
      post.createdDate = moment().subtract(post.id, 'd').hour(_.random(8,16)).minute(_.random(1,60)).toDate();
      return JSONPlaceholderAPI.getCommentsByPost(postId);
    })
    .then(function (result) {
      post.comments = result.data;
      return JSONPlaceholderAPI.getUser(post.userId);
    })
    .then(function (result) {
      post.user = result.data;
      deferred.resolve({data: post});
    })
    .catch(function (result) {
      deferred.reject(result.data);
    });

    return deferred.promise;
  };

  // Trae todos los comentarios de un post
  JSONPlaceholderAPI.getCommentsByPost = function (postId) {
    var deferred = $q.defer();
    var url = APIEndpoint + 'posts/' + postId + '/comments';
    
    $http({
      method: 'GET', 
      url: url
    })
    .then(function (result) {
      
      // Simular fecha de comentario
      result.data.forEach(function (comment) {
        comment.createdDate = moment().subtract((Number(postId) - 1), 'd').add(comment.id, 'h').minute(_.random(1,60)).toDate();
      })
      deferred.resolve({ data: result.data });

    })
    .catch(function (result) {
      deferred.reject(result.data);
    });

    return deferred.promise;
  };

  // Obtener usuarios
  JSONPlaceholderAPI.getUsers = function (page, limit) {
    var deferred = $q.defer();
    var url = APIEndpoint + 'users/';
    
    // Por defecto son diez valores y en la primera página
    page = page || 1;
    limit = limit || 10;
    
    var skip = ( limit * (page - 1) );

    $http({
      method: 'GET', 
      url: url
    })
    .then(function (result) {
      // Lógica de la búsqueda paginada
      var data = _(result.data).slice(skip).take(limit + 1).value();
      var remain = (data.length === (limit + 1));

      // Removemos el elemento extra con el que se confirma si hay más elementos
      if (remain)
        data.pop();

      deferred.resolve({ data, remain });

    })
    .catch(function (result) {
      deferred.reject(result.data);
    });

    return deferred.promise;
  };

  // Obtener un usuario
  JSONPlaceholderAPI.getUser = function (userId) {
    var deferred = $q.defer();
    var user = null;
    
    if (!userId)
      throw new Error('Error, userId is required.');

    var url = APIEndpoint + 'users/' + userId;

    $http({
      method: 'GET',
      url: url
    })
    .then(function (result) {
      user = result.data;
      deferred.resolve({data: user});
    })
    .catch(function (result) {
      deferred.reject(result.data);
    });

    return deferred.promise;
  };

  return JSONPlaceholderAPI;
});
