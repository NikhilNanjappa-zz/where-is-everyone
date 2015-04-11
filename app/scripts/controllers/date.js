'use strict';

/**
 * @ngdoc function
 * @name whereIsEveryoneApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the whereIsEveryoneApp
 */
app.controller('DateCtrl', function ($http, $scope, $rootScope, $cookieStore, Notification) {

  $rootScope.updateStatusMenu = false;
  $rootScope.viewStatusMenu = true;
  $rootScope.navbar = true;
  $rootScope.footer = true;

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  var calendar = $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    selectable: true,
    selectHelper: true,
    select: function(start, end, allDay) {

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

    },
    editable: true,
    events: [
      {
        title: 'All Day Event',
        start: '2015-04-11'
      },
      {
        title: 'Long Event',
        start: '2015-04-12',
        end: '2015-04-15'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: new Date(y, m, d-3, 16, 0),
        allDay: false
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: new Date(y, m, d+4, 16, 0),
        allDay: false
      },
      {
        title: 'Meeting',
        start: new Date(y, m, d, 10, 30),
        allDay: false
      },
      {
        title: 'Lunch',
        start: new Date(y, m, d, 12, 0),
        end: new Date(y, m, d, 14, 0),
        allDay: false
      },
      {
        title: 'Birthday Party',
        start: new Date(y, m, d+1, 19, 0),
        end: new Date(y, m, d+1, 22, 30),
        allDay: false
      },
      {
        title: 'EGrappler.com',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        url: 'http://EGrappler.com/'
      },
      {
        title: 'My Day',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        url: 'http://EGrappler.com/'
      }
    ]
  });

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



