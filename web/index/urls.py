# -*- encoding: utf-8 -*-

from django.urls import path

from dashboard.pages.index import views

urlpatterns = [
    path('', views.index, name='home'),
]