# -*- encoding: utf-8 -*-

from dashboard import TEMPLATE_DIR
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required(login_url="/login/")
def partViewer(request):
    return render(request, TEMPLATE_DIR + "/dungeon/parts/partsViewer.html")

@login_required(login_url="/login/")
def parkWorkbench(request, id=None):
    context = {
        "partId": id,
    }

    return render(request, TEMPLATE_DIR + "/dungeon/parts/partWorkbench.html", context)

@login_required(login_url="/login/")
def enemyViewer(request):
    return render(request, TEMPLATE_DIR + "/dungeon/enemies/enemiesViewer.html")
