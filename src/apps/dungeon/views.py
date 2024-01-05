# -*- encoding: utf-8 -*-

import requests
from src.core.settings import TEMPLATE_DIR, API_URL
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect

def queryAPI(url: str) -> dict | None:
    print("Requesting: " + url)

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
    page = request.GET.get('page', 1)
    limit = 1

    print("PartID: " + str(partId))
    print("Page: " + str(page))

    if partId is not None:
        return JsonResponse(queryAPI(API_URL + 'part/' + str(partId)))
    else:
        partData = queryAPI(API_URL + 'parts' + '?limit=' + str(limit) + '&offset=' + str(page * limit))
        pagination = partData['pagination']

        currentPage = pagination['count'] // limit
        totalPages = pagination['totalEntries'] // limit

        startPage = max(1, currentPage - 2)
        endPage = min(totalPages, startPage + 4)
        pages = list(range(startPage, endPage + 1))

        nextPage = currentPage + 1
        if nextPage > totalPages:
            nextPage = totalPages

        prevPage = currentPage - 1
        if prevPage < 1:
            prevPage = 1

        data = {
            'parts': partData['entries'],
            'pagination': pagination,
            'pages': {
                'currentPage': currentPage,
                'startPage': startPage,
                'endPage': endPage,
                'indexes': pages,
                'next': nextPage,
                'prev': prevPage
            }
        }

        print(pages)

        print(partData['pagination'])

        return render(request, TEMPLATE_DIR + "/dungeon/parts/partsData.html", data)

@login_required(login_url="/login/")
def partView(request):
    return render(request, TEMPLATE_DIR + "/dungeon/parts/partsView.html")
