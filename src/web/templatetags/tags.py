from django import template

from dashboard.settings import API_URL

register = template.Library()


@register.simple_tag
def imageFor(image_path):
    return API_URL + image_path
