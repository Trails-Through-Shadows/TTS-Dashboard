# -*- encoding: utf-8 -*-

import requests
from src.core.settings import TEMPLATE_DIR, API_URL
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect

@login_required(login_url="/login/")
def partViewer(request):
    return render(request, TEMPLATE_DIR + "/dungeon/parts/partsView.html")

@login_required(login_url="/login/")
def parkWorkbench(request, id=None):
    context = {
        "partId": id,
    }

    return render(request, TEMPLATE_DIR + "/dungeon/parts/partEditor.html", context)
