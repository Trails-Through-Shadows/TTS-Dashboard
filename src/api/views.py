# -*- encoding: utf-8 -*-
import json

from django.contrib.auth.decorators import login_required
from django.template import loader
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from requests import request as req

from dashboard.settings import API_URL
from django.http import JsonResponse, HttpResponse, FileResponse
import time


def requestAPI(method, url, jsonData=None):
    print("")
    print("Requesting: ", url)

    # Decode data if binary
    if isinstance(jsonData, bytes):
        print("- Decoding data...")
        jsonData = jsonData.decode('utf-8')

    if jsonData is not None:
        print("- Data: ", jsonData)

    try:
        response = req(
            method=method,
            url=url,
            json=jsonData,
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        )

        responseCode = response.status_code
        responseData = {}

        if responseCode != 204:
            responseData = response.json()
    except Exception as e:
        print(e)
        return 404, {'error': "Could to make connection to '" + url + "'"}

    print("- Response: ", responseCode, processJsonData(responseData))
    return responseCode, processJsonData(responseData)


def processJsonData(data):
    # For boolean values convert to string
    for key in data:
        if isinstance(data[key], bool):
            data[key] = str(data[key]).lower()

        if isinstance(data[key], dict):
            data[key] = processJsonData(data[key])

    return data

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
        limit = max(int(request.GET.get('limit', 1000)), 1)
        filtering = request.GET.get('filter', '')
        sort = request.GET.get('sort', '')
        download = request.GET.get('download', None)
        templateFile = request.GET.get('template', None)
        lazy = request.GET.get('lazy', 'false')
        include = request.GET.get('include', '')

        if id is None:
            url = f"{API_URL}/{table}?limit={limit}&page={page - 1}&filter={filtering}&sort={sort}&lazy={lazy}&include={include}"
        else:
            url = f"{API_URL}/{table}/{id}?lazy={lazy}&include={include}"

        responseCode, responseData = requestAPI("get", url)

        # Return error
        if responseCode < 200 or responseCode >= 300:
            print("--> Errored... ", responseData)
            return JsonResponse(responseData, status=responseCode)

        # Download single data
        if download is not None:
            print("--> Downloading data...", responseData)
            return JsonFile(
                table + '-' + str(id) + '.json' if id is not None else table + '.json',
                responseData if id is not None else responseData['entries'],
            )

        # Return raw json data
        if templateFile is None:
            print("--> Returning raw data...")
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

        print("--> Rendering template...", templateFile)
        html_template = loader.get_template(templateFile)
        return HttpResponse(html_template.render(responseData, request))

    @staticmethod
    def post(request, *args, **kwargs):
        table = kwargs.get('table', None)
        data = {}

        if request.body:
            data = json.loads(request.body)
        else:
            return JsonResponse({'error': 'No data provided'}, status=400)

        # Make Array or data if not
        if not isinstance(data, list):
            data = [data]

        url = f"{API_URL}/{table}"
        responseCode, responseData = requestAPI("post", url, data)

        return JsonResponse(responseData, status=responseCode)

    @staticmethod
    def put(request, *args, **kwargs):
        table = kwargs.get('table', None)
        id = kwargs.get('id', None)
        data = {}

        if request.body:
            data = json.loads(request.body)
        else:
            return JsonResponse({'error': 'No data provided'}, status=400)

        url = f"{API_URL}/{table}/{id}"
        responseCode, responseData = requestAPI("put", url, data)

        return JsonResponse(responseData, status=responseCode)

    @staticmethod
    def delete(request, *args, **kwargs):
        table = kwargs['table']
        id = kwargs.get('id', None)

        url = f"{API_URL}/{table}/{id}"
        responseCode, responseData = requestAPI("delete", url)

        return JsonResponse(responseData, status=responseCode)


def validateTable(request, table):
    data = {}

    if request.body:
        data = json.loads(request.body)
    else:
        return JsonResponse({'error': 'No data provided'}, status=400)

    url = f"{API_URL}/validate/{table}"
    responseCode, responseData = requestAPI("post", url, data)
    status = responseCode == 200 or responseCode == 406

    return JsonResponse(responseData, status=200 if status else responseCode, safe=False)

def createFilter(request):
    data = {}

    if request.body:
        data = json.loads(request.body)

    html_template = loader.get_template("includes/filter.html")
    return HttpResponse(html_template.render(data, request))

def createModal(request):
    data = {}

    if request.body:
        data = json.loads(request.body)

    html_template = loader.get_template(data['template'])
    return HttpResponse(html_template.render(data, request))

def createSearchModal(request, table):
    data = {}

    if request.body:
        data = json.loads(request.body)

    data['table'] = table
    html_template = loader.get_template(data['template'])
    return HttpResponse(html_template.render(data, request))

def createMap(request, id):
    url = f"{API_URL}/campaigns/{id}/tree"
    responseCode, responseData = requestAPI("get", url)

    return JsonResponse(responseData, status=responseCode)
