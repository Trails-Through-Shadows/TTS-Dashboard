# -*- encoding: utf-8 -*-

from django import forms
from django.utils.translation import gettext_lazy as lang


class LoginForm(forms.Form):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": lang("Username"),
                "class": "form-control"
            }
        ))

    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "placeholder": lang('Password'),
                "class": "form-control"
            }
        ))
