# -*- encoding: utf-8 -*-
from django.urls import path

from .views import *

urlpatterns = [
    path('api/table/<str:table>/', ApiView.as_view()),
    path('api/table/<str:table>/<int:id>/', ApiView.as_view()),
]
