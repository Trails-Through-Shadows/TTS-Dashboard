# -*- encoding: utf-8 -*-

from django.urls import path

from .views import partView, asyncDataRequest

urlpatterns = [
    path('scheme/parts', partView, name="partView"),
    path('data/parts', asyncDataRequest, name="asyncDataPartView"),
]
