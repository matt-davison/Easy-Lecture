var active_department = undefined;
var active_course = undefined;

var active_department_courses = undefined;
var active_enlisted_courses = undefined;

$(document).ready(function() {

	active_enlisted_courses =  getEnlistedCourses();
	getDepartments();

})

///////////////////////////////////////////////////

function getDepartments() {
	$.ajax({
		type: "POST",
		url: "/get_depts"
	})
	.done(function(result) {
		var htmlResult = ''
		for (var i = 0; i < result.length; i++) {
			htmlResult += '<button class="btn col-2 btn-light department-button" value="'+ result[i] +'" onclick="onDepartmentClick(this)">' + result[i] + '</button>'
		}
		$('#departments').html(htmlResult)
	})
	.fail(function() {
		console.log('Mission failed boys')
	})
}

function getEnlistedCourses() {
	var result;

	$.ajax({
		type:"POST",
		url: "get_users_courses",
		async: false,
	}).done((data) => {
		result = data;
	})

	return result;
}

function getCourses(dept) {
	
	data = {
		dept: dept
	}

	$.ajax({
		type: "POST",
		data,
		url: "/get_dept_courses"
	})
	.done(function (result) {
		var htmlResult = ""
		htmlResult += '<div class="col-12"><h3><u>Courses (Click to Enroll/Unenroll)</u></h3></div><div class="container" id="courses">'

		console.log(result)

		for (var i = 0; i < result.length; i++) {

			var primary = "btn-light"

			for (var j = 0; j < active_enlisted_courses.length; j++) {
				if (result[i].name == active_enlisted_courses[j][0]) {
					primary = "btn-info"
				}
			}

			htmlResult += '<button class="btn col-2 '+primary+' department-button" onclick="onCourseClick(this)" dept="'+ result[i].dept +'" cno="' + result[i].num + '" value="'+result[i].name+'">' + result[i].dept + result[i].num + '</button>'
		}

		htmlResult += '</div>'

		$('#courses-list').html(htmlResult);
	})
	.fail(function() {
		console.log('Mission failed boys')
	})
}

///////////////////////////////////////////////////////////

function onCourseClick(button) {
	var data = {
		department: button.getAttribute('dept'),
		course_no: button.getAttribute('cno')
	}

	console.log(data)
	var del = false

	for (var i = 0; i < active_enlisted_courses.length; i++) {
		if (button.value == active_enlisted_courses[i][0]) {
			del = true;
		}
	}

	if (!del) {
		$.ajax({
			type: "POST",
			data: data,
			url: "/update_user"
		})
		.done(function() {
			button.classList.add('btn-info')
			button.classList.remove('btn-light')
			active_enlisted_courses.push([button.value, button.getAttribute('dept'), button.getAttribute('cno')])
			console.log('Updated')
		})

		.fail(function() {

		})
	}
	else {
		$.ajax({
			type: "POST",
			data: data,
			url: "/delete_course",
		})
		.done(function () {
			button.classList.remove('btn-info')
			button.classList.add('btn-light')
			active_enlisted_courses.pop(1, 0, [button.value, button.getAttribute('dept'), button.getAttribute('cno')])
			console.log('')
		})
		.fail(function() {
			console.log('fuck me in the ass')
		})
	}

	
}

function onDepartmentClick(button) {
	
	if (active_department == button) {
		
		active_department.classList.add('bg-light')
		active_department.classList.add('text-dark')
		active_department.classList.remove('bg-dark')
		active_department.classList.remove('text-light')

		$('#departments-list').removeClass('bg-light')
		$('#departments-list').addClass('bg-secondary')

		$('#courses-list').addClass('bg-light')
		$('#courses-list').addClass('text-dark')
		$('#courses-list').removeClass('bg-secondary')
		$('#courses-list').removeClass('text-light')
		$('#courses-list').html('')

		active_department = undefined

	}

	else {

		if (active_department != undefined) {
			active_department.classList.add('bg-light')
			active_department.classList.add('text-dark')
			active_department.classList.remove('bg-dark')
			active_department.classList.remove('text-light')
		}

		active_department = button

		active_department.classList.remove('bg-light')
		active_department.classList.remove('text-dark')
		active_department.classList.add('bg-dark')
		active_department.classList.add('text-light')

		$('#departments-list').addClass('bg-light')
		$('#departments-list').removeClass('bg-secondary')

		$('#courses-list').removeClass('bg-light')
		$('#courses-list').removeClass('text-dark')
		$('#courses-list').addClass('bg-secondary')
		$('#courses-list').addClass('text-light')

		getCourses(button.value)

	}

}