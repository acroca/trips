(function() {
  var app, get_random_color,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = angular.module('trips', ['google-maps']);

  app.config([
    '$locationProvider', function($locationProvider) {
      return $locationProvider.html5Mode(false).hashPrefix('!');
    }
  ]);

  app.controller('AppCtrl', [
    "$scope", "DataStorage", function($scope, DataStorage) {
      var data;
      $scope.map = {};
      data = DataStorage.load();
      $scope.points = data.points;
      $scope.routes = data.routes;
      $scope.$watch('points', function(newVal) {
        return DataStorage.save(data);
      }, true);
      $scope.$watch('routes', function(newVal) {
        return DataStorage.save(data);
      }, true);
      $scope.start_set_pos = function(point) {
        $scope.editing_route = null;
        return $scope.setting_pos_for = point;
      };
      $scope.start_edit_route = function(route) {
        $scope.setting_pos_for = null;
        return $scope.editing_route = route;
      };
      $scope.stop_edit_route = function() {
        return $scope.editing_route = null;
      };
      $scope.clicked_pos = function(lat, lng) {
        if ($scope.setting_pos_for != null) {
          return $scope.$apply(function() {
            $scope.setting_pos_for.latitude = lat;
            $scope.setting_pos_for.longitude = lng;
            return $scope.setting_pos_for = null;
          });
        }
      };
      $scope.clicked_point = function(point) {
        if ($scope.editing_route) {
          return $scope.$apply(function() {
            var idx, point_idx;
            point_idx = $scope.points.indexOf(point);
            idx = $scope.editing_route.points.indexOf(point_idx);
            if (idx > -1) {
              return $scope.editing_route.points.splice(idx, 1);
            } else {
              return $scope.editing_route.points.push(point_idx);
            }
          });
        }
      };
      return $scope.zoom_location = function(lat, lng) {
        $scope.map.center.latitude = lat;
        $scope.map.center.longitude = lng;
        return $scope.map.zoom = 15;
      };
    }
  ]);

  app.controller('MapCtrl', [
    "$q", "$scope", "$log", "Point", function($q, $scope, $log, Point) {
      var geocoder, redraw;
      google.maps.visualRefresh = true;
      $scope.map.options = {
        streetViewControl: false,
        panControl: false
      };
      $scope.map.markers = [];
      $scope.map.search_results = [];
      $scope.map.polylines = [];
      $scope.map.zoom = 2;
      $scope.map.center = {
        latitude: 36,
        longitude: 0
      };
      $scope.map.fit = true;
      $scope.map.infoWindow = {
        coords: {
          latitude: -41.284643475558376,
          longitude: 174.77874755859375
        },
        show: true
      };
      $scope.close_search_marker = function() {
        return $scope.clicked_search_marker = void 0;
      };
      $scope.points_mapping = Point.mapping;
      $scope.map.events = {
        click: function(mapModel, eventName, originalEventArgs) {
          var latLng;
          latLng = originalEventArgs[0].latLng;
          return $scope.clicked_pos(latLng.lat(), latLng.lng());
        }
      };
      redraw = function(points, routes) {
        var point, point_id, route;
        $scope.map.markers = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = points.length; _i < _len; _i++) {
            point = points[_i];
            if ((point != null ? point.latitude : void 0) != null) {
              _results.push((function(point) {
                return {
                  latitude: point.latitude,
                  longitude: point.longitude,
                  icon: point.icon,
                  on_clicked: function() {
                    return $scope.clicked_point(point);
                  }
                };
              })(point));
            }
          }
          return _results;
        })();
        return $scope.map.polylines = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = routes.length; _i < _len; _i++) {
            route = routes[_i];
            if (route.points.length > 1) {
              _results.push({
                path: (function() {
                  var _j, _len1, _ref, _results1;
                  _ref = route.points;
                  _results1 = [];
                  for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                    point_id = _ref[_j];
                    if (points[point_id].latitude != null) {
                      _results1.push({
                        latitude: points[point_id].latitude,
                        longitude: points[point_id].longitude
                      });
                    }
                  }
                  return _results1;
                })(),
                stroke: {
                  color: route.color,
                  weight: 3
                }
              });
            }
          }
          return _results;
        })();
      };
      $scope.$watch('points', function(newVal) {
        if (newVal == null) {
          return;
        }
        if ($scope.map.markers.length > 0) {
          $scope.map.fit = false;
        }
        return redraw(newVal, $scope.routes);
      }, true);
      $scope.$watch('routes', function(newVal) {
        if (newVal == null) {
          return;
        }
        return redraw($scope.points, newVal);
      }, true);
      geocoder = new google.maps.Geocoder();
      return $scope.search = function() {
        var search;
        if ($scope.search_text === "") {
          return $scope.map.search_results = [];
        } else {
          search = $scope.search_text;
          return (function(search) {
            return geocoder.geocode({
              address: $scope.search_text
            }, function(results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                return $scope.$apply(function() {
                  var result;
                  return $scope.map.search_results = (function() {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = results.length; _i < _len; _i++) {
                      result = results[_i];
                      _results.push((function(result) {
                        return {
                          latitude: result.geometry.location.lat(),
                          longitude: result.geometry.location.lng(),
                          icon: 'http://maps.google.com/mapfiles/ms/micons/purple-pushpin.png',
                          tooltip: true,
                          name: result.address_components[0].long_name,
                          on_clicked: function() {
                            var _this = this;
                            return $scope.$apply(function() {
                              return $scope.clicked_search_marker = _this;
                            });
                          },
                          add_point: function(type) {
                            return $scope.points.push(Point.build({
                              name: result.address_components[0].long_name,
                              latitude: result.geometry.location.lat(),
                              longitude: result.geometry.location.lng(),
                              type: type
                            }));
                          }
                        };
                      })(result));
                    }
                    return _results;
                  })();
                });
              } else {
                return console.log("===> not found: ", status);
              }
            });
          })(search);
        }
      };
    }
  ]);

  get_random_color = function() {
    var color, letters, _i;
    letters = '0123456789ABCDEF'.split('');
    color = '#';
    for (_i = 1; _i <= 6; _i++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  };

  app.controller('PointsCtrl', [
    "$scope", "Point", function($scope, Point) {
      var k, m;
      $scope.new_point = {
        type: 'place'
      };
      $scope.types = (function() {
        var _ref, _results;
        _ref = Point.mapping;
        _results = [];
        for (k in _ref) {
          m = _ref[k];
          _results.push({
            name: m.name,
            type: k
          });
        }
        return _results;
      })();
      $scope.set_type = function(type) {
        return $scope.new_point = {
          type: type
        };
      };
      $scope.new_route = function() {
        return $scope.routes.push({
          name: "Route " + $scope.routes.length,
          color: get_random_color(),
          points: []
        });
      };
      $scope.delete_route = function(route) {
        var idx;
        idx = $scope.routes.indexOf(route);
        return $scope.routes.splice(idx, 1);
      };
      $scope.add_point = function() {
        $scope.points.push(Point.build($scope.new_point));
        return $scope.new_point = {
          type: $scope.new_point.type
        };
      };
      $scope.delete_point = function(point) {
        var idx, p_idx, r, _i, _len, _ref;
        idx = $scope.points.indexOf(point);
        if (idx === -1) {
          return;
        }
        _ref = $scope.routes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          r = _ref[_i];
          p_idx = r.points.indexOf(idx);
          if (p_idx > -1) {
            r.points.splice(p_idx, 1);
          }
        }
        return $scope.points.splice(idx, 1);
      };
      return $scope.set_position = function(point) {
        return $scope.start_set_pos(point);
      };
    }
  ]);

  app.factory('DataStorage', [
    "Point", function(Point) {
      return {
        save: function(data) {
          return localStorage.data = angular.toJson(data);
        },
        load: function() {
          var data;
          if (localStorage.data == null) {
            return {};
          }
          try {
            data = JSON.parse(localStorage.data);
            data.routes || (data.routes = []);
            data.points || (data.points = []);
            data.points = Point.parse(data.points);
            return data;
          } catch (_error) {
            return {};
          }
        }
      };
    }
  ]);

  app.factory('Point', function() {
    var Airport, Camping, CarRental, Ferry, Hotel, MustSee, Place, Point, Restaurant, m, mapping, o, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    Point = (function() {
      function Point(object) {
        var k, v;
        for (k in object) {
          v = object[k];
          this[k] = v;
        }
        this;
      }

      Point.prototype.caption = function() {
        return this.name;
      };

      Point.build = function(object) {
        var klass;
        klass = mapping[object.type].klass;
        return new klass(object);
      };

      return Point;

    })();
    Airport = (function(_super) {
      var icon;

      __extends(Airport, _super);

      function Airport() {
        _ref = Airport.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      icon = 'http://maps.google.com/mapfiles/ms/icons/plane.png';

      Airport.prototype.icon = icon;

      Airport.icon = icon;

      return Airport;

    })(Point);
    Place = (function(_super) {
      var icon;

      __extends(Place, _super);

      function Place() {
        _ref1 = Place.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      icon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

      Place.prototype.icon = icon;

      Place.icon = icon;

      return Place;

    })(Point);
    MustSee = (function(_super) {
      var icon;

      __extends(MustSee, _super);

      function MustSee() {
        _ref2 = MustSee.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

      MustSee.prototype.icon = icon;

      MustSee.icon = icon;

      return MustSee;

    })(Place);
    Hotel = (function(_super) {
      var icon;

      __extends(Hotel, _super);

      function Hotel() {
        _ref3 = Hotel.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      icon = 'http://maps.google.com/mapfiles/ms/micons/homegardenbusiness.png';

      Hotel.prototype.icon = icon;

      Hotel.icon = icon;

      return Hotel;

    })(Point);
    Restaurant = (function(_super) {
      var icon;

      __extends(Restaurant, _super);

      function Restaurant() {
        _ref4 = Restaurant.__super__.constructor.apply(this, arguments);
        return _ref4;
      }

      icon = 'http://maps.google.com/mapfiles/ms/micons/restaurant.png';

      Restaurant.prototype.icon = icon;

      Restaurant.icon = icon;

      return Restaurant;

    })(Point);
    CarRental = (function(_super) {
      var icon;

      __extends(CarRental, _super);

      function CarRental() {
        _ref5 = CarRental.__super__.constructor.apply(this, arguments);
        return _ref5;
      }

      icon = 'http://maps.google.com/mapfiles/ms/micons/cabs.png';

      CarRental.prototype.icon = icon;

      CarRental.icon = icon;

      return CarRental;

    })(Point);
    Ferry = (function(_super) {
      var icon;

      __extends(Ferry, _super);

      function Ferry() {
        _ref6 = Ferry.__super__.constructor.apply(this, arguments);
        return _ref6;
      }

      icon = 'http://maps.google.com/mapfiles/ms/micons/ferry.png';

      Ferry.prototype.icon = icon;

      Ferry.icon = icon;

      return Ferry;

    })(Point);
    Camping = (function(_super) {
      var icon;

      __extends(Camping, _super);

      function Camping() {
        _ref7 = Camping.__super__.constructor.apply(this, arguments);
        return _ref7;
      }

      icon = 'http://maps.google.com/mapfiles/ms/micons/campground.png';

      Camping.prototype.icon = icon;

      Camping.icon = icon;

      return Camping;

    })(Point);
    mapping = {
      airport: {
        name: "Airport",
        klass: Airport
      },
      must_see: {
        name: "Must",
        klass: MustSee
      },
      place: {
        name: "Normal",
        klass: Place
      },
      hotel: {
        name: "Hotel",
        klass: Hotel
      },
      restaurant: {
        name: "Restaurant",
        klass: Restaurant
      },
      car_rental: {
        name: "Car rental",
        klass: CarRental
      },
      ferry: {
        name: "Ferry",
        klass: Ferry
      },
      camping: {
        name: "Camping",
        klass: Camping
      }
    };
    for (m in mapping) {
      o = mapping[m];
      o.icon = o.klass.icon;
    }
    return {
      mapping: mapping,
      parse: function(objects) {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          o = objects[_i];
          _results.push(this.build(o));
        }
        return _results;
      },
      build: function(object) {
        return Point.build(object);
      }
    };
  });

}).call(this);
