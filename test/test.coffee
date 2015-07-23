assert = require 'assert'
should = require('chai').should()

{getBrowser} = require './util'

describe "Inform (#{process.env.BROWSER})", ->
  browser = getBrowser()
  testPage = "http://localhost:#{process.env.PORT ? 3333}/test.html"

  it 'should detect the correct script/form', (done)->
    browser
      .url testPage
      .waitForExist "#lastthing"
      .getText '#script', (err, res) ->
        res.should.equal 'inform'
      .getText '#form', (err, res) ->
        res.should.equal 'test'
      .getText '#inputs', (err, res) ->
        res.should.equal 'email: testuser@email.com, name: Test User, misc: Something'
      .getText '#submits', (err, res) ->
        res.should.equal 's, as, aas'
      .call done

  #dispatchEvent doesn't seem to work
  if process.env.BROWSER != 'phantomjs' || true
    it 'should submit and done for submit input', (done)->
      browser
        .url testPage
        .waitForExist "#lastthing"
        .click '#s'
        .waitForExist "#goahead", 2000
        .getText '#submited', (err, res) ->
          res.should.equal 'true'
        .getText '#doned', (err, res) ->
          res.should.equal 'true'
        .call done

    it 'should submit and done for untyped button', (done)->
      browser
        .url testPage
        .waitForExist "#lastthing"
        .click '#as'
        .waitForExist "#goahead", 2000
        .getText '#submited', (err, res) ->
          res.should.equal 'true'
        .getText '#doned', (err, res) ->
          res.should.equal 'true'
        .call done

    it 'should submit and done for submit button', (done)->
      browser
        .url testPage
        .waitForExist "#lastthing"
        .click '#aas'
        .waitForExist "#goahead", 2000
        .getText '#submited', (err, res) ->
          res.should.equal 'true'
        .getText '#doned', (err, res) ->
          res.should.equal 'true'
        .call done

    it 'should not submit or done for other button', (done)->
      browser
        .url testPage
        .waitForExist "#lastthing"
        .click '#r'
        .waitForExist "#goahead", 2000
        .getText '#submited', (err, res) ->
          res.should.equal 'false'
        .getText '#doned', (err, res) ->
          res.should.equal 'false'
        .call done
