window.addEventListener('load', function () {

	getUserCourses();

});

function getUserCourses() {
	$.ajax({
		type: "POST",
		url: "/get_user_courses"
	})
	.done(function (result) {
		console.log(result);
	})
	.fail(function () {
		console.log("Shit failed")
	})


}