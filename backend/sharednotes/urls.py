"""
URL configuration for sharednotes project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path

from sharednotes.API.views import my_protected_view, get_doc_list, update_colab, delete_doc, get_colab_list, delete_colab, update_colab_access, get_doc, export_rtf_string_to_pdf
from .views.auth import google_login
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path('auth/google/', google_login, name='google_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/test/', my_protected_view),

    path('api/docs/', get_doc_list),
    path('api/docs/delete/', delete_doc),
    path('api/docs/<str:uid>/', get_doc),
    path('api/colab/update_colab/', update_colab),
    path('api/colab/<int:id>/', get_colab_list),
    path('api/colab/delete/', delete_colab),
    path('api/colab/access/', update_colab_access),

    path('api/docs/download/<str:format>/<str:uid>', export_rtf_string_to_pdf)

]
