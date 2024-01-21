from django import template

register = template.Library()


@register.filter(name='range')
def filter_range(bound):
    return range(bound)


@register.filter(name='increment')
def filter_range(number):
    return number + 1


@register.filter(name='camel')
def filter_range(string):
    return string[0].upper() + string[1:]
