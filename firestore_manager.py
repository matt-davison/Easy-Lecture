import os



from google.cloud import firestore

db = firestore.Client()


def get_lecture_by_name(dept, class_name, lecture_name):
    ref = db.collection(u'department').document(dept).collection(u'Courses') \
        .document(class_name).collection(u'Lectures').document(lecture_name)
    return ref.get().to_dict()

def get_departments():
	ref = db.collection(u'department')
	arr = []
	for doc in ref.stream():
		arr.append([doc.to_dict(), doc.id])
	
	new_arr = list()
	for dep in arr:
		new_arr.append(dep[1])
	return new_arr
	
    ref = db.collection(u'department')
    arr = []
    for doc in ref.stream():
        arr.append([doc.to_dict(), doc.id])

    new_arr = list()
    for dep in arr:
        new_arr.append(dep[1])
    return new_arr

#for dept
def get_courses_by_department(dept):
    arr = []
    ref = db.collection(u'department').document(dept).collection(u'Courses')
    for doc in ref.stream():
        d = doc.to_dict()
        d['num'] = doc.id
        arr.append(d)
    return arr


def get_course_names_for_user(user):
    ref = db.collection(u'users').document(user).get().to_dict()
    courses = []
    for r in ref['courses']:
        courses.append([r.get().to_dict()['name'], r.get().to_dict()['dept'], r.get().id])
    return courses


def get_user_refs(user):
    ref = db.collection(u'users').document(user).get().to_dict()
    courses = []
    for r in ref['courses']:
        courses.append(r)
    return courses


#returns course
def get_course(ref):
    return ref.get().to_dict()


#Gets Course by BreadCrumb
def get_course_by_bc(dept, id):
    ref = db.collection(u'department').document(dept).collection(u'Courses').document(id)
    return ref.get().to_dict()


def get_course_by_bc_ref(dept, id):
    ref = db.collection(u'department').document(dept).collection(u'Courses').document(id)
    return [ref.get().to_dict(), ref.id]


def delete_course_from_user(usr, dept, id):
    course = get_course_by_bc_ref(dept, id)
    refs = get_course_names_for_user(usr)
    for re in refs:
        if re[0] == course[0]['name']:
            ref = db.collection(u'users').document('nateb@vt.edu')
            ref.update({
                u'courses': firestore.ArrayRemove([db.document('department/' + course[0]['dept'] + '/Courses/' + course[1])])
            })


def update_course_user(dep, id, email):
    ref = db.collection(u'users').document(email)
    ref.update({
        u'courses': firestore.ArrayUnion([db.document('department/' + dep + '/Courses/' + id)])
    })

def get_courses_lec(ref):
    arr = []
    courses = ref.collection(u'Lectures')
    for doc in courses.stream():
        arr.append([doc.to_dict(), doc.id])
    return arr

def get_courses_lec_lng(dept, id):
    arr = []
    courses = db.collection(u'department').document(dept).collection(u'Courses').document(id).collection(u'Lectures')
    for doc in courses.stream():
        arr.append([doc.to_dict(), doc.id])
    return arr
