---
title: testing my post
layout: default
---

### The Dark Side of Firebase Syncing: Test Procedure and Results Included

I’ve been messing around with Firebase now for a few months and I an very impressed with it. Its greatest single feature is that you can code completely in “client side” javascript. You don’t need server side javascript. You don’t need node, meteor or derby. You don’t have to code in strange, alien javascript for the server which comes with a sense of dislocation. Firebase, for the most part, really is quite a painless experience to code in.

I say “for the most part” because there is a dark side. As I’ve said coding in it from a client side perspective is a pleasant experience. However I feel that its most marketed feature – real time syncing – can be an awkward and dislocating experience. Worse still there is a real risk that it can lose data. Syncing is a hard problem to solve and manage. I think Firebase gets us a good bit of the way there but it’s not bullet proof.

Firebase provides a number of syncing patterns for developers to work with. You need to understand how each of these work, their strengths and weaknesses, before choosing the most appropriate sync pattern for your app. In this post, I will talk about the .on() sync event pattern and show you the results of testing it and how it can lose data.

### .on() event pattern

The .on() event pattern is probably the sync pattern that is most shown in the firebase docs and tutorials. Here's how the pattern shapes up in html and javascript.

index.html
``` html
<head>
  <script type='text/javascript' src='https://cdn.firebase.com/v0/firebase.js'></script>
  <script type='text/javascript' src="app.js" defer="defer"></script>
</head>
<body>
  <button onclick="createItem()"></button>
</body>
```
app.js
``` javascript
var listAddress = "https://yourtestbox.firebaseio.com/list";
var firebaseListRef = new Firebase(listAddress);
var data = 0;

var onChildAdded = function(snapshot) {
  var index = snapshot.name();
  data = snapshot.val().value;
  console.log("remote length is "+snapshot.val().value);
}

// This gets fired each time a child is added to the firebaseListRef
// from anyone anywhere in the world! Magic!!!
firebaseListRef.on('child_added', onChildAdded);


var createItem = function() {
  var newItemForFirebaseListRef = firebaseListRef.push();
  var incrementedData = ++data;

  // This is how we upload data from here to firebaseListRef
  newItemForFirebaseListRef.set({"value":incrementedData}, function(error){
			if (error) {
				console.log("Data was not save to firebase");
			} else {
				console.log("This callback guarantees data was really saved to firebase");
			}
		});	
};
```


If you set up your firebase account you can point this code to your firebase test sandbox and see how it works. It really is magic. Let's try and break down the magic.
