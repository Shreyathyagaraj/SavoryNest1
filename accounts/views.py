from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from .forms import UserRegistrationForm, UserUpdateForm
from django.contrib import messages

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f"Identity established. Welcome, {user.username}!")
            return redirect('home')
    else:
        form = UserRegistrationForm()
    return render(request, 'accounts/register.html', {'form': form})

@login_required
def profile(request):
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Manifest updated successfully.")
            return redirect('profile')
    else:
        form = UserUpdateForm(instance=request.user)
    
    orders = request.user.orders.all().order_by('-created_at')
    return render(request, 'accounts/profile.html', {
        'form': form,
        'orders': orders
    })
