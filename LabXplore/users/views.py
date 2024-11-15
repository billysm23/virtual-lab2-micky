# users/views.py
from django import forms
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.views.generic import TemplateView
from django.urls import reverse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import SimulationHistory
from django.shortcuts import render
from .models import SimulationHistory
from django.http import JsonResponse
import json
from django.http import JsonResponse
from .models import SimulationHistory


class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email']

class IndexView(TemplateView):
    template_name = "index.html"

@login_required  # Hanya bisa diakses jika user sudah login
def home_view(request):
    return render(request, "home.html")

@login_required
def profile_view(request):
    if request.method == 'POST':
        form = ProfileUpdateForm(request.POST, instance=request.user)
        password_form = PasswordChangeForm(user=request.user, data=request.POST)
        if form.is_valid() and password_form.is_valid():
            form.save()
            password_form.save()
            update_session_auth_hash(request, password_form.user)
            messages.success(request, 'Your profile was updated successfully.')
            return redirect('profile')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = ProfileUpdateForm(instance=request.user)
        password_form = PasswordChangeForm(user=request.user)

    return render(request, 'users/profile.html', {
        'form': form,
        'password_form': password_form,
    })


def logout_view(request):
    logout(request)
    return redirect('index')

from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.shortcuts import render, redirect
from django.urls import reverse

def login_view(request):
    if request.method == "POST":
        # Retrieve 'username' and 'password' from the POST data
        username = request.POST.get("username")
        password = request.POST.get("password")
        
        # Authenticate using 'username' and 'password'
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            messages.success(request, "Login berhasil!")
            return redirect(reverse('home'))  # Redirect to home page after successful login
        else:
            messages.error(request, "Username atau password salah.")
    
    return render(request, "users/login.html")

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Akun berhasil dibuat! Silakan login.')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'users/register.html', {'form': form})
    
def newtons_laws(request):
    return render(request, 'users/newtons_laws.html')

def newton_lab(request):
    return render(request, 'users/newton_lab.html')

def newton_quiz(request):
    return render(request, 'users/newton_quiz.html')

# views.py
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import redirect, render

@login_required
def change_username(request):
    if request.method == 'POST':
        new_username = request.POST.get('new_username')
        
        # Check if the new username is different from the current one
        if new_username and new_username != request.user.username:
            # Check if the username is already taken
            if User.objects.filter(username=new_username).exists():
                messages.error(request, 'Username is already taken. Please choose another.')
            else:
                # Update the username
                request.user.username = new_username
                request.user.save()
                messages.success(request, 'Your username has been updated successfully.')
        else:
            messages.error(request, 'Please enter a new username.')

        return redirect('profile')
    return render(request, 'profile.html')


@login_required
def change_password(request):
    if request.method == 'POST':
        old_password = request.POST['old_password']
        new_password = request.POST['new_password']
        new_password_confirmation = request.POST['new_password_confirmation']

        if not request.user.check_password(old_password):
            messages.error(request, 'Old password is incorrect.')
            return redirect('profile')

        if new_password != new_password_confirmation:
            messages.error(request, 'New passwords do not match.')
            return redirect('profile')

        # Update the user's password
        request.user.set_password(new_password)
        request.user.save()

        # Keep the user logged in after the password change
        update_session_auth_hash(request, request.user)
        messages.success(request, 'Your password has been updated successfully.')
        return redirect('profile')
    else:
        return render(request, 'profile.html')

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import SimulationHistory

@login_required
def newton_lab(request):
    if request.method == "POST":
        # Get the values from the request
        mass = float(request.POST.get("mass"))
        force = float(request.POST.get("force"))
        static_friction = float(request.POST.get("static_friction"))
        kinetic_friction = float(request.POST.get("kinetic_friction"))
        # Example calculation for acceleration
        acceleration = (force - (static_friction * mass * 9.81)) / mass

        # Save history to the database
        SimulationHistory.objects.create(
            user=request.user,
            mass=mass,
            force=force,
            static_friction=static_friction,
            kinetic_friction=kinetic_friction,
            acceleration=acceleration
        )
        return redirect("newton_lab")  # Refresh the page to display new history

    # Retrieve the user's history entries
    history_entries = SimulationHistory.objects.filter(user=request.user).order_by("-timestamp")
    return render(request, "users/newton_lab.html", {"history_entries": history_entries})

@login_required
def save_simulation(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print("Received data:", data)  # Debugging line
        
        mass = data.get('mass')
        force = data.get('force')
        static_friction = data.get('staticFriction')
        kinetic_friction = data.get('kineticFriction')
        acceleration = data.get('acceleration')

        # Save data to the database with the user
        SimulationHistory.objects.create(
            user=request.user,
            mass=mass,
            force=force,
            static_friction=static_friction,
            kinetic_friction=kinetic_friction,
            acceleration=acceleration
        )
        print("Data saved successfully!")  # Debugging line
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False})


@login_required
def newton_lab_view(request):
    history_entries = SimulationHistory.objects.filter(user=request.user).order_by('-timestamp')
    return render(request, 'users/newton_lab.html', {'history_entries': history_entries})

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def delete_simulation_history(request):
    if request.method == 'DELETE':
        # Assuming you have a model 'SimulationHistory' that records the history
        SimulationHistory.objects.all().delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False}, status=405)
