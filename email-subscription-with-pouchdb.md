---
title: PouchDB for Idiots Like Me
layout: post
---
                                                                                                
[Home](http://nigelkelly.github.io)

*4 Oct 2013*
## PouchDB for Idiots Like Me

### The objective

I wanted to create a very simple email subscription box for my blog using [PouchDB](http://pouchdb.com/).
The result is at the top of the page.

### How to do it

**Sign up for a free account on [iriscouch](http://www.iriscouch.com/)**

Pouchdb is a client database. We need a central couchdb database for pouchdb to talk to. We will use [iriscouch](http://www.iriscouch.com/)

![alt text](images/sub-pouchdb/iriscouch.png "Iriscouch signup")

**Create a new databases to store your subscribers**

![alt text](images/sub-pouchdb/create-couch.png "Iriscouch create db")

**Enable CORS so that web apps can CRUD your iriscouch databases. From your terminal command line:**

It is important that you specify a origin. My origin is [http://nigelkelly.github.io](http://nigelkelly.github.io) .
If you leave it as a wildcard "*" or "localhost" then anyone could CRUD your database on IrisCouch. 

```
$ export HOST=http://myname.iriscouch.com
$ curl -X PUT $HOST/_config/httpd/enable_cors -d '"true"'
$ curl -X PUT $HOST/_config/cors/origins -d '"http://mysite.com"'
$ curl -X PUT $HOST/_config/cors/credentials -d '"true"'
$ curl -X PUT $HOST/_config/cors/methods -d '"GET, PUT, POST, HEAD"'
$ curl -X PUT $HOST/_config/cors/headers -d \
  '"accept, authorization, content-type, origin"'
```

**Verify CORS is enabled. You should see something like below in Tools->Configuration**

![alt text](images/sub-pouchdb/couch-config.png "Iriscouch config")

NB export *HOST=http://myname.iriscouch.com* works if you signed up with Persona. Otherwise try:

```
$ export HOST=http://username:password@myname.iriscouch.com
```

More info in this [pouchdb tutorial](http://pouchdb.com/getting-started.html)

**In the head of your html files for home and post pages include the following:**
	
```html
<head>
	...
	<script src="http://download.pouchdb.com/pouchdb-nightly.js"></script>
	<script src="javascripts/app.js" defer="defer"></script>
	...
</head>
```

**In the body of your html files for home and post pages include the following:**
		
```html
<body>
	<p>
		<input id="new-sub-email" type="text" placeholder="Enter email here">
		<a id="new-sub-button">Subscribe to this blog</a>
	</p>
	...
</body>

```

**In javascripts/app.js include the following:**

```javascript
var db = new PouchDB('subscribers');

// REMEMBER TO UPDATE FOLLOWING WITH YOUR IRISCOUCH USER NAME
var remoteCouch = 'http://yourname.iriscouch.com/subscribers';

var newSubscriberEmail = document.getElementById('new-sub-email');
var newSubscriberButton = document.getElementById('new-sub-button');

function addSubscriber() {

	var subscriber = {
    	_id: new Date().toISOString(), //required
    	email: newSubscriberEmail.value	  	
	};
  	
	db.put(subscriber, function callback(err, result) {
    
		if (!err) {
      		console.log('Successfully added subscriber '+subscriber.email);
			newSubscriberEmail.value = "";
			
    	}
  });

}

function sync() {
	var opts = {continuous: true, complete: syncError};
	db.replicate.to(remoteCouch, opts);
	db.replicate.from(remoteCouch, opts);
}

function syncError() {
  	console.log('data-sync-error');
}	

if (remoteCouch) {
    sync();
}

newSubscriberButton.addEventListener("click", addSubscriber);


```

**The End**

###**Comment on [Reddit](http://www.reddit.com/r/javascript/) or [Hacker News](https://news.ycombinator.com/newest/)**