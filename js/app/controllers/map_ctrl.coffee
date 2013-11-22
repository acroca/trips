app.controller 'MapCtrl', ["$q", "$scope", "$state", "$log", ($q, $scope, $state, $log) ->
  $scope.center = latitude: 36, longitude: 0
  $scope.zoom = 2
  $scope.markers = []
  $scope.fit = true

  $scope.$watch 'points', (newVal) ->
    $scope.fit = false if $scope.markers.length > 0
    $scope.markers =
      for point in newVal when point.latitude?
        infoWindow: point.caption()
        latitude: point.latitude
        longitude: point.longitude
        icon: point.icon
  , true

  $scope.eventsProperty =
    click: (mapModel, eventName, originalEventArgs) ->
      latLng = originalEventArgs[0].latLng
      $scope.clicked_pos(latLng.lat(), latLng.lng())
]
