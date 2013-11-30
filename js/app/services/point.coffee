app.factory 'Point', ->

  class Point
    constructor: (object) ->
      @[k] = v for k,v of object
      @

    caption: -> @name
    @build: (object) ->
      klass = mapping[object.type].klass
      new klass(object)

  class Airport extends Point
    icon: 'http://maps.google.com/mapfiles/ms/icons/plane.png'

  class Place extends Point
    icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'

  class MustSee extends Place
    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'

  class Hotel extends Point
    icon: 'http://maps.google.com/mapfiles/ms/micons/homegardenbusiness.png'

  class Restaurant extends Point
    icon: 'http://maps.google.com/mapfiles/ms/micons/restaurant.png'

  class CarRental extends Point
    icon: 'http://maps.google.com/mapfiles/ms/micons/cabs.png'

  class Ferry extends Point
    icon: 'http://maps.google.com/mapfiles/ms/micons/ferry.png'

  class Camping extends Point
    icon: 'http://maps.google.com/mapfiles/ms/micons/campground.png'

  mapping =
    airport: {name: "Airport", klass: Airport}
    must_see: {name: "Must", klass: MustSee}
    place: {name: "Normal", klass: Place}
    hotel: {name: "Hotel", klass: Hotel}
    restaurant: {name: "Restaurant", klass: Restaurant}
    car_rental: {name: "Car rental", klass: CarRental}
    ferry: {name: "Ferry", klass: Ferry}
    camping: {name: "Camping", klass: Camping}


  mapping: mapping

  parse: (objects) ->
    @build(o) for o in objects

  build: (object) ->
    Point.build(object)
