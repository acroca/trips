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
    $scope.editing_route = null
    $scope.setting_pos_for = point

  $scope.start_edit_route = (route) ->
    $scope.setting_pos_for = null
    $scope.editing_route = route

  $scope.stop_edit_route = ->
    $scope.editing_route = null

  $scope.clicked_pos = (lat, lng) ->
    if $scope.setting_pos_for?
      $scope.$apply ->
        $scope.setting_pos_for.latitude = lat
        $scope.setting_pos_for.longitude = lng
        $scope.setting_pos_for = null

  $scope.clicked_point = (point) ->
    if $scope.editing_route
      $scope.$apply ->
        point_idx = $scope.points.indexOf(point)
        console.log('''===> point_idx: ''', point_idx)
        idx = $scope.editing_route.points.indexOf(point_idx)
        console.log('''===> idx: ''', idx)
        if idx > -1
          $scope.editing_route.points.splice(idx, 1)
        else
          $scope.editing_route.points.push point_idx

  $scope.zoom_location = (lat, lng) ->

    $scope.map.center.latitude = lat
    $scope.map.center.longitude = lng
    $scope.map.zoom = 15

]
