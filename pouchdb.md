
1. Set up account at iriscouch.com

Enable CORS

$ export HOST=http://myname.iriscouch.com
$ curl -X PUT $HOST/_config/httpd/enable_cors -d '"true"'
$ curl -X PUT $HOST/_config/cors/origins -d '"*"'
$ curl -X PUT $HOST/_config/cors/credentials -d '"true"'
$ curl -X PUT $HOST/_config/cors/methods -d '"GET, PUT, POST, HEAD, DELETE"'
$ curl -X PUT $HOST/_config/cors/headers -d \
  '"accept, authorization, content-type, origin"'

2. <script src="http://download.pouchdb.com/pouchdb-nightly.js"></script>

3. <script src="javascripts/app.js"></script>

4. Add app.js code



