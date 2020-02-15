import datetime
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/login', methods=['POST', 'GET'])
def login():
	if request.method == 'POST':
		return jsonify({})
	elif request.method == 'GET':
		return render_template('login.html')

@app.route('/manage_courses')
def manage_courses():
    return render_template('manage_courses.html')

@app.route('/upload_lecture')
def upload_lecture():
    return render_template('upload_lecture.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')
    
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
