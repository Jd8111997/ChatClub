/*
 Copyright 2014,2015 OpenMarket Ltd

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

angular.module('RegisterController', ['matrixService'])
.controller('RegisterController', ['$scope', '$rootScope', '$location', '$window', 'matrixService', 'eventStreamService', 'dialogService',//"$filter", "dob",
                                    function($scope, $rootScope, $location, $window, matrixService, eventStreamService, dialogService) {
    'use strict';

    // FIXME: factor out duplication with login-controller.js

    // Assume that this is hosted on the home server, in which case the URL
    // contains the home server.
    var hs_url = $location.protocol() + "://" + $location.host();
    if ($location.port() &&
        !($location.protocol() === "http" && $location.port() === 80) &&
        !($location.protocol() === "https" && $location.port() === 443))
    {
        hs_url += ":" + $location.port();
    }

    var captchaRendered = false;

    var generateClientSecret = function() {
        var ret = "";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 32; i++) {
            ret += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return ret;
    };

    $scope.stage = 'initial';
    //-------------------------------------------------------------------------------
    //--------------------------Added by aditya---- for gender fatch----------------------------------

    $scope.gender='gender';
      $scope.getVal=function(){
        console.log("gender = ",$scope.account.gender);
        $scope.gender=$scope.account.gender;
        };
        var gender_data = $scope.gender;
        console.log("gender = ",gender_data);

    //------------------------for state or central------------------------------------



    $scope.place='place';
      $scope.getdata=function(){
        console.log($scope.account.place);
        $scope.place=$scope.account.place;
        };

        var place_data = $scope.place;
        console.log("place = ",place_data);

/*
    //------------------------for department dropdown----------------------------------------------------------


    // CREATE AN 'employees' OBJECT, WITH AN ARRAY OF DATA.
    $scope.department = {
         "1": { 'name': 'ministry of current affairs'},
         "2": { 'name': 'department of science and technology' },
         "3": { 'name': 'ministry of defence' },
         "4": { 'name': 'ministry of education'},
         "5": { 'name': 'ministry of social welfare' }
     };

     $scope.deptArray = Object.keys($scope.department)
         .map(function (value, index) {
             return {values: $scope.department[value] }
         }
     );

     // SHOW EMPLOYEE DETAILS.
     $scope.showDepartment = function () {
        $scope.department ='Name: ' + $scope.account.department.values.name;
        console.log("dept name = ",$scope.department)
     };


    //--------------------------for branch--------------------------------------------------------

    // CREATE AN 'employees' OBJECT, WITH AN ARRAY OF DATA.
    $scope.branch = {
        "1": { 'name': 'BISAG'},
        "2": { 'name': 'GIL' },
        "3": { 'name': 'ISRO' },
        "4": { 'name': 'RTO'},
        "5": { 'name': 'ABC Branch' }
    };

    $scope.brArray = Object.keys($scope.branch)
        .map(function (value, index) {
            return {values: $scope.branch[value] }
        }
    );

    // SHOW EMPLOYEE DETAILS.
    $scope.showBranch = function () {
        $scope.branch ='Name: ' + $scope.account.branch.values.name;

         console.log("brch name = ",$scope.branch)
    };

    //------------------------------------------------------------------------------------
    //-------------------------------------added by aditya for dob------------------------

    /*$scope.account = {
         dob: new Date("yyyy","MM","dd")
         };
     console.log("dob = ",$scope.account.dob)
    /*$scope.$watch('dob', function (val) {

                $scope.result = $filter('date')(new Date(), val);

            }, true);

    /*$scope.$watch('account.dob', function (newValue) {
    $scope.account.dob = $filter('date')(newValue, 'DD/MM/YYYY');
    console.log("dob  = ",$scope.account.dob);
    });

    $scope.$watch('acocunt.dob', function (newValue) {
    $scope.account.dob = $filter('date')(newValue, 'DD/MM/YYYY');
    console.log("dob  = ",$scope.account.dob);
    });
    console.log("dob  = ",$scope.account.dob);

/*
     var app = angular.module("account.dob", []);

 app.factory("dob", dob() {
  var obj = {};
  obj.account = {
    title: "date of birth",
    date: 1387843200000
  }

  return obj;

});

    dob($scope, $filter, dob) {
    var item = dob.account;

    console.log(item);
    item.date = $filter('date')(item.date, "dd/MM/yyyy");
    dob.account.birhdate = new Date(item.date);

    $scope.account = item;

    };

    var date = new Date();

var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();

if (month < 10) month = "0" + month;
if (day < 10) day = "0" + day;

var today = year + "-" + month + "-" + day;
document.getElementById("theDate").value = today;


*/
    /*var dob = account.dob;
    console.log("dob = ",dob);
    dob.dob = $filter('date')(dob.dob, "dd/MM/yyyy");
    account.birthdate = new Date(dob.dob);
    $scope.account.dob = dob;*/


