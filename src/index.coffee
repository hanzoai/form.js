import Emitter from 'little-emitter'

events =
  InitScript:   'init-inform-script'
  InitForm:     'init-inform-form'
  InitInputs:   'init-inform-inputs'
  InitSubmits:  'init-inform-submits'
  OnSubmit:     'inform-submit'
  OnDone:       'inform-done'

do ->
  emitter = new Emitter
  emitter.Events = events

  # get this script tag
  getLastTag = (selector)->
    # find last script node
    tags = document.getElementsByTagName selector

    # last element is this tag
    tag = tags[tags.length - 1]
    return tag

  script  = getLastTag 'script'
  form    = getLastTag 'form'

  first = true

  init = ->
    if first
      first = false
    else
      return

    # you need to get the attributes off these things manually
    emitter.emit events.InitScript, script
    emitter.emit events.InitForm, form

    submits = []
    inputs  = []
    ins     = form.getElementsByTagName 'input'

    for input in ins
      if input.getAttribute('type') != 'submit'
        inputs.push input
      else
        submits.push input

    ins = form.getElementsByTagName 'select'
    for input in ins
      inputs.push input

    emitter.emit events.InitInputs, inputs

    buttons = form.getElementsByTagName 'button'
    for button in buttons
      type = button.getAttribute('type')
      if !type? || type == 'submit'
        submits.push(button)

    emitter.emit events.InitSubmits, submits

    # Called on successful submit
    ondone = (event)->
      emitter.emit events.OnDone, event

    # Called when trying to submit
    onsubmit = (event)->
      if event.defaultPrevented
        return
      else
        event.preventDefault()

      done = ()->
        form.addEventListener 'submit', ondone
        form.removeEventListener 'submit', onsubmit

        setTimeout ()->
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

# do ->
#   `var endpoint = "%s", ml = %s`

#   called    = false
#   errors    = null
#   forms     = null
#   handlers  = null
#   parent    = null
#   script    = null
#   selectors = {}
#   validate  = false

#   XHR = ->
#     xhr = null

#     if window.XMLHttpRequest
#       xhr = new XMLHttpRequest()

#     else if window.ActiveXObject
#       xhr = new ActiveXObject 'Microsoft.XMLHTTP'

#     setHeaders: (headers) ->
#       for k,v of headers
#         xhr.setRequestHeader k, v
#       return

#     post: (url, headers, payload, cb) ->
#       xhr.open 'POST', url, true
#       @setHeaders headers
#       xhr.send payload

#       xhr.onreadystatechange = ->
#         if xhr.readyState == 4
#           if xhr.status == 200 or xhr.status == 201
#             cb null, xhr.status, xhr
#           else
#             cb (new Error 'Subscription failed'), xhr.status, xhr
#         return
#       return

#   # get form container
#   getContainer = (script, selector = '')->
#     if selector != ''
#       document.querySelector selectors.container
#     else
#       parent = script.parentNode
#       inputs = parent.getElementsByTagName 'input'
#       if inputs.length < 1
#         document.body
#       else
#         parent

#   # get this script tag
#   getScript = ->
#     # find last script node
#     scripts = document.getElementsByTagName( 'script' )

#     # last element is this script tag
#     script = scripts[ scripts.length - 1 ]
#     script

#   # Get elements from inside a parent
#   getElements = (parent, selector) ->
#     console.log 'getElements', parent, selector

#     if selector? and selector != ''
#       parent.querySelectorAll selector
#     else
#       [parent]

#   # get value from a selector
#   getValue = (parent = document.body, selector) ->
#     el = parent.querySelector selector
#     el?.value?.trim()

#   # serialize a form
#   serializeForm = (el) ->
#     return {} unless el?

#     data =
#       metadata: {}

#     inputs = el.getElementsByTagName 'input'

#     # Loop over form elements
#     for input in inputs
#       # Clean up inputs
#       k = input.name.trim().toLowerCase()
#       v = input.value.trim()

#       # Skip inputs we don't care about
#       if k == '' or v == '' or (input.getAttribute 'type') == 'submit'
#         continue

#       # Detect emails
#       if /email/.test k
#         data.email = v
#       else
#         data.metadata[k] = v

#     # Use selectors if necessary
#     if selectors.email
#       data.email = getValue el, selectors.email
#     else
#       data.email ?= ''

#     for prop in ['firstname', 'lastname', 'name']
#       if (selector = selectors[prop])?
#         data.metadata[prop] = getValue el, selector

#     console.error 'Email is required' if data.email == ''

#     data

#   # get setting off script tag data attribute
#   attr = (name) ->
#     val = script.getAttribute 'data-' + name
#     return unless val?

#     switch val.trim().toLowerCase()
#       when 'false'
#         false
#       when 'true'
#         true
#       else
#         val

#   # Google event tracking code
#   google =
#     setup: ->
#       return if window.ga? or window._gaq?

#       ((i, s, o, g, r, a, m) ->
#         i['GoogleAnalyticsObject'] = r
#         i[r] = i[r] or ->
#           (i[r].q = i[r].q or []).push arguments
#           return

#         i[r].l = 1 * new Date()

#         a = s.createElement(o)
#         m = s.getElementsByTagName(o)[0]

