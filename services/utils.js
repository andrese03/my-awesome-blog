'use strict';

/**
 * Utilería
 * Andrés Encarnación 06/12/2016
 */

// Funciones de Utilería
app.factory('Utils', function($http, $q) {

  var Utils = {};
  
  /**
   * Permite dentro de un arreglo de promesas
   * ejecutarlas en el orden del arreglo
   * @param  {Array} promises Arreglo de funciones
   * @return {Array}          Arreglo de promesas
   */
  Utils.cascade = function(promises) {
    var results = [];
    var deferred = $q.defer();

    function success(r) {
      results.push(r);
    }
    promises.reduce(function(previousCall, currentCall) {
      var deferred = $q.defer();

      previousCall.
      then(function(res) {
        success(res);
        deferred.resolve(currentCall.function.apply(currentCall.this, currentCall.parameters));
      });

      return deferred.promise;

    }, $q.when())
      .then(function(data) {
        deferred.resolve(results);
      })
      .catch(deferred.reject);

    return deferred.promise;
  };

  return Utils;
});