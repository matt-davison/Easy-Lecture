$(document).on('ready', () => {

	getCourseInformationForUser();

})

getCourseInformationForUser() {
	
	$.ajax({
		type: "POST",
		url: "/get_user_courses",
		success: function (result) {
			console.log(result);
		}
	})

}

goToCoursePage(department, courseNo) {

}