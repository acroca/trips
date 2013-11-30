app.controller 'AppCtrl', ["$scope", "DataStorage", ($scope, DataStorage) ->
  $scope.map = {}

  data = DataStorage.load()
  $scope.points = data.points
  $scope.routes = data.routes
  $scope.$watch 'points', (newVal) ->
    DataStorage.save(data)
  , true
  $scope.$watch 'routes', (newVal) ->
    DataStorage.save(data)
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
