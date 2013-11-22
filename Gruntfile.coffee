rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest

environments =
  development:
    minimize: false

env = environments[process.env.NODE_ENV || 'development']
server_pausers = 0

pausing_server = (tasks...) ->
  ["pause_server"].concat(t for t in tasks when t?).concat('resume_server')


module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
    files:
      app_coffee:
        source: ["js/app.coffee", "js/app/**/*.coffee"]
        dest: 'compiled/scripts/app.js'
      vendor_app:
        source: [
          "js/vendor/underscore.js"
          "js/vendor/jquery.js"
          "js/vendor/angular.js"
          "js/vendor/angular-ui-router.js"
          "js/vendor/angular-google-maps.js"
        ]
        dest: "compiled/scripts/vendor.js"
      app_css:
        source: "stylesheets/style.scss"
        dest: "compiled/stylesheets/style.css"
      app_html:
        source: ["views/index.html", "views/partials/**/*.html"]
        dest: 'compiled/index.html'

    uglify:
      app:
        src: "<%= files.app_coffee.dest %>"
        dest: "<%= files.app_coffee.dest %>"
      vendor_app:
        src: "<%= files.vendor_app.dest %>"
        dest: "<%= files.vendor_app.dest %>"

    clean:
      all: src: [ "compiled" ]
      temp: src: [ "compiled/temp" ]
      assets: src: [ "compiled/img" ]

    concat:
      vendor_app:
        options: separator: ";"
        src: "<%= files.vendor_app.source %>"
        dest: "<%= files.vendor_app.dest %>"
      app:
        options:
          process: (src, filepath) ->
            return src if filepath == "views/index.html"
            name = filepath[15..-1]
            """<script type="text/ng-template" id="#{name}">\n#{src}\n</script>"""
        src: "<%= files.app_html.source %>"
        dest: "<%= files.app_html.dest %>"

    copy:
      img:
        expand: true
        cwd: "img/"
        src: "**/*"
        dest: "compiled/img/"

    sass:
      options:
        includePaths: ["stylesheets/partials"]
        outputStyle: 'compressed'
      app:
        files:
          "<%= files.app_css.dest %>": "<%= files.app_css.source %>"

    coffee:
      options: join: true
      app:
        files:
          '<%= files.app_coffee.dest %>': "<%= files.app_coffee.source %>"

    'gh-pages':
      options: base: 'compiled'
      src: ['**']

    watch:
      options: spawn: false
      app_js:
        files: "<%= files.app_coffee.source %>"
        tasks: pausing_server("compile:app:js")
      vendor_app:
        files: "<%= files.vendor_app.source %>"
        tasks: pausing_server("compile:app:vendor")
      app_css:
        files: ["<%= files.app_css.source %>", "stylesheets/partials/**/*"]
        tasks: pausing_server("compile:app:css")
      app_html:
        files: "<%= files.app_html.source %>"
        tasks: pausing_server("compile:app:html")
      app_assets:
        files: ["img/*"]
        tasks: pausing_server("compile:app:assets")

    connect:
      rules:
        '^(/img/.*)$': '$1'
        '^(/scripts/.*)$': '$1'
        '^(/stylesheets/.*)$': '$1'
        '^(.*)$': '/index.html'
      options:
        port: 9292
        base: 'compiled'
        middleware: (connect, options) ->
          [
            (req, res, next) ->
              wait = ->
                return if server_pausers == 0
                setTimeout wait, 20
              wait()
              next()
            rewriteRulesSnippet
            connect.static(require('path').resolve(options.base))
          ]
      dev:
        options:
          keepalive: false
      keepalive:
        options:
          keepalive: true


  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-connect-rewrite"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-gh-pages"
  grunt.loadNpmTasks "grunt-sass"
  grunt.loadNpmTasks "grunt-contrib-watch"


  tasks =
    pause_server: -> server_pausers += 1
    resume_server: -> server_pausers -= 1
    'compile:app:js': ["coffee:app", "clean:temp", "uglify:app" if env.minimize ]
    'compile:app:vendor': ["concat:vendor_app", "uglify:vendor_app" if env.minimize]
    'compile:app:css': ["sass:app", "clean:temp"]
    'compile:app:html': ["concat:app"]
    'compile:app:assets': ["clean:assets", "copy:img"]

  for task,subtasks of tasks
    grunt.registerTask task, (s for s in subtasks when s?)

  grunt.registerTask "compile:app", [
    "compile:app:assets"
    "compile:app:css"
    "compile:app:js"
    "compile:app:vendor"
    "compile:app:html"
  ]

  grunt.registerTask "build", ["clean:all", "compile:app"]
  grunt.registerTask "deploy", ["build", "gh-pages"]
  grunt.registerTask "default", ["build", "configureRewriteRules", "connect:dev", "watch"]
