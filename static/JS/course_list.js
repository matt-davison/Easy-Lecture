var active_course = undefined;
var active_course_lectures = null;
var active_lecture = undefined;

window.addEventListener('load', function () {

	getUserCourses();

});

//////////////////////////////////////////////////////////// AJAX

function getUserCourses() {
	

	$.ajax({
		type: "POST",
		url: "get_users_courses"
	})
	.done(function (result) {
		console.log(result);
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
		console.log("Mission failed boys")
	})


}

function getCourseLectures(department, course_no) {

	data = {
		department: department,
		course_no: course_no
	}

	$.ajax({
		data: data,
		type: "POST", 
		url: "/get_courses_lectures",
	})
	.done(function (result) {
		console.log(result)

		active_course_lectures = result;

		stringHTML = "<div class='row lecture_row'><div class='col-12'><h3>Lecture Videos for " + department + " " + course_no + "</h3></div></div>"

		for (var i = 0; i < result.length; i++) {
			stringHTML += '<div class="row lecture_row">'
			stringHTML += '<div class="col-12">'
			stringHTML += '<button class="btn btn-block btn-light" onclick="onLectureClick(\'' + department + '\', \'' + course_no + '\', \'' + result[i][1] + '\', this)">' + result[i][1] + '</button>'
			stringHTML += '</div></div>'
		}

		$('#lecture_list').html(stringHTML); 
	})
	.fail(function () {
		console.log("Mission failed boys")
	})
}

//////////////////////////////////////////////////////////// EVENT LISTENERS

function onLectureClick(department, course_no, video_name, button) {
	console.log(video_name, department, course_no, active_course_lectures);

	if (button == active_lecture) {
		
		button.classList.remove('btn-dark')
		button.classList.add('btn-light')

		$('#lecture_list').removeClass('bg-light')
		$('#lecture_list').addClass('bg-secondary')

		$('#lecture_view').removeClass('bg-secondary')
		$('#lecture_view').removeClass('text-light')
		$('#lecture_view').addClass('text-dark')
		$('#lecture_view').addClass('bg-light')
		$('#lecture_view').html('');

		active_lecture = undefined;
	}

	else {
		
		if (active_lecture != undefined) {
			active_lecture.classList.remove('btn-dark')
			active_lecture.classList.add('btn-light')
		}

		active_lecture = button;
		
		button.classList.remove('btn-light')
		button.classList.add('btn-dark')
		
		$('#lecture_list').removeClass('bg-secondary')
		$('#lecture_list').addClass('bg-light')

		$('#lecture_view').removeClass('bg-light')
		$('#lecture_view').removeClass('text-dark')
		$('#lecture_view').addClass('bg-secondary')
		$('#lecture_view').addClass('text-light')


		for (var i = 0; i < active_course_lectures.length; i++) {
			if (active_course_lectures[i][1] == video_name) {
				var htmlResult = '<div class="row course_row text-center">'
				
				htmlResult += '<div class="col-12">'
				htmlResult += '<h3>' + video_name + ' - ' + department + ' ' + course_no + '</h3></div></div>'
				
				htmlResult += '<div class="row course_row text-center"><div class="col-12">'
				htmlResult += '<iframe class="shadow" width="611" height="344" src="' + active_course_lectures[i][0]['videoURL'] + '" frameborder="0" allowfullscreen></iframe>'
				htmlResult += '</div></div>'

				htmlResult += '<div class="row course_row"><div class="col-12">'
				htmlResult += '<button class="btn btn-info" onclick="window.location.href = \'/lecture?dep=' + department + '&cno=' + course_no +'&lec=' + video_name + '\'">Go to Lecture: </button>'
				htmlResult += '</div></div>'

				$('#lecture_view').html(htmlResult);
			}
		}

	}
}

function onCourseClick(department, course_no, button) {
	
	if (button == active_course) {		

		button.classList.remove('btn-dark')
		button.classList.add('btn-light')

		$('#course_list').removeClass('bg-light')
		$('#course_list').addClass('bg-secondary')

		$('#lecture_list').removeClass('bg-secondary')
		$('#lecture_list').removeClass('text-light')
		$('#lecture_list').addClass('text-dark')
		$('#lecture_list').addClass('bg-light')
		$('#lecture_list').css('overflow', 'visible')
		$('#lecture_list').html("<span style='padding-top: 15px;'>Select a Course:</span>")

		active_course = undefined;
		active_course_lectures = undefined;

		if (active_lecture != undefined) {
			active_lecture.classList.remove('btn-dark')
			active_lecture.classList.add('btn-light')

			$('#lecture_view').removeClass('bg-secondary')
			$('#lecture_view').removeClass('text-light')
			$('#lecture_view').addClass('text-dark')
			$('#lecture_view').addClass('bg-light')
			$('#lecture_view').html('');

			active_lecture = undefined;
		}
	}

	else {

		if (active_course != undefined) {
			active_course.classList.remove('btn-dark')
			active_course.classList.add('btn-light')
		}

		if (active_lecture != undefined) {
			$('#lecture_view').removeClass('bg-secondary')
			$('#lecture_view').removeClass('text-light')
			$('#lecture_view').addClass('text-dark')
			$('#lecture_view').addClass('bg-light')
			$('#lecture_view').html('')

			active_lecture = undefined;
		}

		active_course = button;
		
		button.classList.remove('btn-light')
		button.classList.add('btn-dark')
		
		$('#course_list').removeClass('bg-secondary')
		$('#course_list').addClass('bg-light')

		$('#lecture_list').removeClass('bg-light')
		$('#lecture_list').removeClass('text-dark')
		$('#lecture_list').addClass('bg-secondary')
		$('#lecture_list').addClass('text-light')
		$('#lecture_list').css('overflow', 'scroll')

		getCourseLectures(department, course_no);
	}

}