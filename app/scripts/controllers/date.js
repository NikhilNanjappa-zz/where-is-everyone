'use strict';

/**
 * @ngdoc function
 * @name whereIsEveryoneApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the whereIsEveryoneApp
 */
app.controller('DateCtrl', function ($http, $scope, $rootScope, $cookieStore, Notification, $compile) {

  $rootScope.updateStatusMenu = false;
  $rootScope.viewStatusMenu = true;
  $rootScope.navbar = true;
  $rootScope.footer = true;

  $scope.monthlyEmployeeStatus = function (emp_id,month,year) {
    var req = {
      method: "GET",
      url: 'http://where-is-everyone.herokuapp.com/api/v1/monthly_status?employee_id='+emp_id+'&month='+month+'&year='+year,
      headers: {
        'Authorization': 'Token 0a4bc86dc7c9859b8244e4bd94dd66ed'
      }
    };

    $http(req).success(function(data, status){

  //------------------------- Calling Calendar

  var calendar = $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    selectable: true,
    selectHelper: true,
    dayClick: function(date, allDay, jsEvent, view) {
      var date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
      var todaysEvents = $('#calendar').fullCalendar('clientEvents', function(event) {
        return event.start >= date && event.start < date2
      });
      if(todaysEvents.length == 0) { $scope.clickedDayTitle = ""; }
        else { $scope.clickedDayTitle = todaysEvents[0].title; }
    },
    select: function(start, end, allDay) {

      var check = $.fullCalendar.formatDate(start,'yyyy-MM-dd');
      var today = $.fullCalendar.formatDate(new Date(),'yyyy-MM-dd');

      if(check > today && $scope.clickedDayTitle == "") {
        var title = {
          state0: {
            title: 'Enter your Status details',
            html:'<label>Choose Status<select id="here" name="travel" multiple>'+
            '<option value="WorkingFromHome" selected>Working From Home</option>'+
            '<option value="OnClientSide">On Client Side</option>'+
            '<option value="Sick">Sick</option>'+
            '<option value="InOffice">InOffice</option>'+
            '<option value="PL">Planned leave</option>'+
            '<option value="CL">Casual leave</option>'+
            '<option value="Others">Others (mention in remarks)</option>'+
            '</select></label>'+
            '<br/>'+
            '<p>Please mention remarks if any:</p><div class="field"><textarea id="rate_comments" name="rate_comments"></textarea></div>',
            buttons: { Cancel: 0, Finish: 1 },
            focus: 1,
            submit:function(e,v,m,f){
              if(v==0)
                $.prompt.close();
              else if(v==1) {
                // logic to make the employee status show on the calendar
                calendar.fullCalendar('renderEvent',
                  {
                    title: here.value,
                    start: start,
                    end: end,
                    allDay: allDay
                  },
                  true // make the event "stick"
                );
                var emp_id = $cookieStore.get("emp_id");
                var emp_status = here.value;
                var emp_leave_date = $.fullCalendar.formatDate(start, "yyyy-MM-dd");

                var emp_remarks = $("#rate_comments").val();

                submitStatus(emp_id, emp_status, emp_leave_date, emp_remarks);

                calendar.fullCalendar('unselect');
                return true;
                // logic end
              } // end if v==1
            } // end submit logic
          } // end state0
        }; // end var-title

        $.prompt(title,{
          close: function(e,v,m,f){
            if(v !== undefined){
              var str = "You can now process with this given information:<br />";
              $.each(f,function(i,obj){
                str += i + " - <em>" + obj + "</em><br />";
              });
              $('#results').html(str);
            }
          },
          classes: {
            box: '',
            fade: '',
            prompt: '',
            close: '',
            title: 'lead',
            message: '',
            buttons: '',
            button: 'btn',
            defaultButton: 'btn-primary'
          }
        });
      } // disable previous dates end
      else if(check < today) {
        $.prompt('Cannot update on previous dates');
      }
      else {
        $.prompt('You have already updated for this date');
      }
    },
    editable: false,
    events: data.message
  });
  //------------------------- End calling calendar
    }).
      error(function(data, status){
        $scope.data = data || "Request failed";
        $scope.status = status;
      });
  };

  // $('.fc-button-prev').click(function(){
  //   $scope.prev_month = $('#calendar').fullCalendar( 'getDate').getMonth()+1;
  //   $scope.prev_year = $('#calendar').fullCalendar( 'getDate').getFullYear();
  //   console.log($scope.prev_month);
  //   console.log($scope.prev_year);
  //   $scope.monthlyEmployeeStatus($cookieStore.get("emp_id"),$scope.prev_month,$scope.prev_year);
  // });

  // $('.fc-button-next').click(function(){
  //   $scope.next_month = $('#calendar').fullCalendar( 'getDate').getMonth()+1;
  //   $scope.next_year = $('#calendar').fullCalendar( 'getDate').getFullYear();
  //   console.log($scope.next_month);
  //   console.log($scope.next_year);
  //   $scope.monthlyEmployeeStatus($cookieStore.get("emp_id"),$scope.next_month,$scope.next_year);
  // });

  var current_month = $.fullCalendar.formatDate(new Date(), "MM");
  var current_year = $.fullCalendar.formatDate(new Date(), "yyyy");

  $scope.monthlyEmployeeStatus($cookieStore.get("emp_id"),current_month,current_year);

  function submitStatus(emp_id, emp_status, emp_leave_date, emp_remarks) {
      $http({
        method: 'POST',
        url: 'http://where-is-everyone.herokuapp.com/api/v1/status',
        data: $.param({
          employee_id: emp_id,
          status: emp_status,
          date: emp_leave_date,
          remark: emp_remarks
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function(data, status, headers, config) {
        console.log(data.message);
        console.log(status);
      }).
        error(function(data, status, headers, config) {
          Notification.error('Date cant be in the past');
          console.log(data);
          console.log(status);
        });
  }; //scope end


});



