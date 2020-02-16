var socket;

socket = io();

socket.on('connect', function() {
	console.log('I connected');
});

socket.on('update', function(data) {
	console.log(data);
	var htmlResult = '<div class="row text-light message"><div class="col-4 bg-secondary ">'
	htmlResult += '<h5><i>(' + data.user_type + ') ' + data.username.split('@')[0] + ':</i></h5></div>'
	htmlResult += '<div class="col-8 bg-light text-dark text-right">'
	htmlResult += '<span>' + data.msg + '</span></div></div>'

	$('#chat-div').html(htmlResult)
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