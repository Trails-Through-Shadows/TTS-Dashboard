# -*- encoding: utf-8 -*-

from src.core.settings import TEMPLATE_DIR, API_URL
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

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
