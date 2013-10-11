	
	var newSubscriberEmail = document.getElementById('new-sub-email');
	var newSubscriberThanks = document.getElementById('new-sub-thanks');
	var newSubscriberButton = document.getElementById('new-sub-button');
	
	var db = new PouchDB('subscribers');
 	var remoteCouch = 'http://nigekelly.iriscouch.com/subscribers';
  	 	
	function addSubscriber(text) {
    
		var subscriber = {
	    	_id: new Date().toISOString(), //required
	    	email: newSubscriberEmail.value	  	
		};
	  	
		db.put(subscriber, function callback(err, result) {
	    
			if (!err) {
	      		console.log('Successfully added subscriber '+subscriber.email);
				newSubscriberEmail.value = "";
				newSubscriberThanks.value = "Thanks for subscribing"
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
	
	setTimeout(function() {
		addSubscriber();
	}, 1000);
	
	newSubscriberButton.addEventListener("click", addSubscriber)