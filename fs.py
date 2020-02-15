import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'C:\\vthacks7.json'

from google.cloud import firestore

db = firestore.Client()


# for doc in users_ref.stream():
#    print(u'{} => {}'.format(doc.id, doc.to_dict()))
# ref = db.collection(u'department').document(dept).collection(u'Courses')\
#    .document(class_name).collection(u'Lectures').where(u'name', u'==', lecture_name)

def get_lecture_by_name(dept, class_name, lecture_name):
    ref = db.collection(u'department').document(dept).collection(u'Courses') \
        .document(class_name).collection(u'Lectures').document(lecture_name)
    return ref.get().to_dict()


def get_courses_by_department(dept):
    ref = db.collection(u'department').document(dept).get().to_dict()
    return ref

def get_course_names_for_user(user):
    ref = db.collection(u'users').document(user).get().to_dict()
    courses = []
    for r in ref['courses']:
        courses.append(r.get().to_dict()['name'])

    return courses
