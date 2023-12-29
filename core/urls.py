# -*- encoding: utf-8 -*-

from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include

urlpatterns = i18n_patterns(
    path('admin/', admin.site.urls),  # Django admin route
    path("", include("apps.authentication.urls")),  # Auth routes - login / logout)
    path("", include("apps.scheme.urls")),  # Part routes

    # Leave `Home.Urls` as last the last line
    path("", include("apps.home.urls"))
)
