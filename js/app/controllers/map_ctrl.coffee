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
      for point in newVal when point?.latitude?
        do (point) ->
          latitude: point.latitude
          longitude: point.longitude
          icon: point.icon
          on_clicked: -> $scope.clicked_point(point)

  , true

  $scope.$watch 'routes', (newVal) ->
    return unless newVal?
    $scope.map.polylines = for route in newVal when route.points.length > 1
      path:
        for point_id in route.points when $scope.points[point_id].latitude?
          latitude: $scope.points[point_id].latitude
          longitude: $scope.points[point_id].longitude
      stroke:
        color: route.color
        weight: 3

  , true

]
