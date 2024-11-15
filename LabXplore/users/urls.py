# users/urls.py
from django.urls import path
from . import views


urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('profile/', views.profile_view, name='profile'),
    path('logout/', views.logout_view, name='logout'),
    path('newtons_laws/', views.newtons_laws, name='newtons_laws'),
    path('newton_lab/', views.newton_lab, name='newton_lab'),
    path('newton_quiz/', views.newton_quiz, name='newton_quiz'),
    path('home/', views.home_view, name='home'),
    path('change_password/', views.change_password, name='change_password'),
    path('change_username/', views.change_username, name='change_username'),
    path('delete-simulation-history/', views.delete_simulation_history, name='delete_simulation_history'),
    path('save_simulation/', views.save_simulation, name='save_simulation'),
]
