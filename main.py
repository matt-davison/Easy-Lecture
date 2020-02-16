import datetime
from flask import Flask, render_template, jsonify, request, make_response, session, redirect, url_for
import os
from werkzeug.utils import secure_filename
from db_upload import upload_blob
from firestore_manager import get_course_names_for_user
from firestore_manager import get_courses_lec_lng

#log = logging.getLogger('Easy-Lecture')
app = Flask(__name__)
temp_dir = '/tmp'

@app.route('/')
@app.route('/index', methods=['GET'])
def index():
	if not session.get('logged_in'):
		return redirect(url_for('login'))
	else:
		return render_template('index.html')


@app.route('/test')
def test():
	return render_template('test.html')


@app.route('/get_users_courses', methods=['POST'])
def get_users_courses():
	if request.method == 'POST':
		# print(session["username"])
		# return jsonify(get_course_names_for_user("nateb@vt.edu"))
		return jsonify(get_course_names_for_user(session["username"]))


@app.route('/get_courses_lectures', methods=['POST'])
def get_courses_lectures():
	if request.method == 'POST':
		return jsonify(get_courses_lec_lng(request.form["department"], request.form["course_no"]))

@app.route('/login',  methods=['POST', 'GET'])
def login():
	if session.get("logged_in") and session["logged_in"]:
		return redirect(url_for("index"))
	if (request.method == 'POST'):
		session["username"] = request.form["username"]
		session["user_type"] = request.form["user_type"]
		session["logged_in"] = True
		print(session['user_type'])
		print(session['username'])
		return redirect(url_for("index"))
	elif request.method == 'GET':
		return render_template('login.html')

@app.route('/logout', methods=['GET'])
def logout():
	if session.get('logged_in') and session['logged_in']:
		session.clear()
	return redirect(url_for("index"))

@app.route('/manage_courses')
def manage_courses():
	return render_template('manage_courses.html')


@app.route('/upload')
def upload():
	return render_template('upload.html')

@app.route('/upload_video', methods=['GET','POST'])
def upload_lecture():
	file = request.files['file']
	video_name = secure_filename(file.filename)
	print(video_name)
	#save_path = os.path.join(temp_dir, video_name)
	#with open(save_path, 'w') as f:
	file.save(os.path.join(temp_dir,video_name))
	upload_blob(temp_dir, video_name)
	return render_template('upload_success.html')

@app.route('/upload_wait')
def upload_wait():
	return render_template('upload_wait.html')


@app.route('/learn')
def learn():
	return render_template('learn.html')


if __name__ == '__main__':
	app.config["SECRET_KEY"] = "..."
	os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join('keys', 'vthacks7.json')
	app.run(host='127.0.0.1', port=8080, debug=True)
