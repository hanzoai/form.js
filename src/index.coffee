import Emitter from 'little-emitter'
import submit  from './submit'

events =
  InitScript:   'init-inform-script'
  InitForm:     'init-inform-form'
  InitInputs:   'init-inform-inputs'
  InitSubmits:  'init-inform-submits'
  OnSubmit:     'inform-submit'
  OnDone:       'inform-done'
  OnError:      'inform-error'

do ->
  emitter = new Emitter
  emitter.Events = events
  emitter.events = events

  # last tag of a kind — the running <script> and the <form> that wraps it
  getLastTag = (selector) ->
    tags = document.getElementsByTagName selector
    tags[tags.length - 1]

  # read a data-* attribute off an element, coercing true/false
  attr = (el, name) ->
    val = el?.getAttribute?('data-' + name)
    return unless val?
    val = val.trim()
    switch val.toLowerCase()
      when 'false' then false
      when 'true'  then true
      else val

  # {email, metadata} from a set of inputs — email detected by field name
  serialize = (inputs) ->
    data = email: '', metadata: {}
    for input in inputs
      name  = (input.getAttribute('name') ? input.id ? '').trim().toLowerCase()
      value = (input.value ? '').trim()
      continue if name is '' or value is ''
      if /email/.test name
        data.email = value
      else
        data.metadata[name] = value
    data

  script = getLastTag 'script'
  form   = getLastTag 'form'

  first = true

  init = ->
    return unless first
    first = false

    # you need to get the attributes off these things manually
    emitter.emit events.InitScript, script
    emitter.emit events.InitForm, form

    # submission target: publishable key (pk_…) or @hanzo/iam token, plus
    # optional endpoint/host overrides — all off the script tag
    config =
      key:      attr(script, 'key') ? attr(script, 'token')
      endpoint: attr script, 'endpoint'
      host:     attr script, 'host'

    submits = []
    inputs  = []

    for input in form.getElementsByTagName 'input'
      if input.getAttribute('type') != 'submit'
        inputs.push input
      else
        submits.push input

    for input in form.getElementsByTagName 'select'
      inputs.push input

    emitter.emit events.InitInputs, inputs

    for button in form.getElementsByTagName 'button'
      type = button.getAttribute 'type'
      if !type? or type == 'submit'
        submits.push button

    emitter.emit events.InitSubmits, submits

    # managed: form.js POSTs to the Hanzo forms ingest. Unmanaged (no key or
    # endpoint configured): defer to the host, which calls done() to proceed.
    managed = config.key? or config.endpoint?

    # Called on successful submit
    ondone = (event) ->
      emitter.emit events.OnDone, event

    # Called when trying to submit
    onsubmit = (event) ->
      return if event.defaultPrevented
      event.preventDefault()

      if managed
        payload = serialize inputs
        emitter.emit events.OnSubmit, payload, event
        submit payload, config
          .then (res) -> emitter.emit events.OnDone, res
          .catch (err) -> emitter.emit events.OnError, err
        return

      done = ->
        form.addEventListener 'submit', ondone
        form.removeEventListener 'submit', onsubmit

        setTimeout ->
          form.dispatchEvent new Event 'submit',
            bubbles:    false
            cancelable: true
        , 500

      # Call done to manually fire
      emitter.emit events.OnSubmit, done, event

    form.addEventListener 'submit', onsubmit

  # Run init after DOM loads, attach various listeners
  if document.addEventListener
    document.addEventListener 'DOMContentLoaded', init, false
  else if document.attachEvent
    document.attachEvent 'onreadystatechange', ->
      init() if document.readyState == 'complete'

  if window?
    window.Inform = emitter
    window.Inform.events = events

    if window.addEventListener
      window.addEventListener 'load', init, false
    else if window.attachEvent
      window.attachEvent 'onload', init

  return emitter
