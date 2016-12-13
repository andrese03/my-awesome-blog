'use strict';

/**
 * Navbar directive
 * Andrés Encarnación 06/06/2016
 */

app.directive('navbar', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/navbar.html',
    replace: true,
    controller: function ($scope, $interval) {

      $scope.date = new Date();

      $interval(function(){
        $scope.date = new Date();
      }, 1000);

    }
  };
});
