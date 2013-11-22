app.factory 'PointStorage', ["Point", (Point) ->
  save: (points) ->
    localStorage.points = angular.toJson(points)

  load: ->
    return [] unless localStorage.points?
    Point.parse(localStorage.points)

]
