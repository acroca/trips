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

  redraw = (points, routes) ->
    $scope.map.markers =
      for point in points when point?.latitude?
        do (point) ->
          latitude: point.latitude
          longitude: point.longitude
          icon: point.icon
          on_clicked: -> $scope.clicked_point(point)

    $scope.map.polylines = for route in routes when route.points.length > 1
      path:
        for point_id in route.points when points[point_id].latitude?
          latitude: points[point_id].latitude
          longitude: points[point_id].longitude
      stroke:
        color: route.color
        weight: 3


  $scope.$watch 'points', (newVal) ->
    return unless newVal?
    $scope.map.fit = false if $scope.map.markers.length > 0
    redraw(newVal, $scope.routes)
  , true

  $scope.$watch 'routes', (newVal) ->
    return unless newVal?
    redraw($scope.points, newVal)
  , true

]
