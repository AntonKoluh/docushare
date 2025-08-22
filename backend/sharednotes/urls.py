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
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from sharednotes.api.views import (get_doc_list, edit_public_access, delete_doc,
                                   get_colab_list, delete_colab, update_colab_access, get_doc,
                                   export_rtf_string_to_pdf, edit_add_collaborator, register_user, 
                                   login_user, ai_sum, ai_health)
from .views.auth import google_login


urlpatterns = [
    path("admin/", admin.site.urls),
    path('auth/google/', google_login, name='google_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register_user),
    path('api/login/', login_user),

    path('api/docs/', get_doc_list),
    path('api/docs/delete/', delete_doc),
    path('api/docs/<str:uid>/', get_doc),
    path('api/colab/public_access/', edit_public_access),
    path('api/colab/add_colab/', edit_add_collaborator),
    path('api/colab/<int:doc_id>/', get_colab_list),
    path('api/colab/delete/', delete_colab),
    path('api/colab/access/', update_colab_access),

    path('api/docs/download/<str:file_format>/<str:uid>', export_rtf_string_to_pdf),

    path('api/ai/test/', ai_sum),
    path('api/ai/health/', ai_health)

]
