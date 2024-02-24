# -*- encoding: utf-8 -*-

from django.urls import path

from src.web import views

urlpatterns = [
    path('', views.index, name='home'),

    # Dungeon
    path('dungeon/parts/', views.partViewer, name="partViewer"),
    path('dungeon/parts/workbench/', views.parkWorkbench, name="partWorkbench"),
    path('dungeon/parts/workbench/<int:id>/', views.parkWorkbench, name="partWorkbenchEdit"),

    path('dungeon/enemies/', views.enemyViewer, name="enemyViewer"),
    path('dungeon/enemies/workbench/', views.enemyWorkbench, name="enemyWorkbench"),
    path('dungeon/enemies/workbench/<int:id>/', views.enemyWorkbench, name="enemyWorkbenchEdit"),

    path('dungeon/obstacles/', views.obstacleViewer, name="obstacleViewer"),
    path('dungeon/obstacles/workbench/', views.obstacleWorkbench, name="obstaclesWorkbench"),
    path('dungeon/obstacles/workbench/<int:id>/', views.obstacleWorkbench, name="obstacleWorkbenchEdit"),

    path('mechanics/actions/', views.actionViewer, name="actionsViewer"),

    path('mechanics/effects/', views.effectViewer, name="effectsViewer"),

    path('mechanics/items/', views.itemViewer, name="itemsViewer"),

    path('character/classes/', views.classViewer, name="classViewer"),

    path('character/races/', views.raceViewer, name="raceViewer"),

    path('world/campaigns/', views.campaignViewer, name="campaignViewer"),
]
