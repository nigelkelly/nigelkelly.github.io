---
title: This will be used as the title-tag of the page head
---
<link href="http://kevinburke.bitbucket.org/markdowncss/markdown.css" rel="stylesheet"></link>	
### The Dark Side of Firbase Syncing

I have been messing around with Firebase now for a few months and I an very impressed with it. Its greatest single feature is that you can code completely in client side javascript. You do not need server side javascript. You do not need node, meteor or derby. You do not have to code in strange, alien javascript for the server which comes with a sense of dislocation. Firebase, for the most part, really is quite a painless experience to code in.

I say for the most part because there is a dark side. As I have said coding in it from a client side perspective is a pleasant experience. However I feel that its most marketed feature (real time syncing) can be an awkward and dislocating experience. Worse still there is a real risk that it can lose data. Syncing is a hard problem to solve and manage. I think Firebase gets us a good bit of the way there but it is not bullet proof.

Firebase provides a number of syncing patterns for developers to work with. You need to understand how each of these work, their strengths and weaknesses, before choosing the most appropriate sync pattern for your app. In this post, I will talk about the .on() sync event pattern and show you the results of testing it and how it can lose data.

### .on() event pattern

The .on() event pattern is probably the sync pattern that is most shown in the firebase docs and tutorials. Here is how the pattern shapes up in html and javascript.
	
	index.html

	<head>
	  <script type='text/javascript' src='https://cdn.firebase.com/v0/firebase.js'></script>
	  <script type='text/javascript' src="app.js" defer="defer"></script>
	</head>
	<body>
	  <button onclick="createItem()"></button>
	</body>
	
    app.js

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
		     		console.log("This callback guarantees data was really saved to   firebase");
				}
		});	
    };

If you set up your firebase account you can point this code to your firebase test sandbox and see how it works. It really is magic. I will try and break down the magic.

### How (I think) the .on() sync event works
* When your app initially starts a call is made to the remote firebase servers to retrieve data in json format
* .on() is a method that subscribes and listens for the initial payload of data. Once it arrives .on() fires up and you would typically have your own code in place to transfer the json into a local memory data structure and update the app view.
* The cool thing about .on() is that it is fired by all remote clients of the app who are listening for changes on the firebase servers. As soon one client changes their local data, that change can be broadcast to all other clients of your app and their models and views updated by their instances of .on(). Works great with data binding tools like knockout and angular. 
* The dark truth about .on() is that its behavior mutates after the initial payload arrives from the firebase servers. When the user starts using the app and changing the model locally .on() will fire locally first, regardless of whether or not those local changes make it back to the firebase servers.
* A lot of the time the changes make it back to the firebase servers and the changes you just made are then broadcast out to all the other clients in milleseconds, picked up by their .on() instances and their local views and models updated accordingly. This is the good parts of .on().
* Sometimes those changes make it to the firebase servers quite slowly. It could take 10 mins in my experience. What seems to happen is that the connection back to firebase is lost and once this happens it can take several minutes to re-establish. I can live with this. Not the end of the world, right? Only if a user does not refresh or navigate away from the page whilst a disconnection is in play.
* But sometimes the changes do not make it back to firebase at all, are lost locally and so are lost forever. If a user refreshes or navigates away whilst a disconnection is in motion then the data the user just changed won’t make it back to firebase. Furthermore once a user refreshes a page the local firebase gets wiped. The new locally created data is gone forever. You need to be aware of this risk when using the .on() pattern. 
* .on() is the best and easiest pattern to implement to get as close to real time syncing as you can in Firebase. For the most part, as one client creates a new item in a list all other clients will see that new item milliseconds later. It is nearly there but not quite. Certainly I don't think the .on() pattern could be used to sync important data.


