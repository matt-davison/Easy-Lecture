from google.cloud import speech_v1
from google.cloud import firestore

import os

def long_req(storage_uri, dept, class_name, lecture_name):
    client = speech_v1.SpeechClient()

    enable_word_time_offsets = True

    language_code = "en-US"
    config = {
        "enable_word_time_offsets": enable_word_time_offsets,
        "language_code": language_code,
    }
    audio = {"uri": storage_uri}

    operation = client.long_running_recognize(config, audio)

    print(u"Waiting for operation to complete...")
    response = operation.result()

    result = response.results[0]
    # Print the start and end time of each word
    word_arr = []
    start_arr = []
    full_transcript = ""
    results = response.results
    for result in results:
        alternative = result.alternatives[0]
        for word in alternative.words:
            word_arr.append(word.word)
            sec = word.start_time.seconds * 1000000000
            fin_sec = sec + word.start_time.nanos
            start_arr.append(fin_sec)
            full_transcript = full_transcript + " " + word.word
    db = firestore.Client()
    doc_ref = db.collection(u'department').document(dept).collection(u'Courses') \
        .document(class_name).collection(u'Lectures').document(lecture_name)
    doc_ref.set({
        u'transcript': full_transcript,
        u'timestamps': start_arr,
        u'words': word_arr,
        u'videoURL': "https://storage.cloud.google.com/easylec/"+dept+"-"+class_name+"-"+lecture_name+".mp4"
    })
