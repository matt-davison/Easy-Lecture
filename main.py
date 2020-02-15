import datetime
from flask import Flask, render_template, jsonify, request, make_response, session, redirect, url_for
import os
from werkzeug.utils import secure_filename
import logging
from db_upload import upload_blob
from firestore_manager import get_course_names_for_user

log = logging.getLogger('Easy-Lecture')
app = Flask(__name__)


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
		# return jsonify(get_course_names_for_user("nateb@vt.edu"))
		return jsonify(get_course_names_for_user(session["username"]))


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
	return render_template('upload_lecture.html')


# Abdul Rehman on StackOverflow
@app.route('/upload_lecture', methods=['POST'])
def upload_lecture():
	file = request.files['file']

	secure_name = secure_filename(file.filename)
	save_path = os.path.join('temp', secure_name)
	current_chunk = int(request.form['dzchunkindex'])

	# If the file already exists it's ok if we are appending to it,
	# but not if it's new file that would overwrite the existing one
	if os.path.exists(save_path) and current_chunk == 0:
		# 400 and 500s will tell dropzone that an error occurred and show an error
		return make_response(('File already exists', 400))

	try:
		with open(save_path, 'ab') as f:
			f.seek(int(request.form['dzchunkbyteoffset']))
			f.write(file.stream.read())
	except OSError:
		# log.exception will include the traceback so we can see what's wrong 
		log.exception('Could not write to file')
		return make_response(("Not sure why,"
							  " but we couldn't write the file to disk", 500))

	total_chunks = int(request.form['dztotalchunkcount'])

	if current_chunk + 1 == total_chunks:
		# This was the last chunk, the file should be complete and the size we expect
		if os.path.getsize(save_path) != int(request.form['dztotalfilesize']):
			log.error(f"File {file.filename} was completed, "
					  f"but has a size mismatch."
					  f"Was {os.path.getsize(save_path)} but we"
					  f" expected {request.form['dztotalfilesize']} ")
			return make_response(('Size mismatch', 500))
		else:
			log.info(f'File {file.filename} has been uploaded successfully')
			upload_blob('temp', secure_name)
	else:
		log.debug(f'Chunk {current_chunk + 1} of {total_chunks} '
				  f'for file {file.filename} complete')

	return make_response(("Chunk upload successful", 200))


@app.route('/learn')
def learn():
	return render_template('learn.html')


if __name__ == '__main__':
	app.config["SECRET_KEY"] = "..."
	os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join('keys', 'vthacks7.json')

	app.run(host='127.0.0.1', port=8080, debug=True)
