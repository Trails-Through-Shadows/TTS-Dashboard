# -*- encoding: utf-8 -*-

import requests
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect

API_URL = 'http://localhost:8080/'

def queryAPI(url: str) -> dict | None:
    response = requests.get(url)
    responseCode = response.status_code

    if responseCode == 200:
        responseData = response.json()

        return responseData
    else:
        return None

@login_required(login_url="/login/")
def asyncDataRequest(request):
    partId = request.GET.get('id', None)

    if partId is not None:
        return JsonResponse(queryAPI(API_URL + 'part/' + str(partId)))
    else:
        partData = queryAPI(API_URL + 'parts')
        return render(request, "home/parts/partsData.html", {'parts': partData['entries']})

@login_required(login_url="/login/")
def partView(request):
    return render(request, "home/parts/partsView.html", {'segment': '/scheme/parts'})
