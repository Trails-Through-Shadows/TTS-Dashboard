# -*- encoding: utf-8 -*-
import traceback

import requests
from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse
import hashlib
import urllib
from django import template
from django.utils.safestring import mark_safe


register = template.Library()

@login_required(login_url="/login/")
def index(request):
    context = {'segment': 'index'}

    html_template = loader.get_template('home/dashboard.html')
    return HttpResponse(html_template.render(context, request))


def getLocationHexes(locationID):
    API_URL = 'http://localhost:8080/'
    url = API_URL + 'location/' + locationID

    response = requests.get(url)
    data = response.json()
    print(data)
    return data


@login_required(login_url="/login/")
def pages(request):
    context = {'testik': 'index'}

    try:
        load_template = request.path.split('/')[-1]

        if load_template == 'dungeonView.html':
            context['test'] = getLocationHexes('1')
            pass

        if load_template == 'admin':
            return HttpResponseRedirect(reverse('admin:index'))
        context['segment'] = load_template

        html_template = loader.get_template('home/' + load_template)
        return HttpResponse(html_template.render(context, request))
    except template.TemplateDoesNotExist:
        html_template = loader.get_template('home/page-404.html')
        return HttpResponse(html_template.render(context, request))
    except:
        traceback.print_exc()
        html_template = loader.get_template('home/page-500.html')
        return HttpResponse(html_template.render(context, request))
