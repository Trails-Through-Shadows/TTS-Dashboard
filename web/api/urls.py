from django.urls import path

urlpatterns = [
    path('api/table/<str:table>/', ApiView.as_view(), name='apiQueryTable'),
    path('api/table/<str:table>/<int:id>/', ApiView.as_view(), name='apiQueryTableID'),
    path('api/validate/<str:table>/', validateTable, name='apiValidateTable'),
]
