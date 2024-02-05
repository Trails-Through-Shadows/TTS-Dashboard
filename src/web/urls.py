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
]
