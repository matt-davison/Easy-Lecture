$(document).ready(function () {

	var htmlResult = ''


	htmlResult += '<video id="lecture" currenttime="600" class="shadow" width="853" height="480" preload autoplay controls>"' 
	htmlResult += '<source src="'+jsonData.videoURL+'" type="video/mp4"/>'
	htmlResult += '</video>'
	
	$('#video-container').html(htmlResult)	

})

function search_keyword() {

}

