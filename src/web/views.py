# -*- encoding: utf-8 -*-

from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required(login_url="/login/")
def index(request):
    return render(request, 'home/dashboard.html')

@login_required(login_url="/login/")
def partViewer(request):
    return render(request, 'dungeon/parts/partsViewer.html')

@login_required(login_url="/login/")
def parkWorkbench(request, id=None):
    context = {"partId": id}
    return render(request, 'dungeon/parts/partsWorkbench.html', context)

@login_required(login_url="/login/")
def enemyViewer(request):
    return render(request, 'dungeon/enemies/enemiesViewer.html')

@login_required(login_url="/login/")
def enemyWorkbench(request, id=None):
    context = {"enemyId": id}
    return render(request, 'dungeon/enemies/enemiesWorkbench.html', context)

@login_required(login_url="/login/")
def obstacleViewer(request):
    return render(request, 'dungeon/obstacles/obstaclesViewer.html')

@login_required(login_url="/login/")
def obstacleWorkbench(request, id=None):
    context = {"obstacleId": id}
    return render(request, 'dungeon/obstacles/obstaclesWorkbench.html', context)

@login_required(login_url="/login/")
def actionViewer(request):
    return render(request, 'mechanics/actions/actionsViewer.html')

@login_required(login_url="/login/")
def effectViewer(request):
    return render(request, 'mechanics/effects/effectsViewer.html')

@login_required(login_url="/login/")
def itemViewer(request):
    return render(request, 'mechanics/items/itemsViewer.html')

@login_required(login_url="/login/")
def itemWorkbench(request, id=None):
    context = {"itemId": id}
    return render(request, 'mechanics/items/itemWorkbench.html', context)

@login_required(login_url="/login/")
def classViewer(request):
    return render(request, 'character/classes/classesViewer.html')

@login_required(login_url="/login/")
def raceViewer(request):
    return render(request, 'character/races/racesViewer.html')

@login_required(login_url="/login/")
def campaignViewer(request):
    return render(request, 'world/campaigns/campaignsViewer.html')

@login_required(login_url="/login/")
def campaignWorkbench(request, id=None):
    context = {"obstacleId": id}
    return render(request, 'world/campaigns/campaignsWorkbench.html', context)

@login_required(login_url="/login/")
def locationViewer(request):
    return render(request, 'world/locations/locationsViewer.html')

@login_required(login_url="/login/")
def locationWorkbench(request, id=None):
    context = {"locationId": id}
    return render(request, 'world/locations/locationsWorkbench.html', context)
