# -*- coding: utf-8 -*-
# Copyright 2015, 2016 OpenMarket Ltd
# Copyright 2018 New Vector
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

from __future__ import print_function

import argparse
import getpass
import hashlib
import hmac
import logging
import sys

from six.moves import input

import requests as _requests
import yaml


def request_registration(
    user,
    password,
    server_location,
    shared_secret,
    gender,
    dob,
    address,
    mobile_no,
    place,
    department,
    branch,
    admin=False,
    requests=_requests,
    _print=print,
    exit=sys.exit,
):

    url = "%s/_matrix/client/r0/admin/register" % (server_location,)

    # Get the nonce
    r = requests.get(url, verify=False)

    if r.status_code is not 200:
        _print("ERROR! Received %d %s" % (r.status_code, r.reason))
        if 400 <= r.status_code < 500:
            try:
                _print(r.json()["error"])
            except Exception:
                pass
        return exit(1)

    nonce = r.json()["nonce"]

    mac = hmac.new(key=shared_secret.encode('utf8'), digestmod=hashlib.sha1)

    mac.update(nonce.encode('utf8'))
    mac.update(b"\x00")
    mac.update(user.encode('utf8'))
    mac.update(b"\x00")
    mac.update(password.encode('utf8'))
    mac.update(b"\x00")
    mac.update(b"admin" if admin else b"notadmin")

    mac = mac.hexdigest()

    data = {
        "nonce": nonce,
        "username": user,
        "password": password,
        "mac": mac,
        "admin": admin,
        "gender":gender,
        "dob":dob,
        "address":address,
        "mobile_no": mobile_no,
        "place":place,
        "department":department,
        "branch":branch,
    }

    _print("Sending registration request...")
    r = requests.post(url, json=data, verify=False)

    if r.status_code is not 200:
        _print("ERROR! Received %d %s" % (r.status_code, r.reason))
        if 400 <= r.status_code < 500:
            try:
                _print(r.json()["error"])
            except Exception:
                pass
        return exit(1)

    _print("Success!")


def register_new_user(user, password, server_location, shared_secret, admin,gender,dob,address,mobile_no,place,department,branch):
    if not user:
        try:
            default_user = getpass.getuser()
        except Exception:
            default_user = None

        if default_user:
            user = input("New user localpart [%s]: " % (default_user,))
            if not user:
                user = default_user
        else:
            user = input("New user localpart: ")

    if not user:
        print("Invalid user name")
        sys.exit(1)

    if not password:
        password = getpass.getpass("Password: ")

        if not password:
            print("Password cannot be blank.")
            sys.exit(1)

        confirm_password = getpass.getpass("Confirm password: ")

        if password != confirm_password:
            print("Passwords do not match")
            sys.exit(1)

    if admin is None:
        admin = input("Make admin [no]: ")
        if admin in ("y", "yes", "true"):
            admin = True
        else:
            admin = False
    #-------------------------------------------------------------------
    #ADDED BY ADITYA ---------------------------------------------------
    if gender:
        gender= input("New user gender 1 [%s]: " % (gender,))
        if not gender:
            gender = gender
    else:
        gender = input("New user gender 2: ")

    if not gender:
        print("Invalid user gender")
        sys.exit(1)
    #------------------------1----------------------
    if dob:
        dob = input("New user date of birth [%s]: " % (dob,))
        if not dob:
            dob = dob
    else:
        dob= input("New user dob: ")

    if not dob:
        print("Invalid user dob")
        sys.exit(1)
    #---------------------------------2---------------------
    if address:
        address = input("New user address [%s]: " % (address,))
        if not address:
            address = address
    else:
        address = input("New user address: ")

    if not address:
        print("Invalid user address")
        sys.exit(1)
    #---------------------------3-------------------------
    if mobile_no:
        mobile_no = input("New user mobile number [%s]: " % (mobile_no,))
        if not mobile_no:
            mobile_no = mobile_no
    else:
        mobile_no = input("New user mobiele number: ")

    if not mobile_no:
        print("Invalid user mobile number")
        sys.exit(1)
    #---------------------------4-----------------------
    if place:
        place = input("New user employee of State/Central [%s]: " % (place,))
        if not place:
            place = place
    else:
        place = input("New user employee of State/Central: ")

    if not place:
        print("Invalid user place")
        sys.exit(1)
    #---------------------------5-----------------------
    if department:
        department = input("New user deparment [%s]: " % (department,))
        if not department:
            department = department
    else:
        department = input("New user department: ")

    if not department:
        print("Invalid user department")
        sys.exit(1)
    #---------------------------6-----------------------
    if branch:
        branch= input("New user branch [%s]: " % (branch,))
        if not branch:
            branch= branch
    else:
        branch = input("New user branch : ")

    if not branch:
        print("Invalid user branch")
        sys.exit(1)
    #---------------------------7-----------------------
    #---------------------------------------------------------------------
    #---------------------------------------------------------------------

    request_registration(user, password, server_location, shared_secret, bool(admin),gender,dob,address,mobile_no,place,department,branch)


