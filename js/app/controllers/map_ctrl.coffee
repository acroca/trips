app.controller 'MapCtrl', ["$q", "$scope", "$log", "Point", ($q, $scope, $log, Point) ->
  google.maps.visualRefresh = true

  $scope.map.options =
    streetViewControl: false
    panControl: false
  $scope.map.markers =[]
  $scope.map.search_results =[]
  $scope.map.polylines =[]
  $scope.map.zoom =2
  $scope.map.center = latitude: 36, longitude: 0
  $scope.map.fit = true
  $scope.map.infoWindow =
    coords: {latitude: -41.284643475558376, longitude: 174.77874755859375}
    show: true


  $scope.map.events =
    click: (mapModel, eventName, originalEventArgs) ->
      latLng = originalEventArgs[0].latLng
      $scope.clicked_pos(latLng.lat(), latLng.lng())

  redraw = (points, routes) ->
    $scope.map.markers =
      for point in points when point?.latitude?
        do (point) ->
          latitude: point.latitude
          longitude: point.longitude
          icon: point.icon
          on_clicked: -> $scope.clicked_point(point)

    $scope.map.polylines = for route in routes when route.points.length > 1
      path:
        for point_id in route.points when points[point_id].latitude?
          latitude: points[point_id].latitude
          longitude: points[point_id].longitude
      stroke:
        color: route.color
        weight: 3


  $scope.$watch 'points', (newVal) ->
    return unless newVal?
    $scope.map.fit = false if $scope.map.markers.length > 0
    redraw(newVal, $scope.routes)
  , true

  $scope.$watch 'routes', (newVal) ->
    return unless newVal?
    redraw($scope.points, newVal)
  , true

  geocoder = new google.maps.Geocoder()

  $scope.search = ->
    if $scope.search_text == ""
      $scope.map.search_results = []
    else
      search = $scope.search_text
      do (search) ->
        geocoder.geocode address: $scope.search_text,
          (results, status) ->
            if status == google.maps.GeocoderStatus.OK
              $scope.$apply ->
                $scope.map.search_results = for result in results
                  do (result) ->
                    latitude: result.geometry.location.lat()
                    longitude: result.geometry.location.lng()
                    icon: 'http://maps.google.com/mapfiles/ms/micons/yellow-dot.png'
                    tooltip: true
                    name: result.address_components[0].long_name
                    # on_clicked: -> @tooltip = true
                    on_clicked: -> @add_point('must_see')
                    add_point: (type) ->
                      $scope.$apply ->
                        $scope.points.push Point.build
                          name: result.address_components[0].long_name
                          latitude: result.geometry.location.lat()
                          longitude: result.geometry.location.lng()
                          type: type

            else
              console.log("===> not found: ", status);
]
