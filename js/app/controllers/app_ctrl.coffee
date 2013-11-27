app.controller 'AppCtrl', ["$scope", "PointStorage", ($scope, PointStorage) ->
  $scope.map = {}

  $scope.points = PointStorage.load()

  $scope.$watch 'points', (newVal) ->
    PointStorage.save(newVal)
  , true

  $scope.start_set_pos = (point) ->
    $scope.setting_pos_for = point

  $scope.clicked_pos = (lat, lng) ->
    return unless $scope.setting_pos_for?
    $scope.$apply ->
      $scope.setting_pos_for.latitude = lat
      $scope.setting_pos_for.longitude = lng
      $scope.setting_pos_for = null

  $scope.zoom_location = (lat, lng) ->

    $scope.map.center.latitude = lat
    $scope.map.center.longitude = lng
    $scope.map.zoom = 15

]
