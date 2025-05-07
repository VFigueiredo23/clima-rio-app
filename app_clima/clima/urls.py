from django.urls import path
from .views import ClimaView, AvisosImportantesView


urlpatterns = [
    path('clima/', ClimaView.as_view()),
    path('avisos/', AvisosImportantesView.as_view()),
]
