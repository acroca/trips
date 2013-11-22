(function() {
  var app,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = angular.module('trips', ["ui.router", 'google-maps']);

  app.config([
    '$locationProvider', function($locationProvider) {
      return $locationProvider.html5Mode(true).hashPrefix('!');
    }
  ]);

  app.controller('AppCtrl', [
    "$scope", "PointStorage", function($scope, PointStorage) {
      $scope.points = PointStorage.load();
      $scope.$watch('points', function(newVal) {
        return PointStorage.save(newVal);
      }, true);
      $scope.start_set_pos = function(point) {
        return $scope.setting_pos_for = point;
      };
      return $scope.clicked_pos = function(lat, lng) {
        if ($scope.setting_pos_for == null) {
          return;
        }
        return $scope.$apply(function() {
          $scope.setting_pos_for.latitude = lat;
          $scope.setting_pos_for.longitude = lng;
          return $scope.setting_pos_for = null;
        });
      };
    }
  ]);

  app.controller('MapCtrl', [
    "$q", "$scope", "$state", "$log", function($q, $scope, $state, $log) {
      $scope.center = {
        latitude: 36,
        longitude: 0
      };
      $scope.zoom = 2;
      $scope.markers = [];
      $scope.fit = true;
      $scope.$watch('points', function(newVal) {
        var point;
        if ($scope.markers.length > 0) {
          $scope.fit = false;
        }
        return $scope.markers = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = newVal.length; _i < _len; _i++) {
            point = newVal[_i];
            if (point.latitude != null) {
              _results.push({
                infoWindow: point.caption(),
                latitude: point.latitude,
                longitude: point.longitude,
                icon: point.icon
              });
            }
          }
          return _results;
        })();
      }, true);
      return $scope.eventsProperty = {
        click: function(mapModel, eventName, originalEventArgs) {
          var latLng;
          latLng = originalEventArgs[0].latLng;
          return $scope.clicked_pos(latLng.lat(), latLng.lng());
        }
      };
    }
  ]);

  app.controller('PointsCtrl', [
    "$scope", "Point", function($scope, Point) {
      $scope.new_point = {
        type: 'place'
      };
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

  app.config([
    "$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/");
      return $stateProvider.state('app', {
        templateUrl: 'app.html',
        controller: "AppCtrl"
      }).state('app.main', {
        url: '/',
        views: {
          "main@app": {
            templateUrl: "map.html",
            controller: "MapCtrl"
          },
          "sidebar@app": {
            templateUrl: "points.html",
            controller: "PointsCtrl"
          }
        }
      });
    }
  ]);

  app.factory('Point', function() {
    var Airport, Hotel, MustSee, Place, Point, _ref, _ref1, _ref2, _ref3;
    Point = (function() {
      function Point(object) {
        var k, v;
        for (k in object) {
          v = object[k];
          this[k] = v;
        }
        this;
      }

      Point.build = function(object) {
        var klass;
        klass = (function() {
          switch (object.type) {
            case 'airport':
              return Airport;
            case 'place':
              return Place;
            case 'must_see':
              return MustSee;
            case 'hotel':
              return Hotel;
          }
        })();
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

      Airport.prototype.caption = function() {
        return this.airport;
      };

      Airport.prototype.icon = 'http://maps.google.com/mapfiles/ms/icons/plane.png';

      return Airport;

    })(Point);
    Place = (function(_super) {
      __extends(Place, _super);

      function Place() {
        _ref1 = Place.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      Place.prototype.caption = function() {
        return this.title;
      };

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

      Hotel.prototype.caption = function() {
        return this.name;
      };

      Hotel.prototype.icon = 'http://maps.google.com/mapfiles/ms/micons/homegardenbusiness.png';

      return Hotel;

    })(Point);
    return {
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
