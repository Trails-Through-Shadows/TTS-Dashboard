# -*- encoding: utf-8 -*-

from django.urls import path

from .views import partViewer, partEditor

urlpatterns = [
    path('dungeon/parts/', partViewer, name="partViewer"),
    path('dungeon/parts/create/', partEditor, name="partCreator"),
    path('dungeon/parts/edit/<int:id>/', partEditor, name="partEditor"),
]
