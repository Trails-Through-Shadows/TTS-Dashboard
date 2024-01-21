# -*- encoding: utf-8 -*-

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.template import loader


@login_required(login_url="/login/")
def index(request):
    html_template = loader.get_template('home/dashboard.html')
    return HttpResponse(html_template.render(None, request))
