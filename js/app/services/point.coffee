app.factory 'Point', ->
  class Point
    constructor: (object) ->
      @[k] = v for k,v of object
      @

    @build: (object) ->
      klass = switch object.type
        when 'airport' then Airport
        when 'place' then Place
        when 'must_see' then MustSee
        when 'hotel' then Hotel
      new klass(object)

  class Airport extends Point
    caption: -> @airport
    icon: 'http://maps.google.com/mapfiles/ms/icons/plane.png'

  class Place extends Point
    caption: -> @title
    icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'

  class MustSee extends Place
    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'

  class Hotel extends Point
    caption: -> @name
    icon: 'http://maps.google.com/mapfiles/ms/micons/homegardenbusiness.png'

  parse: (json) ->
    objects = JSON.parse(json)
    @build(o) for o in objects

  build: (object) ->
    Point.build(object)
