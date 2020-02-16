$(document).ready(function () {

	var htmlResult = ''

	htmlResult += '<video id="lecture" currenttime="600" class="shadow" width="711" height="400" preload autoplay controls>"' 
	htmlResult += '<source src="'+jsonData.videoURL+'" type="video/mp4"/>'
	htmlResult += '</video>'
	
	$('#video-container').html(htmlResult)	

	console.log(jsonData)

})

var likenessThreshold = 2;

function search_keyword() {

	var searching = $('#keyword').val()
	var string_arr = searching.trim().split();

	

	var result_arr = []
	
	for (var i = 0; i < string_arr.length; i++) {
		for (var j = 0; j < jsonData.word_struct.length; j++) {

			if (fuzzy_search(string_arr[i].toLowerCase(), jsonData.word_struct[j].word.toLowerCase()) < string_arr[i].length / 2) {
				console.log((fuzzy_search(string_arr[i].toLowerCase(), jsonData.word_struct[j].word.toLowerCase())))
				result_arr.push(jsonData.word_struct[j]);
			}

		}
	}
	
	console.log(result_arr)

	var resultHTML = "";

	for (var i = 0; i < result_arr.length; i++) {
		

		resultHTML += '<div class="col-12"><div class="search-result bg-light text-dark">'
		resultHTML += '<span>Keyword: \'' + result_arr[i].word + '\'</span>'			
		resultHTML += '<hr class="solid"><div class="buttons">'		
							
		for (var j = 0; j < result_arr[i].arr.length; j++) {
			resultHTML += '<button class="btn btn-outline-info" onclick="goto_timestamp('+ result_arr[i].arr[j] +')" style="margin-right: 10px;margin-bottom: 10px">' + translate_seconds_to_timestamp(result_arr[i].arr[j]) + '</button>'
		}					
								

		resultHTML +=	'</div></div></div>'
						
	}

	if (result_arr.length == 0) {
		$('#results-container').html('<span>No results can be found for: "' + searching+ '"</span>');
	}
	else {
		$('#results-container').css('overflow', 'scroll')
		$('#results-container').html(resultHTML);
	}

}

function goto_timestamp(timestamp) {
	var video = document.getElementById('lecture')
	video.currentTime = timestamp;
	video.play();
}

function translate_seconds_to_timestamp(seconds) {

	var minutes = 0
	var hours = 0

	while (seconds > 60) {
		minutes++;
		if (minutes == 60) {
			hours++;
			minutes = 0;
		}
		seconds -= 60
	}

	return hours.toString(10) + "h" + minutes.toString(10) + "m" + seconds.toString(10) + "s";

}

// Levenshtein algorithm from:
// https://gist.github.com/andrei-m/982927
function fuzzy_search(a, b){
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};