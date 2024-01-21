# -*- encoding: utf-8 -*-
import json

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from requests import request as req

from dashboard.settings import API_URL
from django.http import JsonResponse, HttpResponse, FileResponse
from django.shortcuts import render
import time


def requestAPI(method, url, data=None):
    print("Requesting: ", url)

    try:
        response = req(
            method=method,
            url=url,
            json=data,
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        )

        responseCode = response.status_code
        responseData = {}

        if responseCode != 204:
            responseData = response.json()
    except (Exception,):
        return 404, {'error': "Could to make connection to '" + url + "'"}

    return responseCode, responseData


def JsonFile(fileName, data):
    contentType = 'application/json'
    jsonData = json.dumps(data, indent=2)

    response = HttpResponse(jsonData, content_type=contentType, charset='utf-8', status=200)
    response['Content-Disposition'] = 'attachment; filename="' + fileName + '"'
    return response


@method_decorator(login_required(login_url="/login/"), name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class ApiView(View):
    http_method_names = ['get', 'post', 'put', 'delete']

    @staticmethod
    def get(request, *args, **kwargs):
        table = kwargs.get('table', None)
        id = kwargs.get('id', None)

        page = max(int(request.GET.get('page', 0)), 1)
        limit = max(int(request.GET.get('limit', 10)), 1)
        filtering = request.GET.get('filter', '')
        sort = request.GET.get('sort', '')
        download = request.GET.get('download', None)
        templateFile = request.GET.get('template', None)

        if id is None:
            url = f"{API_URL}/{table}?limit={limit}&page={page - 1}&filter={filtering}&sort={sort}"
        else:
            url = f"{API_URL}/{table}/{id}"

        responseCode, responseData = requestAPI("get", url)

        # Return error
        if responseCode < 200 or responseCode >= 300:
            print(" --> Error: ", responseData)
            return JsonResponse(responseData, status=responseCode)

        # Download single data
        if download is not None:
            print(" --> Downloading data...")
            return JsonFile(
                table + '-' + str(id) + '.json' if id is not None else table + '.json',
                responseData if id is not None else responseData['entries'],
            )

        # Return raw json data
        if templateFile is None:
            print(" --> Returning raw data...")
            return JsonResponse(responseData)

        # Append pagination data
        if id is None:
            total = responseData['pagination']['totalEntries']
            totalPages = (total // limit) + (total % limit != 0)
            startPage = max(1, page - 2)
            endPage = min(totalPages, startPage + 4)

            if startPage - endPage < 4:
                startPage = max(1, endPage - 4)

            responseData['pages'] = {
                'total': total,
                'currentPage': page,
                'indexes': list(range(startPage, endPage + 1)),
                'next': min(page + 1, totalPages),
                'prev': max(page - 1, 1)
            }

        print(" --> Rendering template...")
        return render(request, templateFile, responseData)

    @staticmethod
    def post(request, *args, **kwargs):
        table = kwargs['table']
        jsonData = json.loads(request.body)

        # Make Array or data if not
        if not isinstance(jsonData, list):
            jsonData = [jsonData]

        # Remove id field
        for data in jsonData:
            data.pop('id', None)

        url = f"{API_URL}/{table}/"
        responseCode, responseData = requestAPI("post", url, jsonData)

        return JsonResponse(responseData, status=responseCode)

    @staticmethod
    def put(request, *args, **kwargs):
        return JsonResponse({'error': 'PUT METHOD'}, status=201)

    @staticmethod
    def delete(request, *args, **kwargs):
        table = kwargs['table']
        id = kwargs.get('id', None)

        url = f"{API_URL}/{table}/{id}"
        responseCode, responseData = requestAPI("delete", url)

        return JsonResponse(responseData, status=responseCode)


def validateTable(request, table):
    time.sleep(1)
    return JsonResponse({
            "status": "success",
            "message": f"{table} is not ok!",
            "errors": [
                "Part must larger then 1 hex!",
                "Part is too wide, max 10 hexes!",
            ]
        }, status=400
    )
