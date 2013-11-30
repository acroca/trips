app.factory 'DataStorage', ["Point", (Point) ->
  save: (data) ->
    localStorage.data = angular.toJson(data)

  load: ->
    return {} unless localStorage.data?
    data = JSON.parse(localStorage.data)
    data.routes ||= []
    data.points ||= []
    data.points = Point.parse(data.points)
    data
]
