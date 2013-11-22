app = angular.module('trips', ["ui.router", 'google-maps'])

app.config ['$locationProvider', ($locationProvider) -> $locationProvider.html5Mode(true).hashPrefix('!') ]
