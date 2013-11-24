app.controller 'LoadSaveCtrl', ["$scope", "Point", ($scope, Point) ->
  $scope.save_string = angular.toJson($scope.points)

  $scope.load = ->
    parsed = Point.parse($scope.load_string)
    $scope.points.splice(0, $scope.points.length)
    for point in parsed
      $scope.points.push point
]
