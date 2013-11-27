app.controller 'PointsCtrl', ["$scope", "Point", ($scope, Point) ->

  $scope.new_point = {type: 'place'}

  $scope.types = ({name: m.name, type: k} for k,m of Point.mapping)

  $scope.set_type = (type) ->
    $scope.new_point = {type: type}

  $scope.add_point = ->
    $scope.points.push Point.build($scope.new_point)
    $scope.new_point = {type: $scope.new_point.type}

  $scope.delete_point = (point) ->
    idx = $scope.points.indexOf(point)
    return if idx == -1
    $scope.points.splice(idx, 1)

  $scope.set_position = (point) ->
    $scope.start_set_pos point
]
