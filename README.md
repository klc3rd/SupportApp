# Tech Support App

Creator – Kenneth Cluck

## Summary

This application is a basic tech support ticketing system. Anyone can submit support tickets. Users that are admins or technicians can take over the ticket to respond to these tickets. Admins and technicians can also close out tickets. Closed tickets can still be reopened, either by the ticket creator or a admin/technician.

## Usage

There are two default logins for the demo. There is an admin user with the username “admin” and the password of “password”. There is a standard user login with the username “user” and the password of “password”. There is no technician demo account, however the admin account has identical access, as well as the ability to modify users.

## Differences in the live demo

The live demo is in a demo mode. In this changing passwords and user role is disabled. The purpose of this is to ensure the default login information logs in and has proper access. Account email addresses are not visible the admin for the privacy of anyone that registers a new user.

## Challenges faced

This is my first NextJS project. While I have made projects in React, NextJS was a new experience. My biggest challenge was configuring Next-Auth. I have worked with OAuth before but since I was using NextJS I decided to use the standard solution for user authentication. While this made authentication significantly easier, I had to learn how to configure Next-Auth. The guide I used to learn Next-Auth was outdated and configuration options were not all valid. I had to read several pages of the project website to complete configuration.
