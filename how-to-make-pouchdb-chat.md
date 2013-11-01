---
title: PouchDB Chat - How to make it!
layout: post
---
                                                                                                
[Home](http://nigelkelly.github.io)

*1 Nov 2013*
## PouchDB Chat - How to make it!   

### The objective

I wanted to create a very simple real time chat service using [PouchDB](http://pouchdb.com/).
The result is [PouchDB Chat](http://nigelkelly.github.io/pouchdb-chat) 

### How to do it

**Sign up for a free account on [iriscouch](http://www.iriscouch.com/)**

Pouchdb is a client database. We need a central *couchdb* database for pouchdb to talk to. We will use [iriscouch](http://www.iriscouch.com/)

![alt text](images/sub-pouchdb/iriscouch.png "Iriscouch signup")

**Create a new databases to store your chat messages**

Call your new database something like chat or messages or pouchchat or whatever.
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
	<script src="http://download.pouchdb.com/pouchdb-nightly.js"></script>
	<script src="javascripts/app.js" defer="defer"></script>  
	<link href="stylesheets/sync.css" rel="stylesheet">
	<link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet">
</head>
```

**In the body of your html files for home and post pages include the following:**
		
```html
<body>
	<h3>PouchDB Chat</h3>
		<div class="well">
			<input id="chat-name" type="text" placeholder="Enter name">
			<input id="chat-message" type="text" placeholder="Enter message">
			<button id="new-message-button" class="btn btn-primary">Chat</button>  
			<p></p>
			<div id="sync-wrapper">
	          <div id="sync-success" class="alert alert-success">Status: sync working. Be patient.</div>
	          <div id="sync-error" class="alert alert-danger">Status: sync failed. Try refreshing the page.</div>
	        </div>
			<p></p>
			<ul id="chat-messages" class="list-group">			
			</ul>	
		</div>
</body>

```

**In javascripts/app.js include the following:**

```javascript          

var db = new PouchDB('pouchchat');

//IMPORTANT: CONFIGURE remoteCouch with your own details
var remoteCouch = 'http://myname.iriscouch.com/mydb';

db.info(function(err, info) {
	db.changes({
    	since: info.update_seq,
    	continuous: true,
    	onChange: readMessages
  	});
});


var syncDom = document.getElementById('sync-wrapper');
var newChatName = document.getElementById('chat-name');
var newChatMessage = document.getElementById('chat-message');
var addMessageButton = document.getElementById('new-message-button'); 

function addMessage() {

	var message = {
	   	_id: new Date().toISOString(), //required
	   	name: newChatName.value,
	  	content: newChatMessage.value
	};
 	
	db.put(message, function callback(err, result) {
   
		if (!err) {
	     	console.log('Successfully added message '+message.content);
			newChatMessage.value = "";
	   	}
  	});

}

function readMessages() {
  db.allDocs({include_docs: true, descending: true}, function(err, doc) {
    redrawUI(doc.rows);
  });
}

function redrawUI(messages) {
    var ul = document.getElementById('chat-messages');
    ul.innerHTML = '';
    messages.forEach(function(message) {
		var li=document.createElement("li");
		var pName = document.createElement("p");
		var pMessage = document.createElement("p");
		
		pName.textContent = message.doc.name;
		pMessage.textContent = message.doc.content;
		pName.className = "text-danger";
		
		li.appendChild(pName);
		li.appendChild(pMessage);
		li.className = "list-group-item";
      	ul.appendChild(li);
    });
  }

function sync() {
	syncDom.setAttribute('data-sync-state', 'syncing');
	var opts = {continuous: true, complete: syncError};
	db.replicate.to(remoteCouch, opts);
	db.replicate.from(remoteCouch, opts);
}

function syncError() {
  	console.log('data-sync-error');
	syncDom.setAttribute('data-sync-state', 'error');
}	

if (remoteCouch) {
    sync();
}

addMessageButton.addEventListener("click", addMessage);
readMessages();


```

**In stylesheets/sync.css add the following code:**

```css

#sync-error, #sync-success {
  display: none;
}

[data-sync-state=syncing] #sync-success {
  display: block;
}

[data-sync-state=error] #sync-error {
  display: block;
}

```


**The End**

###**Comment on [Reddit](http://www.reddit.com/r/javascript/) or [Hacker News](https://news.ycombinator.com/newest/)**