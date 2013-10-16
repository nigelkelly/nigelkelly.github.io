var db = new PouchDB('pouchchat');
var remoteCouch = 'http://nigekelly.iriscouch.com/pouchchat';
db.info(function(err, info) {
	db.changes({
    	since: info.update_seq,
    	continuous: true,
    	onChange: readMessages
  	});
});

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
		
      	ul.appendChild( "<li>" +message.name+ " says " +message.content + "</li>" );
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
readMessages();