app.controller 'MapCtrl', ["$q", "$scope", "$log", ($q, $scope, $log) ->
  $scope.map.markers =[]
  $scope.map.polylines =[]
  $scope.map.zoom =2
  $scope.map.center = latitude: 36, longitude: 0
  $scope.map.fit = true
  $scope.map.events =
    click: (mapModel, eventName, originalEventArgs) ->
      latLng = originalEventArgs[0].latLng
      $scope.clicked_pos(latLng.lat(), latLng.lng())


  $scope.$watch 'points', (newVal) ->
    return unless newVal?
    $scope.map.fit = false if $scope.map.markers.length > 0

    $scope.map.markers =
      for point in newVal when point.latitude?
        latitude: point.latitude
        longitude: point.longitude
        icon: point.icon

  , true

  $scope.$watch 'routes', (newVal) ->
    return unless newVal?
    $scope.map.polylines = for route in newVal when route.points.length > 0
      path:
        for point in route.points when point.latitude?
          latitude: point.latitude
          longitude: point.longitude
      stroke:
        color: route.color
        weight: 3

  , true

]
