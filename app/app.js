/// <reference path="../Scripts/angular-1.1.4.js" />

/*#######################################################################
  
  Dan Wahlin
  http://twitter.com/DanWahlin
  http://weblogs.asp.net/dwahlin
  http://pluralsight.com/training/Authors/Details/dan-wahlin

  Normally like to break AngularJS apps into the following folder structure
  at a minimum:

  /app
      /controllers      
      /directives
      /services
      /partials
      /views

  #######################################################################*/
var roles = {
    superUser: 0,
    admin: 1,
    user: 2
};
var app = angular.module('whalesApp', ['ngRoute', 'ui.bootstrap', 'pageslide-directive']);

//This configures the routes and associates each route with a view and a controller
app.config(['$routeProvider', function ($routeProvider) {
    console.log('/,aonm');
    $routeProvider
        .when('/',
            {
                controller: 'WhalesController',
                templateUrl: 'app/partials/editor/editor.html'
            })
        .otherwise({ redirectTo: '/' });
}]);

/*
var app = angular.module("appModule", ['ngRoute', 'ngResource'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/superUserSpecificRoute', {
                templateUrl: '/templates/superUser.html',//path of the view/template of route
                caseInsensitiveMatch: true,
                controller: 'superUserController',//angular controller which would be used for the route
                resolve: {//Here we would use all the hardwork we have done above and make call to the authorization Service
                    //resolve is a great feature in angular, which ensures that a route controller(in this case superUserController ) is invoked for a route only after the promises mentioned under it are resolved.
                    permission: function(authorizationService, $route) {
                        return authorizationService.permissionCheck([roles.superUser]);
                    },
                }
            })
            .when('/userSpecificRoute', {
                templateUrl: '/templates/user.html',
                caseInsensitiveMatch: true,
                controller: 'userController',
                resolve: {
                    permission: function (authorizationService, $route) {
                        return authorizationService.permissionCheck([roles.user]);
                    },
                }
            })
            .when('/adminSpecificRoute', {
                templateUrl: '/templates/admin.html',
                caseInsensitiveMatch: true,
                controller: 'adminController',
                resolve: {
                    permission: function(authorizationService, $route) {
                        return authorizationService.permissionCheck([roles.admin]);
                    },
                }
            })
            .when('/adminSuperUserSpecificRoute', {
                templateUrl: '/templates/adminSuperUser.html',
                caseInsensitiveMatch: true,
                controller: 'adminSuperUserController',
                resolve: {
                    permission: function(authorizationService, $route) {
                        return authorizationService.permissionCheck([roles.admin,roles.superUser]);
                    },
                }
            })
    });*/