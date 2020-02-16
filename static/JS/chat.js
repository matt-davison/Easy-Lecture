var socket;

socket = io();

socket.on('connect', function() {
	console.log('I connected');
});

socket.on('update', function(data) {
	console.log(data);
	$('#chat-div').append('<div class="row"><div class="col-12 username"><span>'+data.username+':</span></div><div class="col-12 message"><h5>'+data.msg+'</h5></div></div>')
})

function sendMessage() {
	var msg = $('#message').val();
	var username = $('#username').val();

	var data = {
		msg: msg,
		username: username
	}

	$('#message').val("");

	socket.emit('chat-msg', data);
}