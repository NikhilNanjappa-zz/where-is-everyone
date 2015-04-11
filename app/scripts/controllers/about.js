'use strict';

/**
 * @ngdoc function
 * @name whereIsEveryoneApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the whereIsEveryoneApp
 */
// angular.module('whereIsEveryoneApp')
//   .controller('AboutCtrl', function ($scope) {
//     $scope.awesomeThings = [
//       'HTML5 Boilerplate',
//       'AngularJS',
//       'Karma'
//     ];
//   });

app.config(['$httpProvider', function ($httpProvider) {
  //delete $httpProvider.defaults.headers.common['X-Requested-With'];
  //$httpProvider.defaults.headers.get = { 'Authorization' : 'Token 08af8b702401a854937ceb3b570443f8' };
  //$httpProvider.defaults.headers.common['Authorization'] = 'Token 08af8b702401a854937ceb3b570443f8';
  //$httpProvider.defaults.headers.common.Authorization = 'Token 08af8b702401a854937ceb3b570443f8';
  //$httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
  //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
  //$httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
  //$httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
  //$httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
  //$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
  //$httpProvider.defaults.useXDomain = true;
}]);


app.controller('AboutCtrl', ['$scope','$http','$templateCache','$compile','$cookieStore','$rootScope','Notification', function (scope, http, templateCache, compile, cookieStore, rootScope, Notification) {

  rootScope.updateStatusMenu = true;
  rootScope.viewStatusMenu = false;
  rootScope.navbar = true;
  rootScope.footer = true;

  // Calendar options
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  var calendar2 = $('#calendar2').fullCalendar({
    defaultView: 'agendaDay',
    header: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    selectable: true,
    selectHelper: true,
    select: function(start, end, allDay) {

    },
    editable: true
  });

  scope.getStatuses = function(current_date, emp_id) {
    console.log(emp_id);
    // HTTP GET request - to fetch all the statuses for a particular day
    if(emp_id == undefined) {
      var req = {
        method: "GET",
        //url: 'http://where-is-everyone.herokuapp.com/api/v1/statuses?date=2015-04-27',
        url: 'http://where-is-everyone.herokuapp.com/api/v1/statuses?date='+current_date,
        headers: {
          'Authorization': 'Token 0a4bc86dc7c9859b8244e4bd94dd66ed'
        }
      };
    }
    else {
      var req = {
        method: "GET",
        //url: 'http://where-is-everyone.herokuapp.com/api/v1/statuses?date=2015-04-27',
        url: 'http://where-is-everyone.herokuapp.com/api/v1/status?date='+current_date+'&employee_id='+emp_id,
        headers: {
          'Authorization': 'Token 0a4bc86dc7c9859b8244e4bd94dd66ed'
        }
      };
    }

    console.log(req.url);
    http(req).success(function(data, status){
      scope.status = status;
      scope.data = data;
      console.log(data.message);
      scope.rowCollection = data.message;
      scope.itemsByPage=15;
    }).
      error(function(data, status){
        Notification.error('You have no records for this day');
        scope.data = data || "Request failed";
        scope.status = status;
      });
  };

  //copy the references for sorting and stuff
  scope.displayedCollection = [].concat(scope.rowCollection);

  $('.fc-button-prev').click(function(){
    var current_date = $('#calendar2').fullCalendar( 'getDate' );
    scope.formatted_current_date = $.fullCalendar.formatDate(current_date, "yyyy-MM-dd");
    scope.getStatuses(scope.formatted_current_date, undefined);
  });

  $('.fc-button-next').click(function(){
    var current_date = $('#calendar2').fullCalendar( 'getDate' );
    scope.formatted_current_date = $.fullCalendar.formatDate(current_date, "yyyy-MM-dd");
    scope.getStatuses(scope.formatted_current_date, undefined);
  });

  //$(".fc-button-next").html(
  //  compile(
  //    "<span ng-click='changeListName()' class='fc-button fc-button-next fc-state-default fc-corner-right'><span class='fc-button-inner'><span class='fc-button-content'>&nbsp;►&nbsp;</span><span class='fc-button-effect'><span></span></span></span></span>"
  //  )(scope)
  //);
  //
  //scope.changeListName = function() {
  //  var current_date = $('#calendar2').fullCalendar( 'getDate' );
  //  scope.formatted_current_date = $.fullCalendar.formatDate(current_date, "yyyy-MM-dd");
  //  scope.getStatuses();
  //};

  var current_date = $('#calendar2').fullCalendar( 'getDate' );
  var formatted_current_date = $.fullCalendar.formatDate(current_date, "yyyy-MM-dd");
  scope.getStatuses(formatted_current_date);

  scope.getMyStatus = function() {
    scope.getStatuses(scope.formatted_current_date, cookieStore.get("emp_id"));
  }

}]);