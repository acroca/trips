app.config ["$stateProvider", "$urlRouterProvider", ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise("/")

  $stateProvider
    .state 'app',
      templateUrl: 'app.html'
      controller: "AppCtrl"

    .state 'app.main',
      url: '/'
      views:
        "main@app":
          templateUrl: "map.html"
          controller: "MapCtrl"
        "sidebar@app":
          templateUrl: "points.html"
          controller: "PointsCtrl"

]
