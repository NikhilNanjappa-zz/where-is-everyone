/**
 * Created by nikhilnanjappa on 31/03/15.
 */
'use strict';

/**
 * @ngdoc function
 * @name whereIsEveryoneApp.controller:MainCtrl
 * @description
 * # RegisterCtrl
 * Controller of the whereIsEveryoneApp
 */
  app.controller('RegisterCtrl', ['$scope','$http','Notification','$location','$cookieStore','$rootScope', function (scope, http, Notification, location, cookieStore, rootScope) {

    ///^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$/i

  rootScope.navbar = false;
  rootScope.footer = false;


  scope.register = function () {
    var allowed="/^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$/i";
    if((scope.registerName == undefined) || (scope.registerEmail == undefined) || (scope.registerPassword == undefined) || (scope.registerName == "") || (scope.registerEmail == "") || (scope.registerPassword == "")) {
      Notification.error('All the fields are required');
    }
    else if(scope.registerEmail != allowed) {
      Notification.error('Invalid email id');
    }
    else if(scope.registerPassword != scope.registerConfirmPassword) {
      Notification.error('The passwords do not match');
    }
    else {
      http({
        method: 'POST',
        url: 'http://where-is-everyone.herokuapp.com/api/v1/register',
        data: $.param({
          name: scope.registerName,
          email: scope.registerEmail,
          password: scope.registerPassword
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function (data, status, headers, config) {
        scope.data = data.message;
        scope.status = status;

        if (data.success == false) {
          Notification.primary(data.message[0]);
        }
        else {
          Notification.primary('Your new Account has been created');
          cookieStore.put("emp_name", data.message.name);
          cookieStore.put("emp_id", data.message.id);
          location.path("/about");
        }
      }).
        error(function (data, status, headers, config) {
          scope.data = data;
          scope.status = status;
        });
    }
  };

  scope.login = function () {
    if((scope.loginEmail == undefined) || (scope.loginPassword == undefined) || (scope.loginEmail == "") || (scope.loginPassword == "")) {
      Notification.error('Email and Password fields are empty');
    }
    else {
      http({
        method: 'POST',
        url: 'http://where-is-everyone.herokuapp.com/api/v1/authenticate',
        data: $.param({
          email: scope.loginEmail,
          password: scope.loginPassword
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function(data, status, headers, config) {
        console.log(data);
        console.log(status);
        if(data.success == false) {
          Notification.error('Email or Password is invalid');
        }
        else {
          Notification.primary('You are Successfully logged in');
          cookieStore.put("emp_name", data.message.name);
          cookieStore.put("emp_id", data.message.id);
          location.path("/about");
        }
      }).
        error(function(data, status, headers, config) {
          console.log(data);
          console.log(status);
        });

    } //else end
  }; //scope end


}]);
