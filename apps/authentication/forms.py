# -*- encoding: utf-8 -*-

from django import forms
from django.utils.translation import gettext_lazy as _


class LoginForm(forms.Form):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "placeholder": _("Username"),
                "class": "form-control"
            }
        ))

    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "placeholder": _('Password'),
                "class": "form-control"
            }
        ))
