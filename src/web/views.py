# -*- encoding: utf-8 -*-

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.template import loader


@login_required(login_url="/login/")
def index(request):
    html_template = loader.get_template('home/dashboard.html')
    return HttpResponse(html_template.render(None, request))

@login_required(login_url="/login/")
def partViewer(request):
    html_template = loader.get_template('dungeon/parts/partsViewer.html')
    return HttpResponse(html_template.render(None, request))

@login_required(login_url="/login/")
def parkWorkbench(request, id=None):
    context = {
        "partId": id,
    }

    html_template = loader.get_template('dungeon/parts/partWorkbench.html')
    return HttpResponse(html_template.render(context, request))

@login_required(login_url="/login/")
def enemyViewer(request):
    html_template = loader.get_template('dungeon/enemies/enemiesViewer.html')
    return HttpResponse(html_template.render(None, request))
