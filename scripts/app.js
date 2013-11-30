(function() {
  var app,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = angular.module('trips', ['google-maps']);

  app.config([
    '$locationProvider', function($locationProvider) {
      return $locationProvider.html5Mode(false).hashPrefix('!');
    }
  ]);

  app.controller('AppCtrl', [
    "$scope", "PointStorage", function($scope, PointStorage) {
      $scope.map = {};
      $scope.points = PointStorage.load();
      $scope.routes = [];
      $scope.$watch('points', function(newVal) {
        return PointStorage.save(newVal);
      }, true);
      $scope.start_set_pos = function(point) {
        return $scope.setting_pos_for = point;
      };
      $scope.clicked_pos = function(lat, lng) {
        if ($scope.setting_pos_for == null) {
          return;
        }
        return $scope.$apply(function() {
          $scope.setting_pos_for.latitude = lat;
          $scope.setting_pos_for.longitude = lng;
          return $scope.setting_pos_for = null;
        });
      };
      return $scope.zoom_location = function(lat, lng) {
        $scope.map.center.latitude = lat;
        $scope.map.center.longitude = lng;
        return $scope.map.zoom = 15;
      };
    }
  ]);

  app.controller('MapCtrl', [
    "$q", "$scope", "$log", function($q, $scope, $log) {
      $scope.map.markers = [];
      $scope.map.polylines = [];
      $scope.map.zoom = 2;
      $scope.map.center = {
        latitude: 36,
        longitude: 0
      };
      $scope.map.fit = true;
      $scope.map.events = {
        click: function(mapModel, eventName, originalEventArgs) {
          var latLng;
          latLng = originalEventArgs[0].latLng;
          return $scope.clicked_pos(latLng.lat(), latLng.lng());
        }
      };
      $scope.$watch('points', function(newVal) {
        var point;
        if ($scope.map.markers.length > 0) {
          $scope.map.fit = false;
        }
        return $scope.map.markers = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = newVal.length; _i < _len; _i++) {
            point = newVal[_i];
            if (point.latitude != null) {
              _results.push({
                latitude: point.latitude,
                longitude: point.longitude,
                icon: point.icon
              });
            }
          }
          return _results;
        })();
      }, true);
      return $scope.$watch('routes', function(newVal) {
        var point, route;
        return $scope.map.polylines = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = newVal.length; _i < _len; _i++) {
            route = newVal[_i];
            _results.push({
              path: (function() {
                var _j, _len1, _ref, _results1;
                _ref = route.points;
                _results1 = [];
                for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                  point = _ref[_j];
                  if (point.latitude != null) {
                    _results1.push({
                      latitude: point.latitude,
                      longitude: point.longitude
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
          return _results;
        })();
      }, true);
    }
  ]);

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
      $scope.add_point = function() {
        $scope.points.push(Point.build($scope.new_point));
        return $scope.new_point = {
          type: $scope.new_point.type
        };
      };
      $scope.delete_point = function(point) {
        var idx;
        idx = $scope.points.indexOf(point);
        if (idx === -1) {
          return;
        }
        return $scope.points.splice(idx, 1);
      };
      return $scope.set_position = function(point) {
        return $scope.start_set_pos(point);
      };
    }
  ]);

  app.factory('Point', function() {
    var Airport, Camping, CarRental, Ferry, Hotel, MustSee, Place, Point, Restaurant, mapping, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
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
      __extends(Airport, _super);

      function Airport() {
        _ref = Airport.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Airport.prototype.icon = 'http://maps.google.com/mapfiles/ms/icons/plane.png';

      return Airport;

    })(Point);
    Place = (function(_super) {
      __extends(Place, _super);

      function Place() {
        _ref1 = Place.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Place.prototype.icon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

      return Place;

    })(Point);
    MustSee = (function(_super) {
      __extends(MustSee, _super);

      function MustSee() {
        _ref2 = MustSee.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      MustSee.prototype.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

      return MustSee;

    })(Place);
    Hotel = (function(_super) {
      __extends(Hotel, _super);

      function Hotel() {
        _ref3 = Hotel.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      Hotel.prototype.icon = 'http://maps.google.com/mapfiles/ms/micons/homegardenbusiness.png';

      return Hotel;

    })(Point);
    Restaurant = (function(_super) {
      __extends(Restaurant, _super);

      function Restaurant() {
        _ref4 = Restaurant.__super__.constructor.apply(this, arguments);
        return _ref4;
      }

      Restaurant.prototype.icon = 'http://maps.google.com/mapfiles/ms/micons/restaurant.png';

      return Restaurant;

    })(Point);
    CarRental = (function(_super) {
      __extends(CarRental, _super);

      function CarRental() {
        _ref5 = CarRental.__super__.constructor.apply(this, arguments);
        return _ref5;
      }

      CarRental.prototype.icon = 'http://maps.google.com/mapfiles/ms/micons/cabs.png';

      return CarRental;

    })(Point);
    Ferry = (function(_super) {
      __extends(Ferry, _super);

      function Ferry() {
        _ref6 = Ferry.__super__.constructor.apply(this, arguments);
        return _ref6;
      }

      Ferry.prototype.icon = 'http://maps.google.com/mapfiles/ms/micons/ferry.png';

      return Ferry;

    })(Point);
    Camping = (function(_super) {
      __extends(Camping, _super);

      function Camping() {
        _ref7 = Camping.__super__.constructor.apply(this, arguments);
        return _ref7;
      }

      Camping.prototype.icon = 'http://maps.google.com/mapfiles/ms/micons/campground.png';

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
    return {
      mapping: mapping,
      parse: function(json) {
        var o, objects, _i, _len, _results;
        objects = JSON.parse(json);
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

  app.factory('PointStorage', [
    "Point", function(Point) {
      return {
        save: function(points) {
          return localStorage.points = angular.toJson(points);
        },
        load: function() {
          if (localStorage.points == null) {
            return [];
          }
          return Point.parse(localStorage.points);
        }
      };
    }
  ]);

}).call(this);
