from django.urls import path
from . import views

urlpatterns = [
    path('', views.django_application, name='django_application'),
    path('definition/<str:word>', views.keyword_def, name="keyword_def"),
    path('translate/<str:language>',views.translate,name="translate")
]
