var active_course = null;
var active_lecture = null;

window.addEventListener('load', function () {

	getUserCourses();

});

////////////////////////////////////////////////////////////

function getUserCourses() {
	

	$.ajax({
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

		stringHTML = "<div class='row lecture_row'><div class='col-12'><h3>Lecture Videos for " + department + " " + course_no + "</h3></div></div>"

		for (var i = 0; i < result.length; i++) {
			stringHTML += '<div class="row lecture_row">'
			stringHTML += '<div class="col-12">'
			stringHTML += '<button class="btn btn-block btn-light" onclick="onLectureClick(\'' + result[i][1] + '\', \'' + result[i][2] + '\', \'' + result[i][1] + '\' this)">' + result[i][1] + '</button>'
			stringHTML += '</div></div>'
		}

		$('#lecture_list').html(stringHTML); 
	})
	.fail(function () {
		console.log("Mission failed boys")
	})
}

////////////////////////////////////////////////////////////

function onLectureClick(department, course_no, video_name, button) {
	console.log(video_name);

	if (button == active_lecture) {

	}

	else {
		active_lecture = button;

		active_course = button;
		
		button.classList.remove('btn-light')
		button.classList.add('btn-dark')
		
		$('#lecture_list').removeClass('bg-secondary')
		$('#lecture_list').addClass('bg-light')

		$('#lecture_view').removeClass('bg-light')
		$('#lecture_view').removeClass('text-dark')
		$('#lecture_view').addClass('bg-secondary')
		$('#lecture_view').addClass('text-light')

		getLectureInfo(department, course_no, video_name);
	}
}

function onCourseClick(department, course_no, button) {
	
	if (button == active_course) {

		active_course = null;
		

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
	}

	else {

		if (active_course != null) {
			active_course.classList.remove('btn-dark')
			active_course.classList.add('btn-light')
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