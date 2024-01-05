# -*- encoding: utf-8 -*-

from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include

urlpatterns = i18n_patterns(
    path('admin/', admin.site.urls),
    path("", include("src.apps.authentication.urls")),
    path("", include("src.apps.dungeon.urls")),
    path("", include("src.apps.api.urls")),

    # Default home urls
    path("", include("src.apps.index.urls"))
)
