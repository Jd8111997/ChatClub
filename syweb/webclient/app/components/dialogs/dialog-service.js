/*
Copyright 2014 OpenMarket Ltd

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

'use strict';

/*
This service contains logic for showing error, notification and confirmation
dialogs.
*/
angular.module('dialogService', [])
.factory('dialogService', ['$q', 'dialogs', function($q, dialogs) {

    // create a rejected promise with the given message
    var showDialog = function(kind, title, body) {
        var dialog;
        title = escapeHtml(title);
        body = escapeHtml(body);
        
        if (kind === "error") {
            dialog = dialogs.error(title, body);
        }
        else if (kind === "success") {
            dialog = dialogs.notify(title, body);
        }
        else {
            console.error("Unknown kind of dialog: " + kind);
        }
        
        if (dialog) {
            return dialog.result;
        }
        else {
            var defer = $q.defer();
            defer.reject("Unable to display dialog");
            return defer.promise;
        }
    };
    
    var escapeHtml = function(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };
    
    return {

        showConfirm: function(title, someHtml) {
            var d = dialogs.confirm(title, someHtml);
            return d.result;
        },
    
        showProgress: function(title, body, progress) {
            var d = dialogs.wait(escapeHtml(title), escapeHtml(body), progress);
            return d.result;
        },
    
        showSuccess: function(title, body) {
            return showDialog("success", title, body);
        },
    
        showMatrixError: function(title, error) {
            return showDialog("error", title, 
                    error.error + " ("+error.errcode+")");
        },
    
        showError: function(error) {
            if (typeof(error) === "string") {
                return showDialog("error", "Error", error);
            }
            else if (error.data && error.data.errcode && error.data.error) {
                error = error.data;
                return this.showMatrixError("Error", error);
            }
            else if (error.errcode && error.error) {
                return this.showMatrixError("Error", error);
            }
            else if (error.status === 0) {
                return showDialog("error", "Network Error", "Unable to complete your request.");
            }
            else if (error.status > 0) {
                return showDialog("error", "HTTP Error", "Unable to complete your request. ("+error.status+")");
            }
            else {
                console.error("Unknown error: "+JSON.stringify(error));
            }
            // fallback: always return a promise but reject it.
            var defer = $q.defer();
            defer.reject(error);
            return defer.promise;
        }
    
    };
}]);
