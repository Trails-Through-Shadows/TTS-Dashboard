# -*- encoding: utf-8 -*-

from django.urls import path

from .views import *

urlpatterns = [
    path('dungeon/parts/', partViewer, name="partViewer"),
    path('dungeon/parts/workbench/', parkWorkbench, name="partCreator"),
    path('dungeon/parts/workbench/<int:id>/', parkWorkbench, name="partEditor"),
    path('dungeon/enemies/', enemyViewer, name="enemyViewer"),
]
