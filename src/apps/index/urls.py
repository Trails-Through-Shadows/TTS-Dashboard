# -*- encoding: utf-8 -*-

from django.urls import path

from src.apps.index import views

urlpatterns = [
    path('', views.index, name='home'),
]
