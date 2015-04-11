/**
 * Created by nikhilnanjappa on 02/04/15.
 */
'use strict';

/**
 * @ngdoc function
 * @name whereIsEveryoneApp.controller:MainCtrl
 * @description
 * # NavbarCtrl
 * Controller of the whereIsEveryoneApp
 */
app.controller('NavBarCtrl', function ($scope, $cookieStore, $location, Notification, $rootScope) {

  $scope.myname = $cookieStore.get("emp_name");

  $scope.logout = function() {
    $cookieStore.remove("emp_name");
    $cookieStore.remove("emp_id");
    $location.path("/register");
    Notification.success('Your are successfully logged out');
  }

  $scope.updateYourStatus = function() {
    $scope.ones = false;
    $scope.two = false;
    $location.path("/date");
  }

  $scope.ViewYourStatus = function () {
    $location.path("/");
  }

});