#         a.async = 1
#         a.src = g
#         m.parentNode.insertBefore a, m
#         return
#       ) window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga'
#       return

#     track: (opts) ->
#       return unless opts.category?

#       google.setup()

#       category = opts.category ? 'Subscription'
#       action   = opts.action   ? opts.name ? 'Signup'
#       label    = opts.label    ? 'Lead'
#       value    = opts.value    ? 1

#       if window._gaq?
#         window._gaq.push ['_trackEvent', category, action, label, value]
#       if window.ga?
#         window.ga 'send', 'event', category, action, label, value
#       return

#   # Facebook event tracking
#   facebook =
#     setup: ->
#       return if window._fbq?.loaded

#       _fbq = window._fbq or (window._fbq = [])

#       fbds = document.createElement('script')
#       fbds.async = true
#       fbds.src = '//connect.facebook.net/en_US/fbds.js'
#       s = document.getElementsByTagName('script')[0]
#       s.parentNode.insertBefore fbds, s
#       _fbq.loaded = true
#       return

#     track: (opts) ->
#       return unless opts.id?

#       facebook.setup()

#       value    = opts.value    ? '1.00'
#       currency = opts.currency ? 'USD'

#       window._fbq.push ['track', opts.id,
#         value:    value,
#         currency: currency,
#       ]
#       return

#   # Trigger event tracking
#   track = ->
#     facebook.track ml.facebook
#     google.track ml.google
#     return

#   # Wire up submit handler
#   addHandler = (el, errorEl) ->
#     unless errorEl?
#       errorEl               = document.createElement 'div'
#       errorEl.className     = 'crowdstart-mailinglist-error'
#       errorEl.style.display = 'none'
#       errorEl.style.width   = 100 + '%%'[0]  # Prevents interpolation from picking up % as a thing needing interpolatin'
#       el.appendChild errorEl

#     showError = (msg) ->
#       errorEl.style.display   = 'inline'
#       errorEl.innerHTML = msg
#       false

#     hideError = ->
#       errorEl.style.display = 'none'

#     thankYou = ->
#       switch ml.thankyou.type
#         when 'redirect'
#           setTimeout ->
#             window.location = ml.thankyou.url
#           , 1000
#         when 'html'
#           el.innerHTML = ml.thankyou.html

#       if document.createEvent && document.dispatchEvent
#         event = document.createEvent 'Event'
#         event.initEvent 'thankyou', true, true
#         document.dispatchEvent event
#       else
#         console.log "Could not create or dispatch thankyou event"

#     submitHandler = (ev) ->
#       if ev.defaultPrevented
#         return
#       else
#         ev.preventDefault()

#       data = serializeForm el
#       console.log data

#       if ml.validate
#         unless data.email?
#           return showError 'Email is required'
#         if (data.email.indexOf '@') == -1
#           return showError 'Invalid email'
#         if data.email.length < 3
#           return showError 'Invalid email'
#         hideError()

#       payload = JSON.stringify data

#       headers =
#         'X-Requested-With': 'XMLHttpRequest',
#         'Content-type':     'application/json; charset=utf-8'

#       xhr = XHR()
#       xhr.post endpoint, headers, payload, (err, status, xhr) ->
#         return thankYou() if status == 409
#         return showError(err) if err?

#         # Fire tracking pixels
#         track()
#         thankYou()

#       false

#     (ev) ->
#       el.removeEventListener 'submit', addHandler
#       el.addEventListener    'submit', submitHandler

#       setTimeout ->
#         el.dispatchEvent new Event 'submit',
#           bubbles:    false
#           cancelable: true
#       , 500

#       ev.preventDefault()
#       false

#   # Init all the things
#   init = ->
#     if called then return else called = true

#     props = ['container', 'forms', 'submits', 'errors', 'email', 'firstname', 'lastname', 'name']
#     for prop in props
#       selectors[prop] = (attr prop) ? ml.selectors?[prop]

#     # default selector for submit button
#     selectors.submits ?= 'input[type="submit"]'

#     # are we validating?
#     ml.validate ?= (attr 'validate') ? false

#     parent   = getContainer script, selectors.container
#     forms    = getElements parent, selectors.forms
#     handlers = getElements parent, selectors.submits

#     # find error divs
#     if selectors.errors
#       errors = getElements parent, selectors.errors
#     else
#       errors = []

#     console.log 'selectors', selectors
#     console.log 'forms', forms
#     console.log 'handlers', handlers
#     console.log 'errors', errors

#     for handler, i in handlers
#       do (handler, i) ->
#         return if handler.getAttribute 'data-hijacked'

#         handler.setAttribute 'data-hijacked', true
#         handler.addEventListener 'click',  (addHandler forms[i], errors[i])
#         handler.addEventListener 'submit', (addHandler forms[i], errors[i])

#   # Get script tag, has to run before rest of DOM loads
#   script = getScript()

#   # Run init after DOM loads, attach various listeners
#   if document.addEventListener
#     document.addEventListener 'DOMContentLoaded', init, false
#   else if document.attachEvent
#     document.attachEvent 'onreadystatechange', ->
#       init() if document.readyState == 'complete'

#   if window.addEventListener
#     window.addEventListener 'load', init, false
#   else if window.attachEvent
#     window.attachEvent 'onload', init

#   return