/*
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    document.getElementById("account.dob").value = today;*/

/*
    var now = new Date();

    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

    $('#account.dob').val(today);*/

    /*var d = new Date('account.dob');
    d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );

    /*var SelectDate = $scope.GetFormattedDate(Date.parse($("#account.dob").datepicker("getDate")));
     $scope.GetFormattedDate = function (CalDate) {
     var re = /-?\d+/;
     var WDate = CalDate.toString();
     var m = re.exec(WDate);
     var lastDate = new Date(parseInt(m[0]));
     var mm = lastDate.getMonth() + 1;
     var dd = lastDate.getDate();
     var yyyy = lastDate.getFullYear();
    var formattedDate = mm + '/' + dd + '/' + yyyy; return formattedDate; }*/

/*
   // var myDate = new Date("account.dob");
  //  alert(myDate.format('M jS, Y \\i\\s \\h\\e\\r\\e!'));

// Simulates PHP's date function
    Date.prototype.format = function(format) {
    var returnStr = '';
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {       var curChar = format.charAt(i);         if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
            returnStr += curChar;
        }
        else if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        } else if (curChar != "\\"){
            returnStr += curChar;
        }
    }
    return returnStr;
};

    Date.replaceChars = {
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    // Day
    d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
    D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
    j: function() { return this.getDate(); },
    l: function() { return Date.replaceChars.longDays[this.getDay()]; },
    N: function() { return this.getDay() + 1; },
    S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
    w: function() { return this.getDay(); },
    z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
    // Week
    W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
    // Month
    F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
    m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
    M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
    n: function() { return this.getMonth() + 1; },
    t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
    // Year
    L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
    o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
    Y: function() { return this.getFullYear(); },
    y: function() { return ('' + this.getFullYear()).substr(2); },
    // Time
    a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
    A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
    B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
    g: function() { return this.getHours() % 12 || 12; },
    G: function() { return this.getHours(); },
    h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
    H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
    i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
    s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
    u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?
'0' : '')) + m; },
    // Timezone
    e: function() { return "Not Yet Supported"; },
    I: function() {
        var DST = null;
            for (var i = 0; i < 12; ++i) {
                    var d = new Date(this.getFullYear(), i, 1);
                    var offset = d.getTimezoneOffset();

                    if (DST === null) DST = offset;
                    else if (offset < DST) { DST = offset; break; }
                    else if (offset > DST) break;
            }
            return (this.getTimezoneOffset() == DST) | 0;
        },
    O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
    P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
    T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
    Z: function() { return -this.getTimezoneOffset() * 60; },
    // Full Date/Time
    c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
    r: function() { return this.toString(); },
    U: function() { return this.getTime() / 1000; }
};
//Or the minified version:

// Simulates PHP's date function
Date.prototype.format=function(e){var t="";var n=Date.replaceChars;for(var r=0;r<e.length;r++){var i=e.charAt(r);if(r-1>=0&&e.charAt(r-1)=="\\"){t+=i}else if(n[i]){t+=n[i].call(this)}else if(i!="\\"){t+=i}}return t};Date.replaceChars={shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","August","September","October","November","December"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d:function(){return(this.getDate()<10?"0":"")+this.getDate()},D:function(){return Date.replaceChars.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.replaceChars.longDays[this.getDay()]},N:function(){return this.getDay()+1},S:function(){return this.getDate()%10==1&&this.getDate()!=11?"st":this.getDate()%10==2&&this.getDate()!=12?"nd":this.getDate()%10==3&&this.getDate()!=13?"rd":"th"},w:function(){return this.getDay()},z:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil((this-e)/864e5)},W:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil(((this-e)/864e5+e.getDay()+1)/7)},F:function(){return Date.replaceChars.longMonths[this.getMonth()]},m:function(){return(this.getMonth()<9?"0":"")+(this.getMonth()+1)},M:function(){return Date.replaceChars.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var e=new Date;return(new Date(e.getFullYear(),e.getMonth(),0)).getDate()},L:function(){var e=this.getFullYear();return e%400==0||e%100!=0&&e%4==0},o:function(){var e=new Date(this.valueOf());e.setDate(e.getDate()-(this.getDay()+6)%7+3);return e.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(""+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?"am":"pm"},A:function(){return this.getHours()<12?"AM":"PM"},B:function(){return Math.floor(((this.getUTCHours()+1)%24+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1e3/24)},g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){return((this.getHours()%12||12)<10?"0":"")+(this.getHours()%12||12)},H:function(){return(this.getHours()<10?"0":"")+this.getHours()},i:function(){return(this.getMinutes()<10?"0":"")+this.getMinutes()},s:function(){return(this.getSeconds()<10?"0":"")+this.getSeconds()},u:function(){var e=this.getMilliseconds();return(e<10?"00":e<100?"0":"")+e},e:function(){return"Not Yet Supported"},I:function(){var e=null;for(var t=0;t<12;++t){var n=new Date(this.getFullYear(),t,1);var r=n.getTimezoneOffset();if(e===null)e=r;else if(r<e){e=r;break}else if(r>e)break}return this.getTimezoneOffset()==e|0},O:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+"00"},P:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+":00"},T:function(){var e=this.getMonth();this.setMonth(0);var t=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,"$1");this.setMonth(e);return t},Z:function(){return-this.getTimezoneOffset()*60},c:function(){return this.format("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1e3}}
Search

//Categories
*/
/*$scope.account={
var birth = dob;
var moment = moment(birth).utcOffset(birth)
final_dob = moment.format('DD/MM/YYYY')
console.log(moment.format('DD/MM/YYYY'))
}*//*
    $scope.dob ="dob";
    var moment = moment($scope.dob).utcOffset($scope.dob);*/
    //var new_date = new Date(),
        //new_date:dob.slice(0,10),
    /*var date = new Date(dob);
    console.log("date = ",date.toISOString().slice(0,10));*/
