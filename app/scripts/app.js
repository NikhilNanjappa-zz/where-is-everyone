'use strict';

/**
 * @ngdoc overview
 * @name whereIsEveryoneApp
 * @description
 * # whereIsEveryoneApp
 *
 * Main module of the application.
 */
var app = angular
  .module('whereIsEveryoneApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'smart-table',
    'ui.bootstrap',
    'ui-notification'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/date', {
        templateUrl: 'views/date.html',
        controller: 'DateCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        controller : function(){
          window.location.replace('/404.html');
        },
        template : "<div></div>"
      });
  });

// var app = angular.module('whereIsEveryoneApp', ['ngRoute']);

// app.controller('RootCtrl', ['$scope', function($scope){
//     $scope.title = "Home Page";
// }]);

// app.controller('CatsCtrl', ['$scope', function($scope){
//     $scope.title = "Cats Page";
// }]);

// app.config(['$routeProvider', function($routeProvider){
//     $routeProvider
//         .when('/', {
//             controller : 'RootCtrl',
//             template : '<h1>{{title}}</h1>'
//         })
//         .when('/cats', {
//             controller : 'CatsCtrl',
//             template : '<h1>{{title}}</h1>'
//         })
//         .otherwise({
//             redirectTo : '/'
//         });
// }]);