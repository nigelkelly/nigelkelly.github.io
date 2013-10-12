	
	var db = new PouchDB('subscribers');
 	var remoteCouch = 'http://nigekelly.iriscouch.com/subscribers';
  	
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