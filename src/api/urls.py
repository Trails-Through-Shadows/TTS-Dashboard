from django.urls import path

from src.api.views import ApiView, validateTable

urlpatterns = [
    path('table/<str:table>/', ApiView.as_view(), name='apiQueryTable'),
    path('table/<str:table>/<int:id>/', ApiView.as_view(), name='apiQueryTableID'),
    path('validate/<str:table>/', validateTable, name='apiValidateTable'),
]
