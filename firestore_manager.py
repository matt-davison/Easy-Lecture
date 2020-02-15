import os

from google.cloud import firestore

db = firestore.Client()


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
        courses.append([r.get().to_dict()['name'], r.get().to_dict()['dept'], r.get().id, r])
    return courses


def get_course(ref):
    return ref.get().to_dict()


def get_courses_lec(ref):
    arr = []
    courses = ref.collection(u'Lectures')
    for doc in courses.stream():
        arr.append([doc.to_dict(), doc.id])
    return arr
