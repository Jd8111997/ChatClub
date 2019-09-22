# -*- coding: utf-8 -*-
# Copyright 2014-2016 OpenMarket Ltd
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

""" This module contains REST servlets to do with profile: /profile/<paths> """
from twisted.internet import defer

from synapse.http.servlet import parse_json_object_from_request
from synapse.types import UserID
from synapse.types import RoomID

from .base import ClientV1RestServlet, client_path_patterns


class ProfileDisplaynameRestServlet(ClientV1RestServlet):
    PATTERNS = client_path_patterns("/profile/(?P<user_id>[^/]*)/displayname")

    def __init__(self, hs):
        super(ProfileDisplaynameRestServlet, self).__init__(hs)
        self.profile_handler = hs.get_profile_handler()

    @defer.inlineCallbacks
    def on_GET(self, request, user_id):
        user = UserID.from_string(user_id)

        displayname = yield self.profile_handler.get_displayname(
            user,
        )

        ret = {}
        if displayname is not None:
            ret["displayname"] = displayname

        defer.returnValue((200, ret))

    @defer.inlineCallbacks
    def on_PUT(self, request, user_id):
        requester = yield self.auth.get_user_by_req(request, allow_guest=True)
        user = UserID.from_string(user_id)
        is_admin = yield self.auth.is_server_admin(requester.user)

        content = parse_json_object_from_request(request)

        try:
            new_name = content["displayname"]
        except Exception:
            defer.returnValue((400, "Unable to parse name"))

        yield self.profile_handler.set_displayname(
            user, requester, new_name, is_admin)

        defer.returnValue((200, {}))

    def on_OPTIONS(self, request, user_id):
        return (200, {})

#--------------------for dob save-------------------------------------------------
class ProfileDobRestServlet(ClientV1RestServlet):
    PATTERNS = client_path_patterns("/profile/(?P<user_id>[^/]*)/dob")

    def __init__(self, hs):
        super(ProfileDobRestServlet, self).__init__(hs)
        self.profile_handler = hs.get_profile_handler()

    @defer.inlineCallbacks
    def on_GET(self, request, user_id):
        user = UserID.from_string(user_id)

        dob = yield self.profile_handler.get_dob(
            user,
        )
        print "---------------------In V1/profile.py -- ProfileDobRestServlet class-----------------------------------"
        print "dob = ",dob
        print "-------------------------------------------------------------------------------------------------------"

        ret = {}
        if dob is not None:
            ret["dob"] = dob

        defer.returnValue((200, ret))

    @defer.inlineCallbacks
    def on_PUT(self, request, user_id):
        requester = yield self.auth.get_user_by_req(request, allow_guest=True)
        user = UserID.from_string(user_id)
        is_admin = yield self.auth.is_server_admin(requester.user)

        content = parse_json_object_from_request(request)

        try:
            new_dob = content["dob"]
        except Exception:
            defer.returnValue((400, "Unable to parse dob"))

        yield self.profile_handler.set_dob(
            user, requester, new_dob, is_admin)

        defer.returnValue((200, {}))

    def on_OPTIONS(self, request, user_id):
        return (200, {})
#---------------------------------------------------------------

class ProfileAvatarURLRestServlet(ClientV1RestServlet):
    PATTERNS = client_path_patterns("/profile/(?P<user_id>[^/]*)/avatar_url")

    def __init__(self, hs):
        super(ProfileAvatarURLRestServlet, self).__init__(hs)
        self.profile_handler = hs.get_profile_handler()

    @defer.inlineCallbacks
    def on_GET(self, request, user_id):
        user = UserID.from_string(user_id)

        avatar_url = yield self.profile_handler.get_avatar_url(
            user,
        )

        ret = {}
        if avatar_url is not None:
            ret["avatar_url"] = avatar_url

        defer.returnValue((200, ret))

    @defer.inlineCallbacks
    def on_PUT(self, request, user_id):
        requester = yield self.auth.get_user_by_req(request)
        user = UserID.from_string(user_id)
        is_admin = yield self.auth.is_server_admin(requester.user)

        content = parse_json_object_from_request(request)
        try:
            new_name = content["avatar_url"]
        except Exception:
            defer.returnValue((400, "Unable to parse name"))

        yield self.profile_handler.set_avatar_url(
            user, requester, new_name, is_admin)

        defer.returnValue((200, {}))

    def on_OPTIONS(self, request, user_id):
        return (200, {})

## Added by me
"""
class GroupAvatarURLRestServlet(ClientV1RestServlet):

    PATTERNS = client_path_patterns("/profile/(?P<room_id>[^/]*)/room_icon_url")

    def __init__(self, hs):
        super(GroupAvatarURLRestServlet, self).__init__(hs)
        self.profile_handler = hs.get_profile_handler()

    @defer.inlineCallbacks
    def on_GET(self, request, room_id):
        room = RoomID.from_string(room_id)

        avatar_url = yield self.profile_handler.get_room_avatar_url(
            room,
        )

        ret = {}
        if avatar_url is not None:
            ret["room_icon_url"] = avatar_url

        defer.returnValue((200, ret))

    @defer.inlineCallbacks
    def on_PUT(self, request, room_id):
        requester = yield self.auth.get_user_by_req(request)
        room = RoomID.from_string(room_id)
        is_admin = yield self.auth.is_server_admin(requester.user)
        content = parse_json_object_from_request(request)

        new_avatar_url = content["group_avatar_url"];

        try:
            new_name = content["room_icon_url"]
        except Exception:
            defer.returnValue((400, "Unable to parse name"))

        yield self.profile_handler.set_room_avatar_url(
            room, requester, new_avatar_url, is_admin)

        defer.returnValue((200, {}))

    def on_OPTIONS(self, request, user_id):
        return (200, {})

##--------------------
"""
class ProfileRestServlet(ClientV1RestServlet):
    PATTERNS = client_path_patterns("/profile/(?P<user_id>[^/]*)")

    def __init__(self, hs):
        super(ProfileRestServlet, self).__init__(hs)
        self.profile_handler = hs.get_profile_handler()

    @defer.inlineCallbacks
    def on_GET(self, request, user_id):
        user = UserID.from_string(user_id)

        displayname = yield self.profile_handler.get_displayname(
            user,
        )
        avatar_url = yield self.profile_handler.get_avatar_url(
            user,
        )
        dob = yield self.profile_handler.get_dob(
            user,
        )

        ret = {}
        if displayname is not None:
            ret["displayname"] = displayname
        if avatar_url is not None:
            ret["avatar_url"] = avatar_url
        if dob is not None:
            ret["dob"]=dob

        defer.returnValue((200, ret))


def register_servlets(hs, http_server):
    ProfileDisplaynameRestServlet(hs).register(http_server)
    ProfileAvatarURLRestServlet(hs).register(http_server)
    ProfileRestServlet(hs).register(http_server)
