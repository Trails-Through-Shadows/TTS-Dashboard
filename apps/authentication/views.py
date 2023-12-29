# -*- encoding: utf-8 -*-

from django.contrib.auth import authenticate, login, logout
from django.utils.translation import gettext_lazy as lang
from django.shortcuts import render, redirect
from .forms import LoginForm


def login_view(request):
    form = LoginForm(request.POST or None)
    msg = None

    if request.method == "POST":
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")

            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("/")
            else:
                msg = lang('Invalid credentials')
        else:
            msg = lang('Error validating the form')

    return render(request, "auth/login.html", {"form": form, "msg": msg})

def logout_view(request):
    logout(request)
    return redirect("/")
