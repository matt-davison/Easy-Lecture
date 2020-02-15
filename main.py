import datetime

from flask import Flask, render_template, jsonify, request
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token

app = Flask(__name__)

firebase_request_adapter = requests.Request()
@app.route('/')
def root():
    # Verify Firebase auth.
    id_token = request.cookies.get("token")
    error_message = None
    claims = None
    times = None

    if id_token:
        try:
            # Verify the token against the Firebase Auth API. This example
            # verifies the token on each page load. For improved performance,
            # some applications may wish to cache results in an encrypted
            # session store (see for instance
            # http://flask.pocoo.org/docs/1.0/quickstart/#sessions).
            claims = google.oauth2.id_token.verify_firebase_token(
                id_token, firebase_request_adapter)
        except ValueError as exc:
            # This will be raised if the token is expired or any other
            # verification checks fail.
            error_message = str(exc)

        # Record and fetch the recent times a logged-in user has accessed
        # the site. This is currently shared amongst all users, but will be
        # individualized in a following step.
        store_time(datetime.datetime.now())
        times = fetch_times(10)

    return render_template(
        'index.html',
        user_data=claims, error_message=error_message, times=times)

@app.route('/index')
def index():
	return "hello world"
    #return render_template('index.html', times=dummy_times)

@app.route('/login', methods=['POST', 'GET'])
def login():
	if request.method == 'POST':
		return jsonify({})
	elif request.method == 'GET':
		return render_template('login.html')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)

# [START gae_python37_render_template]
