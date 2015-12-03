module.exports = class XHR
  constructor: ->
    xhr = null

    if window.XMLHttpRequest
      xhr = new XMLHttpRequest()

    else if window.ActiveXObject
      xhr = new ActiveXObject 'Microsoft.XMLHTTP'

  setHeaders: (headers) ->
    for k,v of headers
      @xhr.setRequestHeader k, v
    return

  post: (url, headers, payload, cb) ->
    @xhr.open 'POST', url, true
    @setHeaders headers
    @xhr.send payload

    @xhr.onreadystatechange = =>
      if @xhr.readyState == 4
        if @xhr.status == 200 or @xhr.status == 201
          cb null, @xhr.status, @xhr
        else
          cb (new Error 'Subscription failed'), @xhr.status, @xhr
      return
    return
