window.addEventListener('load', function () {

	getUserCourses();

});

function getUserCourses() {
	
	data = {
		username: "genceyalcin"
	}

	$.ajax({
		data: data,
		type: "POST",
		url: "get_users_courses"
	})
	.done(function (result) {
		
		stringHTML = ""

		for (var i = 0; i < result.length; i++) {
			stringHTML += '<div class="row course_row">'
			stringHTML += '<div class="col-12">'
			stringHTML += '<button class="btn btn-block btn-light" onclick="onCourseClick(\'' + result[i][1] + '\', \'' + result[i][2] + '\', this)">' + result[i][0] + '</button>'
			stringHTML += '</div></div>'
		}

		$('#course_container').html(stringHTML); 

	})
	.fail(function () {
		console.log("Shit failed")
	})


}

function onCourseClick(department, course_name, button) {
	console.log(department + " " + course_name);
}