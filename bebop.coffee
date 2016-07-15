fs   = require 'fs'
path = require 'path'
exec = require 'executive'

requisite = 'node_modules/.bin/requisite -g'

compile = ->
  exec.parallel [
    'node_modules/.bin/coffee -bcm -o lib/ src/'
    'node_modules/.bin/requisite src/index.coffee -m -o inform.min.js'
  ]
  exec.interactive '''
    node_modules/.bin/requisite src/index.coffee -o inform.js
    cp inform.js test/inform.js
    '''

module.exports =
  compile: compile

  port: 4242

  cwd: process.cwd()

  exclude: [
    /css/
    /lib/
    /node_modules/
    /vendor/
  ]

  compilers:
    coffee: (src) ->
      if /^src/.test src
        compile()

      if /src\/index.coffee/.test src
        compile()
