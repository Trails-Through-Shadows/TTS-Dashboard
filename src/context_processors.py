from django.conf import settings

def defaultContext(request):
    url = request.get_full_path()

    context = {
        'ROOT_URL': '/' + request.LANGUAGE_CODE + '/',
        'URL': url.replace('/' + request.LANGUAGE_CODE, '', 1),
        'LANG': request.LANGUAGE_CODE,
        'SEARCH': request.GET.get('filter', '')
    }

    breadcrumbItems = url.split('/')
    breadcrumbItems.pop(0)
    breadcrumbItems.pop(0)

    if '?' in breadcrumbItems[-1]:
        breadcrumbItems[-1] = breadcrumbItems[-1].split('?')[0]

    breadcrumbItems = list(filter(None, breadcrumbItems))
    context['BREADCRUMBS'] = breadcrumbItems

    return context
