# -*- encoding: utf-8 -*-

import requests
from src.core.settings import TEMPLATE_DIR, API_URL
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required(login_url="/login/")
def tableDataRequest(request, table):
    page = max(int(request.GET.get('page', 0)), 1)
    limit = max(int(request.GET.get('limit', 10)), 1)
    filtering = request.GET.get('filter', '')
    templateFile = request.GET.get('template', None)

    url = API_URL + table
    url += '?limit=' + str(limit)
    url += '&page=' + str(page - 1)
    url += '&filter=' + filtering

    response = requests.get(url)
    responseCode = response.status_code
    responseData = response.json()

    # Return error table template
    if templateFile is None or responseCode != 200:
        raise Exception('No template or no response')

    total = responseData['pagination']['totalEntries']

    totalPages = (total // limit) + (total % limit != 0)
    startPage = max(1, page - 2)
    endPage = min(totalPages, startPage + 4)

    if startPage - endPage < 4:
        startPage = max(1, endPage - 4)

    data = {
        'entries': responseData['entries'],
        'pages': {
            'total': total,
            'currentPage': page,
            'indexes': list(range(startPage, endPage + 1)),
            'next': min(page + 1, totalPages),
            'prev': max(page - 1, 1)
        }
    }

    return render(request, TEMPLATE_DIR + templateFile, data)
