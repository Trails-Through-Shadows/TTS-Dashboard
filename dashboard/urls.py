# -*- encoding: utf-8 -*-

from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include

from dashboard import settings

urlpatterns = i18n_patterns(
    path("", include("src.web.urls")),
    path("", include("src.auth.urls")),
    path("api/", include("src.api.urls")),
    path('admin/', admin.site.urls),
)
