from google.cloud import storage
from moviepy.editor import VideoFileClip, AudioFileClip
import os
import firestore_manager
import argparse
from transcribe import long_req

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

    #generate .wav from .mp4
    destination_wav = os.path.splitext(source_name)[0]+".wav"
    source_file_wav = os.path.join(source_dir, destination_wav)
    audio_clip = VideoFileClip(source_file_name)
    audio_clip.audio.write_audiofile(source_file_wav, nbytes=4, codec='pcm_s16le', ffmpeg_params=['-ac','1'])

    wav_blob = bucket.blob(destination_wav)
    wav_blob.upload_from_filename(source_file_wav)

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--storage_uri",
        type=str,
        default="gs://easylec/"+destination_wav,
    )
    args = parser.parse_args()

    parse = os.path.splitext(source_name)[0].split('-')

    long_req(args.storage_uri, parse[0], parse[1], parse[2])
    
    os.remove(os.path.join(source_dir, source_file_name))
    os.remove(os.path.join(source_dir, source_file_wav))

    print("File {} uploaded and /temp cleared.".format(source_name))