# -*- encoding: utf-8 -*-

from django.urls import path

from .views import tableDataRequest

urlpatterns = [
    path('api/table/<str:table>/', tableDataRequest, name="tableDataRequest"),
]
