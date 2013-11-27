app.controller 'MapCtrl', ["$q", "$scope", "$state", "$log", ($q, $scope, $state, $log) ->
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
    $scope.map.fit = false if $scope.map.markers.length > 0

    $scope.map.polylines[0] =
      path:
        for point in newVal when point.latitude?
          latitude: point.latitude
          longitude: point.longitude
      stroke:
        color: "#ff0000"
        weight: 3

    $scope.map.markers =
      for point in newVal when point.latitude?
        latitude: point.latitude
        longitude: point.longitude
        icon: point.icon

  , true

]
