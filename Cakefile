require 'shortcake'

use 'cake-version'
use 'cake-bundle'
use 'cake-outdated'
use 'cake-publish'

option '-b', '--browser [browserName]', 'browser to test with'
option '-g', '--grep [filter]', 'test filter'

task 'clean', 'clean project', (options) ->
  exec 'rm -rf lib'
  exec 'rm -rf .test'

task 'build', 'build project', (options) ->
  bundle.write
    entry: 'src/index.coffee'

task 'static-server', 'Run static server for tests', ->
  connect = require 'connect'
  server = connect()
  server.use (require 'serve-static') './test'
  server.listen process.env.PORT ? 3333

task 'selenium-install', 'Install selenium standalone', ->
  exec 'node_modules/.bin/selenium-standalone install'

task 'test', 'Run tests', (options) ->
  browserName = options.browser ? 'phantomjs'

  invoke 'static-server'

  selenium = require 'selenium-standalone'
  selenium.start (err, child) ->
    throw err if err?

    exec "NODE_ENV=test
          BROWSER=#{browserName}
          node_modules/.bin/mocha
          --compilers coffee:coffee-script/register
          --reporter spec
          --colors
          --timeout 60000
          test/test.coffee", (err) ->
      child.kill()
      process.exit 1 if err?
      process.exit 0

task 'test-ci', 'Run tests on CI server', ->
  invoke 'static-server'

  browsers = require './test/ci-config'

  tests = for {browserName, platform, version, deviceName, deviceOrientation} in browsers
    console.log("Attempting With", browserName, platform, version, deviceName, deviceOrientation)
    "NODE_ENV=test
     BROWSER=\"#{browserName.replace(/ /g, '_')}\"
     PLATFORM=\"#{platform.replace(/ /g, '_')}\"
     VERSION=\"#{version.replace(/ /g, '_')}\"
     DEVICE_NAME=\"#{if deviceName then deviceName.replace(/ /g, '_') else ''}\"
     DEVICE_ORIENTATION=\"#{if deviceName then deviceOrientation.replace(/ /g, '_') else ''}\"
     node_modules/.bin/mocha
     --compilers coffee:coffee-script/register
     --reporter spec
     --colors
     --timeout 60000
     test/test.coffee"

  exec tests, (err) ->
    process.exit 1 if err?
    process.exit 0
