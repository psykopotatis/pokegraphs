from django.shortcuts import render_to_response
from django.shortcuts import render


def index(request):
    return render_to_response('index.html')