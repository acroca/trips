app.controller 'AppCtrl', ["$scope", "PointStorage", ($scope, PointStorage) ->
  $scope.map = {}

  $scope.points = PointStorage.load()
  $scope.routes = [
    # {name: "Route 1", color: "#ff0000", points: $scope.points[0..1]}
    # {name: "Route 2", color: "#0000ff", points: $scope.points[2..3]}
  ]
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