/*
    var new_dob = new Date();
    console.log("Dob = ",new_dob.getDate($scope.account.dob));
    isoDateTime = yyyy-mm-dd'T'HH:MM:ss
    Thu Oct 14 2019 00:00:00 GMT 0530 (India Standard Time)
    UTC:yyyy-mm-dd'T'HH:MM:ss'Z'  == isoUtcDateTime

*/
    //var input_date = dateFormat(new Date("isoUtcDateTime"), 'dd/mm/yyyy');
  /*  var input_date = new Date();
    var str_date = input_date.toISOString().slice(0,10);
//    input_date.toDateString().slice(0,10);
   /* var input = document.getElementById("dob").value;
    var dateEntered = new Date(input);
    console.log("date = ",dateEntered,"\n input = ",input);
    var y = input_date.getFullYear();
    var m = input_date.getMonth() + 1;
    var d = input_date.getDate();
    document.getElementById("dob").innerHTML = d + "/" + m + "/" + y;
    var regex =new RegExp('^(0[1-9]|[1-9]|[12][0-9]|3[01])-(0[1-9]|[1-9]|1[012])-(19|20)\\d\\d$');
    input_date=input_date.regex;
    console.log("input date = ",input_date);*/



   /* Date.prototype.fromString = function(str, ddmmyyyy) {
    var m = str.match(/(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/);
    if(m[2] == "/"){
        if(ddmmyyyy === false)
            return new Date(+m[4], +m[1] - 1, +m[3], m[5] ? +m[5] : 0, m[6] ? +m[6] : 0, m[7] ? +m[7] : 0, m[8] ? +m[8] * 100 : 0);
        return new Date(+m[4], +m[3] - 1, +m[1], m[5] ? +m[5] : 0, m[6] ? +m[6] : 0, m[7] ? +m[7] : 0, m[8] ? +m[8] * 100 : 0);
    }
    return new Date(+m[1], +m[3] - 1, +m[4], m[5] ? +m[5] : 0, m[6] ? +m[6] : 0, m[7] ? +m[7] : 0, m[8] ? +m[8] * 100 : 0);
}*/
    //dateEntered.value = "YYYY-MM-DD"
    //var formated_date =dateEntered
    //---------------------------------------------------------------------------------------------------------------------
    //=====================================================================================================================
    $scope.account = {
        homeserver: hs_url,
        desired_user_id: "",
        desired_user_name: "",
        password: "",
        identityServer: $location.protocol() + "://matrix.org",
        pwd1: "",
        pwd2: "",
        displayName : "",
        bind_email: true,
        gender:"",
        dob :"",//new Date().setUTCHours(0,0,0,0),//input_date, //,//new RegExp('^(0[1-9]|[1-9]|[12][0-9]|3[01])-(0[1-9]|[1-9]|1[012])-(19|20)\\d\\d$'),//input_date,//new Date(),//new Date().toUTCString(),//.toLocaleFormat("%d.%m.%Y %H:%M (%a)"),//.getTimezoneOffset(),///new_date,//date.split('T'),//.toISOString().slice(0,10),//new Date()//.slice(0,10),//.toISOString().slice(0,10),//new Date(),//,moment.format('dd/MM/yyyy HH;mm'),//new Date(),//new Date(+dob+dob.getTimezoneOffset()*60000),//new Date("dd","MM","yyyy"),//d,//SelectDate,//d,//new Date().getFullYear()+"-"+ ((parseInt(new Date().getMonth())+1+100)+"").substring(1),// $('#account.dob').val(today),
        address : "",
        mobile_no : "",
        place:"",
        department:"",
        branch:"",
      };
    console.log("scope.account =  ",$scope.account.mobile_no);
    $scope.registering = false;

    $scope.register = function() {
        // Set the urls
        matrixService.setConfig({
            homeserver: $scope.account.homeserver,
            identityServer: $scope.account.identityServer
        });

        if ($scope.account.pwd1 !== $scope.account.pwd2) {
            $scope.feedback = "Passwords don't match.";
            return;
        }
        else if ($scope.account.pwd1.length < 6) {
            $scope.feedback = "Password must be at least 6 characters.";
            return;
        }
        /*if($scope.account.dob){
            var new_dob = new Date();
            var date_str = $scope.account.dob.toISOString();//.slice(0,10);
            var year = date_str.slice(0,4);//.split('-',5);//.slice(0,4);
            var month = date_str.slice(5,7);//.split('-',8);//.slice(5,7);
            var day = date_str.slice(8,10);//.split('T',11);//.slice(8,10);
            $scope.account.dob.setDate(day);
            $scope.account.dob.setMonth(month);
            $scope.account.dob.setFullYear(year);
            console.log("date of birth = ",$scope.account.dob);
        }
        else{
            console.log("-------------------------------------In date else-------------------------------");
        }*/

        if ($scope.account.email) {
            // check the username is free
            $scope.registering = true;
            matrixService.register($scope.account.desired_user_id, $scope.account.pwd1,true,$scope.account.gender,$scope.account.dob,$scope.account.address,$scope.account.mobile_no,$scope.account.place,$scope.account.department,$scope.account.branch ).then(
                function() {
                    dialogService.showError("Registration protocol error occurred with this Home Server. Your account may be registered without your email address.");
                    $scope.registering = false;
                },
                function(error) {
                    if (!error.data) {
                        dialogService.showError(error);
                        $scope.registering = false;
                        return;
                    }
                    if (error.data && error.data.errcode === "M_USER_IN_USE") {
                        dialogService.showMatrixError("Username taken", error.data);
                        $scope.reenter_username = true;
                        $scope.stage = 'initial';
                        $scope.registering = false;
                        return;
                    }
                    $scope.clientSecret = generateClientSecret();
                    matrixService.linkEmail($scope.account.email, $scope.clientSecret, 1).then(
                        function(response) {
                            $scope.stage = 'email';
                            $scope.sid = response.data.sid;
                            $scope.feedback = "";
                            $scope.registering = false;
                        },
                        function(error) {
                            $scope.stage = 'initial';
                            dialogService.showError(error);
                            $scope.registering = false;
                        }
                    );
                }
            );
        } else {
            registerWithMxidAndPassword($scope.account.desired_user_id, $scope.account.pwd1,$scope.account.bind_email,$scope.account.gender,$scope.account.dob,$scope.account.address,$scope.account.mobile_no,$scope.account.place,$scope.account.department,$scope.account.branch);
        }
    };
    /*        console.log("-------------------data check in controller in registration method ----------------");
        console.log("address = ",address);
        console.log("mobile_no = ",mobile_no);
        console.log("dob = ",dob);
        console.log("gender = ",gender);
        console.log("----------------------------------------------------------------------------------");*/
    var registerWithMxidAndPassword = function(mxid, password,threepidCreds,captchaResponse,gender,dob,address,mobile_no,place,department,branch) {
        $scope.registering = true;
        matrixService.register(mxid, password, threepidCreds, captchaResponse,gender,dob,address,mobile_no,place,department,branch,undefined,$scope.account.bind_email).then(
            function(response) {
                $scope.registering = false;
                if (captchaRendered) {
                    $window.grecaptcha.reset();
                }
                // Update the current config
                var config = matrixService.config();
                angular.extend(config, {
                    access_token: response.data.access_token,
                    user_id: response.data.user_id
                });
                matrixService.setConfig(config);

                // And permanently save it
                matrixService.saveConfig();

                $rootScope.onLoggedIn();

                if ($scope.account.displayName) {
                    // FIXME: handle errors setting displayName
                    matrixService.setDisplayName($scope.account.displayName);
                }

                 // Go to the user's rooms list page
                $location.url("home");
            },
            function(error) {
                $scope.registering = false;
                console.error("Registration error: "+JSON.stringify(error));
                if (error.authfailed) {
                    if (error.authfailed === "m.login.recaptcha") {
                        $scope.captchaMessage = "Verification failed. Are you sure you're not a robot?";
                        if (captchaRendered) {
                            $window.grecaptcha.reset();
                        }
                    } else if (error.authfailed === "m.login.email.identity") {
                        dialogService.showError("Couldn't verify email address: make sure you've clicked the link in the email");
                    } else {
                        dialogService.showError("Authentication failed");
                        $scope.stage = 'initial';
                        if (captchaRendered) {
                            window.grecaptcha.reset();
                        }
                    }
                } else {
                    if (error.data && error.data.errcode === "M_USER_IN_USE") {
                        dialogService.showMatrixError("Username taken", error.data);
                        $scope.reenter_username = true;
                        $scope.stage = 'initial';
                        if (captchaRendered) {
                            $window.grecaptcha.reset();
                        }
                    }
                    else if (error.data && error.data.errcode == "M_CAPTCHA_NEEDED") {
                        $scope.stage = 'captcha';
                        window.grecaptcha.render("regcaptcha", {
                            sitekey: error.data.public_key,
                            callback: function(response) {
                                registerWithMxidAndPassword(mxid, password,gender,dob,address,mobile_no,place,department,branch,$scope.account.bind_email, threepidCreds, response);
                            }
                        });
                        captchaRendered = true;
                    }
                    else {
                        dialogService.showError(error);
                        $scope.stage = 'initial';
                        if (captchaRendered) {
                            window.grecaptcha.reset();
                        }
                    }
                }
            });
    }

    $scope.verifyToken = function() {
        registerWithMxidAndPassword(
            $scope.account.desired_user_id, $scope.account.pwd1,
            {
                sid: $scope.sid,
                client_secret: $scope.clientSecret,
                id_server: $scope.account.identityServer.split('//')[1]
            }
        );
    };
}]);
