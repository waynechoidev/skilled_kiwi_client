# ~~Skilled Kiwi Client~~
It is deprecated.

Skilled Kiwi is a platform designed to connect skilled individuals with those in need of their help. I got the motivation from people who live alone or are old, so have to fix almost of daily issue with extremely high cost. It doesn't mean highly-professional work, but simple work many forks do on their own like lawn mowing, change light bulbs or connect Internet.

## Overview

> This application is still under development. I just provide a demo page.

<img width="400" src="./public/screenshot/1.jpg">

- [Demo Service](http://skilledkiwi.netlify.app/)

  mock user ID: abcd1234

  mock user Password: abcd1234!

## Mobile Responsive

<img width="200" src="./public/screenshot/2.jpg">

## Backend Application

I built a backend application with Express.js and TypeScript. It is a restful API server with MYSQL database for user information and job posts.

I implemented authentication with JWT tokens. Temporarily it saves refresh tokens on its memory.

- [Backend Repository](https://github.com/radicalDilettante/skilled_kiwi_client)

## Global State Management (Context API)

I used context API to manage global statement. It was for an access JWT token for user authentication.

## Fetching Data (SWR)

I used SWR to fetch data from backend API. Why I don't use fetch API or Axios, but SWR is that it cache the data. It prevents unnecessary requests.

## Authentication

I implemented an authentication module, and it is not dependent to any framework or library. It is made with TS class, so it has its own status. I injected all the dependency to update state of frontend framework, and local storage.

- [Auth Module for any frontend framework](https://waynechoi.dev/auth_module_for_any_frontend_framework)

## Custom Hooks

I made a custom hooks to manage statements for form and input. To re-use in multiple components, I implemented branching process with optional parameters.

## Unit Test (Jest)

I write unit test codes with Jest library. I mocked HTTP request modules, and functions to be injected.

## Object Oriented Programming

I did partly OOP. In my point of view, sign up and authentication logics are better to have their own states, and they can be implemented without dependence on React library. So I made it with class.

If I decoupled to reduce dependence with class, it makes better maintainability, and easier test code. At the same time, it costs a lot to convert states from the class instance to the React library, and even from the React library to the class instance.

However, I made most of the logics with static class. There is a class keyword in static class, but it is same as multiple number of functions. Because it does not have states, but only actions.

- [State management with Class in React](https://waynechoi.dev/state_management_with_class_in_react)

## To be implemented in the future

- Skeleton UI when loading data
- Bidding for jobs
- Life Hack sharing
- Real time chat service
- Touch slide carousel for mobile
