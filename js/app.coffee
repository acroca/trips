app = angular.module('trips', ['google-maps'])

app.config ['$locationProvider', ($locationProvider) -> $locationProvider.html5Mode(false).hashPrefix('!') ]
