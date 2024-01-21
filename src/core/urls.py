# -*- encoding: utf-8 -*-

from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include

urlpatterns = i18n_patterns(
    path('admin/', admin.site.urls),
    path("", include("src.pages.authentication.urls")),
    path("", include("src.pages.dungeon.urls")),
    path("", include("src.pages.api.urls")),

    # Default home urls
    path("", include("src.pages.index.urls"))
)
