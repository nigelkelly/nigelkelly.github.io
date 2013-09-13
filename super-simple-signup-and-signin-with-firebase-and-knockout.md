---
title: Super Simple Signup and Login with Firebase (no backend required)
layout: post
tags: firebase, knockoutjs, knockout, ko, javascript, syncing, nobackend
excerpt: In this tutorial you will learn how to set up an effective registration and authentication process for your web app using just Firebase, Knockout and Twitter Bootstrap. This is a nobackend app.
---
                                                                                                
[Home](http://nigelkelly.github.io)

*19 Sept 2013*
## Firebase signup and login tutorial

In this tutorial you will learn how to set up an effective registration and authentication process for your web app using Firebase, Knockout and Twitter Bootstrap.... and..... that's it. No backend mysql database, apache web server, ubuntu linux or ruby scripting is required. You just need to know javascript. 
You don't even need to know node. We will be using normal javascript. No npm or requirejs is required;) It is a nobackend app.	

### Setting up index.html

We will get the javascript libraries we need using script tags. I cannot stand requirejs. It is too complex for my needs. If I ever work on a big app then I will look into using it but I cannot see the need for it in hobby apps.

So here are the scripts we need:
* Knockout - so I can bind my application memory to my html view in an organised and simple way
* Firebase - so I can access a database in the cloud that talks easily with my javascript
* FirebaseAuth - so I can setup user signup and login really easily
* My own view models - the ko wiring from js to the html views

And then throw in bootstrap so it will look presentable.

Here is how it looks.

### The View

Knockout uses a MVVM (Model-View-ViewModel) pattern. We are starting with the view which is the body of the index.html file. This is quite straight forward. 
Twitter Bootstrap is called in through the class attribute of our input and div tags to make our page look nice. Knockout is called in through the data-bind attribute of our input tags and buttons. When the user keys in her user name and password, we want this data to go into application memory (the Model of MVC) and then on to the Firebase servers. Our View gives is the basic entry points that are required.

### The Model

The Model is the data structure that we will hold in app memory so that the user can talk to firebase via the medium of our app views. The model for a new user that wishes to signup for our app is pretty simple. 

See it here.

### The ViewModel

The ViewModel is the magic wiring between the View and application memory. We need to wire 3 things to start with:
* The user name
* The user password
* The sign up button that will submit this data to firebase

As you can see our initial code very simple. We make the userName and userPassword variables special knockout observable type objects. This means the data for these variables in the view and in application memory is in sync. The developer does not need to worry about transferring data in the view to memory and vice versa. Here is index.html (the View) and SignViewModel.js (the ViewModel) side by side wired together with knockout.



One more thing Knockout will only do this wiring for us once we tell it to bind observable variables in memory to the view using:

	ko.applyBindings(new SignUpViewModel(), document.getElementById("welcome") );
	
	
### Firebase Signup Authentication

To use firebase you will need to setup an account and create a new firebase. Or you can use the one here.

Authentication has to be configured. Click on the Auth icon in the Firebase side bar and then select Email & Password Authentication
providers. Finally click enabled.

In our code we need a reference to the root of our firebase which takes the form:

	var firebaseRoot = new Firebase("https://your-app.firebaseio.com");

Signup and Login authentication actions require a reference to the FirebaseSimpleLogin object which is specifically for email and password
authentication to firebase.

	var authClient = new FirebaseSimpleLogin(firebaseRoot, function(error, user) {
	 	// do login authentication checks
	});

We will add the login checks later but for now we are only doing sign up. Here it goes.

	authClient.createUser(self.userName(), self.userPassword(), function(error, user) {
	 	// do signup authentication checks here
		if (!error) {
			// User not signed up so .... sign her up
			console.log( "Signed up "+self.userName() );
	    	console.log('Firebase User Id: ' + user.id + ', and Email: ' + user.email);
			alert("You have been successfull signed up. Please login. Thank you.");
	  	} else {
			// User already signed up
			alert( error.message +" Please login. Thank you.");
		}
	});

You can now test this and you should see that new users are added easily. If you try to sign up an existing user then you will be politely told to login.

### Working with multiple ViewModels in Knockout

We only have developed the signup View and ViewModel so far. Now add the following code to your View in index.hmtl

	<div id="login" class="well">
		<div  class="span">
		  	<h1>Simple Signup and Login with Firebase<</h1>
		    <p>We will also be using knockout and bootstrap</p>
		    <p>
		    	<input type="text" class="input" placeholder="Email" data-bind="value: userName">
		  			<input type="password" class="input" placeholder="Password" data-bind="value: userPassword">
		    </p>
		    <p>	
			    <a class="btn btn-primary btn-large" data-bind="click:login">
					Log In
			    </a>
			</p>
		</div>
	</div>
	
	
This is very similar to the signup View. If you refresh you will now see two sections. One for signup and one for login. But we would rather have a new login page and make the signup page disappear. To do this we need to put in place a mechanism that will allow us to talk to both views at the same time so we can tell one to disappear and the other to display as required. We will create a new file called ViewModels.js

	var ViewModels = {
	    signupVM : new SignUpViewModel(true),
	    loginVM : new LoginViewModel(false)

	}

	ko.applyBindings(ViewModels);
	
Remember to add this file to the head your index.html It will be the last file as SignUpViewModel.js and LoginViewModel.js must be available. ko.applyBindings is called on both view models on initialization so that all our wiring is in place. We need to edit index.html as follows:

	<body>

		<div id="signup" class="well" data-bind="visible: signupVM.isVisible">
			<div  class="span">
			    <h1>Simple Signup and Login with Firebase</h1>
			    <p>We will also be using knockout and bootstrap</p>
			    <p>
			    	<input type="text" class="input" placeholder="email" data-bind="value: signupVM.userName">
			  		<input type="password" class="input" placeholder="Password" data-bind="value: signupVM.userPassword">
			    </p>
			    <p>	
				    <a class="btn btn-primary btn-large" data-bind="click:signupVM.signup">
						Sign Up
				    </a>
				</p>
				<p>
				or if you've registered just ...
				</p>
				<p>
				    <a class="btn btn-default btn-small" data-bind="click: loginVM.makeVisible">
						Log In
				    </a>
			    </p>
		    </div>
		</div>

		<div id="login" class="well" data-bind="visible: loginVM.isVisible">
			<div class="span">
			  	<h1>Simple Signup and Login with Firebase<</h1>
			    <p>We will also be using knockout and bootstrap</p>
			    <p>
			    	<input type="text" class="input" placeholder="Email" data-bind="value: loginVM.userName">
			  			<input type="password" class="input" placeholder="Password" data-bind="value: loginVM.userPassword">
			    </p>
			    <p>	
				    <a class="btn btn-primary btn-large" data-bind="click:loginVM.login">
						Log In
				    </a>
				</p>
			</div>
		</div>


	</body>
	
The main thing to note is how we make explicit references to each ViemModel in the html. For example, on clicking the signup button we explicitly call signupVM.signup instead of just signup. We need to specify the ViewModel so we can access its particular functions and properties. The important thing is that we can now make a call to the login ViewModel from the signup View. The function loginVM.makeVisible is called when we click the login button in the sigup view. Let us now look at the code in login.makeVisible

	self.makeVisible = function() {
		self.isVisible(true);
		ViewModels.signupVM.isVisible(false);
	}
	
The function is telling the LoginViewModel to make itself visible and the SignupViewModel to disappear. The only problem is that when we try to login our authentication is broken.

### Creating an Authentication Module

Let us add an authClient object to handle login authentication and add some login handling.

	var LoginViewModel = function(makeLoginViewVisible) {

		var firebaseRoot = new Firebase("https://flat-tasks.firebaseio.com"); 

		var authClient = new FirebaseSimpleLogin(firebaseRoot, function(error, user) {
		 	// Login auth handling callback
			if (error) {
		    	// an error occurred while attempting login
		    	console.log(error);
				alert("User name or password is not correct. Please try again.");
		  	} else if (user) {
		    	// user authenticated with Firebase
		    	console.log('Logging In User ID: ' + user.id + ', Provider: ' + user.email);  
		    	alert("Create a new AppViewModel for your app")
		  	} else {
		    	// user is logged out
				console.log("User logged out");
		  	}
		});

		.
		.
		.
		
	}


Now we you go to login you will get an alert box saying *Create a new AppViewModel for your app*. Well now it is time for you to create a new killer app or maybe a hosted task list for you and your team. The next step is to go to ViewModels.js and add in AppViewModel.js

	var ViewModels = {
	    signupVM : new SignUpViewModel(true),
	    loginVM : new LoginViewModel(false),
		appVM: new AppViewModel(false)
    
	}
	
	ko.applyBindings(ViewModels);


Now get hacking on AppViewModel.js

The World is your oyster.

###**Comment on [Reddit](http://www.reddit.com/r/javascript/comments/1lsb5q/the_dark_side_of_firebase_syncing_test_procedure/) or [Hacker News](https://news.ycombinator.com/item?id=6334385)**