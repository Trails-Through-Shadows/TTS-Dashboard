from django.conf import settings


def cfg_assets_root(request):
    url = request.get_full_path()

    context = {
        'ASSETS_ROOT': settings.ASSETS_ROOT,
        'ROOT_URL': '/' + request.LANGUAGE_CODE + '/',
        'URL': url.replace('/' + request.LANGUAGE_CODE, '', 1),
        'LANG': request.LANGUAGE_CODE,
        'SEARCH': request.GET.get('filter', '')
    }

    breadcrumbItems = url.split('/')
    breadcrumbItems = list(filter(None, breadcrumbItems))
    breadcrumbItems.pop(0)
    breadcrumbs = ""

    if len(breadcrumbItems) != 0 and breadcrumbItems[0] != 'api':
        for i, item in enumerate(breadcrumbItems):

            backUrl = "../" * (len(breadcrumbItems) - i - 1)
            item = item[0].upper() + item[1:]

            if i == len(breadcrumbItems) - 1:
                breadcrumbs += '<li class="breadcrumb-item active" aria-current="page">' + item + '</li>'
                break

            breadcrumbs += '<li class="breadcrumb-item"><a href=' + backUrl + '>' + item + '</a></li>'

    context['BREADCRUMBS'] = breadcrumbs

    return context
