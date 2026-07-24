# Hanzo forms ingest.
#
#   POST https://api.hanzo.ai/v1/forms
#
# Auth: Authorization: Bearer <token>, where <token> is an @hanzo/iam access
# token when present, otherwise a publishable key (pk_live_… / pk_test_…). The
# server stamps org/tenant from the validated credential; the client only ships
# the serialized submission.

DEFAULT_HOST = 'https://api.hanzo.ai'
FORMS_PATH   = '/v1/forms'

export host = DEFAULT_HOST
export path = FORMS_PATH

# POST a serialized submission. Returns a Promise that resolves on a 2xx
# response and rejects otherwise. `opts.token` (IAM access token) wins over
# `opts.key` (publishable key); `opts.endpoint` overrides host + path.
export default (data, opts = {}) ->
  base  = (opts.host ? DEFAULT_HOST).replace /\/+$/, ''
  url   = opts.endpoint ? base + FORMS_PATH
  token = opts.token ? opts.key
  body  = JSON.stringify data

  headers = 'Content-Type': 'application/json'
  headers.Authorization = "Bearer #{token}" if token

  if typeof fetch is 'function'
    return fetch url,
      method:      'POST'
      headers:     headers
      body:        body
      credentials: 'include'
    .then (res) ->
      throw new Error "form.js: submission failed (#{res.status})" unless res.ok
      res

  new Promise (resolve, reject) ->
    xhr = new XMLHttpRequest
    xhr.open 'POST', url, true
    xhr.withCredentials = true
    xhr.setRequestHeader k, v for k, v of headers
    xhr.onreadystatechange = ->
      return unless xhr.readyState is 4
      if 200 <= xhr.status < 300
        resolve xhr
      else
        reject new Error "form.js: submission failed (#{xhr.status})"
    xhr.send body
