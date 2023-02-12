from django.http import JsonResponse
from django.shortcuts import render
import speech_recognition as sr
import openai
import requests
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
#from googletrans import Translator
from translate import Translator


def translate(request, language):

    def translate_text(text):
        translator = Translator(to_lang=language)
        max_chunk_length = 500

        if len(text) > max_chunk_length:
            chunks = [text[i:i + max_chunk_length] for i in range(0, len(text), max_chunk_length)]
            translated_text = ''
            for chunk in chunks:
                translated_text += translator.translate(chunk)
            return translated_text
        else:
            return translator.translate(text)

    if request.method == "GET":
        translated_text = ""
        with open("paragraph.txt","r") as file:
            for line in file:
                translated_text += translate_text(line)
    return JsonResponse({'Translation':translated_text})
    

def keyword_def(request, word):
    if request.method == "GET":
        
        openai.api_key = 
        
        response = openai.Completion.create(
            model = "text-davinci-003",
            prompt = f"Get me a 100 word summary on {word}",
            temperature=0,
            max_tokens=2048,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            timeout = 30
        )
        answer = response["choices"][0]["text"]
        list_of_paras = answer.split("\n\n")
        paragraph = "".join(list_of_paras)
        print(answer)
        
        with open("paragraph.txt", "w") as file:
            # write the string to the file
            file.write(paragraph)
        
        return JsonResponse({'Answer':paragraph})


@csrf_exempt
def django_application(request): 
    
    if request.method == "POST":
    
        # url = 'https://vr-audio.fly.dev/download'
        # response = requests.get(url)
    
        # if response.status_code == 200:
        #     with open("/Users/u.v._ray/Downloads/download.wav", "wb") as f:
        #         f.write(response.content)
        #         print("WAV file saved successfully.")
        # else:
        #     print("Failed to fetch WAV file.")
        file_content = request.body
        with open('test.wav', 'wb') as f:
            f.write(file_content)
        r = sr.Recognizer()
        # audio_file = sr.AudioFile("/Users/u.v._ray/Downloads/download.wav")
        audio_file = sr.AudioFile("test.wav")
        
        openai.api_key = "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"

        with audio_file as source:
            audio = r.record(source)
        try:
            transcript = r.recognize_google(audio)
            print("Google Speech Recognition thinks you said " + transcript)
        except sr.UnknownValueError:
            print("Google Speech Recognition could not understand audio")
        except sr.RequestError as e:
            print("Could not request results from Google Speech Recognition service; {0}".format(e))
            
        print(transcript)
        
        response = openai.Completion.create(
            model = "text-davinci-003",
            prompt = f"Get me the main keywords in a comma separated string with no spaces in context with the following speech: {transcript}",
            temperature=0,
            max_tokens=2048,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        
        print(response)

        list_of_words = response["choices"][0]["text"].split("\n\n")[1].split(',')
        
        print(list_of_words)
        
        return JsonResponse({'keywords':list_of_words})
    # return render(request, 'django_application.html', {'message': list_of_words})