def main():

    logging.captureWarnings(True)

    parser = argparse.ArgumentParser(
        description="Used to register new users with a given home server when"
        " registration has been disabled. The home server must be"
        " configured with the 'registration_shared_secret' option"
        " set."
    )
    parser.add_argument(
        "-u",
        "--user",
        default=None,
        help="Local part of the new user. Will prompt if omitted.",
    )
    parser.add_argument(
        "-p",
        "--password",
        default=None,
        help="New password for user. Will prompt if omitted.",
    )
    admin_group = parser.add_mutually_exclusive_group()
    admin_group.add_argument(
        "-a",
        "--admin",
        action="store_true",
        help=(
            "Register new user as an admin. "
            "Will prompt if --no-admin is not set either."
        ),
    )
    admin_group.add_argument(
        "--no-admin",
        action="store_true",
        help=(
            "Register new user as a regular user. "
            "Will prompt if --admin is not set either."
        ),
    )

    #---------------------------------------------------------------------------------
    #-----------------------Added by aditya-------------------------------------------

    parser.add_argument(
        "-g",
        "--gender",
        default=None,
        help="gender of the new user. Will prompt if omitted.",
    )
    #----------------------------------1---------------------------------------
    parser.add_argument(
        "-d",
        "--dob",
        default=None,
        help="date of birth of the new user. Will prompt if omitted.",
    )
    #-----------------------------------2--------------------------------------
    parser.add_argument(
        "-add",
        "--address",
        default=None,
        help="addresss of the new user. Will prompt if omitted.",
    )
    #----------------------------------3----------------------------------------
    parser.add_argument(
        "-m",
        "--mobile_no",
        default=None,
        help="mobile number of the new user. Will prompt if omitted.",
    )

    #---------------------------------4------------------------------------------
    parser.add_argument(
        "-p",
        "--place",
        default=None,
        help="place of the new user. Will prompt if omitted.",
    )

    # ---------------------------------5------------------------------------------
    parser.add_argument(
        "-d",
        "--department",
        default=None,
        help="department of the new user. Will prompt if omitted.",
    )

    # ---------------------------------6------------------------------------------
    parser.add_argument(
        "-b",
        "--branch",
        default=None,
        help="branch of the new user. Will prompt if omitted.",
    )

    # ---------------------------------7-------------------------------------------
    #--------------------------------------------------------------------------------

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "-c",
        "--config",
        type=argparse.FileType('r'),
        help="Path to server config file. Used to read in shared secret.",
    )

    group.add_argument(
        "-k", "--shared-secret", help="Shared secret as defined in server config file."
    )

    parser.add_argument(
        "server_url",
        default="https://localhost:8448",
        nargs='?',
        help="URL to use to talk to the home server. Defaults to "
        " 'https://localhost:8448'.",
    )

    args = parser.parse_args()

    if "config" in args and args.config:
        config = yaml.safe_load(args.config)
        secret = config.get("registration_shared_secret", None)
        if not secret:
            print("No 'registration_shared_secret' defined in config.")
            sys.exit(1)
    else:
        secret = args.shared_secret

    admin = None
    if args.admin or args.no_admin:
        admin = args.admin

    register_new_user(args.user, args.password, args.server_url, secret, admin,args.gender,args.dob,args.address,args.mobile_no,args.place,args.department,args.branch)


if __name__ == "__main__":
    main()
