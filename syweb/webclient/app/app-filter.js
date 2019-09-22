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

angular.module('matrixWebClient')
.filter('duration', function() {
    return function(time) {
        if (!time) return;
        var t = parseInt(time / 1000);
        var s = t % 60;
        var m = parseInt(t / 60) % 60;
        var h = parseInt(t / (60 * 60)) % 24;
        var d = parseInt(t / (60 * 60 * 24));
        if (t < 60) {
            if (t < 0) {
                return "0s";
            }
            return s + "s";
        }
        if (t < 60 * 60) {
            return m + "m"; //  + s + "s";
        }
        if (t < 24 * 60 * 60) {
            return h + "h"; // + m + "m";
        }
        return d + "d "; // + h + "h";
    };
})
.filter('orderMembersList', function($sce) {
    return function(members) {
        var filtered = [];

        angular.forEach(members, function(member, key) {
            member["id"] = key;
            
            // do not add members who have left.
            var ignoreList = ["leave", "kick", "ban"];
            if (ignoreList.indexOf(member.event.content.membership) != -1) {
                return;
            }
            
            filtered.push(member);
        });

        filtered.sort(function (a, b) {
            // Sort members on their last_active absolute time
            a = a.user;
            b = b.user;
            
            var aLastActiveTS = 0, bLastActiveTS = 0;
            if (a && a.event && a.event.content && a.event.content.last_active_ago !== undefined) {
                aLastActiveTS = a.last_updated - a.event.content.last_active_ago;
            }
            if (b && b.event && b.event.content && b.event.content.last_active_ago !== undefined) {
                bLastActiveTS = b.last_updated - b.event.content.last_active_ago;
            }
            if (aLastActiveTS || bLastActiveTS) {
                return bLastActiveTS - aLastActiveTS;
            }
            else {
                // If they do not have last_active_ago, sort them according to their presence state
                // Online users go first amongs members who do not have last_active_ago
                var presenceLevels = {
                    offline: 1,
                    unavailable: 2,
                    online: 4,
                    free_for_chat: 3
                };
                var aPresence = (a && a.event && a.event.content.presence in presenceLevels) ? presenceLevels[a.event.content.presence] : 0;
                var bPresence = (b && b.event && b.event.content.presence in presenceLevels) ? presenceLevels[b.event.content.presence] : 0;
                return bPresence - aPresence;
            }
        });
        return filtered;
    };
})
.filter('unsafe', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}])
.filter('escapeHTML', function() {
    return function(text) {
        if (text) {
            return text.
            replace(/&/g, '&amp;').
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;').
            replace(/'/g, '&#39;').
            replace(/"/g, '&quot;');
        }
        return '';
    };
})
// Exactly the same as ngSanitize's linky but instead of pushing sanitized
// text in the addText function, we just push the raw text.
.filter('unsanitizedLinky', ['$sanitize', function($sanitize) {
  var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)[^<>\s]*[^\s.;,(){}<>"]/,
      MAILTO_REGEXP = /^mailto:/;

  return function(text, target) {
    if (!text) return text;
    var match;
    var raw = text;
    var html = [];
    var url;
    var i;
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0];
      // if we did not match ftp/http/mailto then assume mailto
      if (match[2] == match[3]) url = 'mailto:' + url;
      i = match.index;
      addText(raw.substr(0, i));
      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
      raw = raw.substring(i + match[0].length);
    }
    addText(raw);
    return $sanitize(html.join(''));

    function addText(text) {
      if (!text) {
        return;
      }
      html.push(text);
    }

    function addLink(url, text) {
      html.push('<a ');
      if (angular.isDefined(target)) {
        html.push('target="');
        html.push(target);
        html.push('" ');
      }
      html.push('href="');
      html.push(url);
      html.push('">');
      addText(text);
      html.push('</a>');
    }
  };
}]);
