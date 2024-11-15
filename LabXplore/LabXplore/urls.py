# LabXplore/urls.py
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from users.views import IndexView, home_view  # Import IndexView dan home_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('', IndexView.as_view(), name='index'),  # Halaman utama (index.html)
    path('home/', home_view, name='home'),        # Halaman setelah login (home.html)
]