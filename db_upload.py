from google.cloud import storage
from moviepy.editor import VideoFileClip, AudioFileClip
import os
import firestore

bucket_name = u'easylec'
def upload_blob(source_dir, source_name):
    # bucket_name = "your-bucket-name"
    # source_file_name = "local/path/to/file"
    # source_name = "storage-object-name"

    #"CS-2505-Intro_to_Python.mp4"

    #set up storage access
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    #upload mp4
    source_file_name = os.path.join(source_dir, source_name)
    blob = bucket.blob(source_name)
    blob.upload_from_filename(source_file_name)
    print("File {} uploaded to {}.".format(source_file_name, source_name))

    #generate .wav from .mp4
    destination_wav = os.path.splitext(source_name)[0]
    source_file_wav = os.path.join(source_dir, destination_wav + ".wav")
    audio_clip = VideoFileClip(source_file_name)
    audio_clip.audio.write_audiofile(source_file_wav, nbytes=4, codec='pcm_s32le')

    wav_blob = bucket.blob(destination_wav)
    wav_blob.upload_from_filename(source_file_wav)

