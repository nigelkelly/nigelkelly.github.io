var db = new PouchDB('pouchchat');
var remoteCouch = 'http://nigekelly.iriscouch.com/pouchchat';

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

addMessageButton.addEventListener("click", addMessage);