from django.shortcuts import render, get_object_or_404, redirect
from .models import FoodItem, Category

from django.contrib.auth.decorators import user_passes_test
from django.contrib import messages

def home(request):
    featured_items = FoodItem.objects.all()[:3]
    return render(request, 'menu/home.html', {'featured_items': featured_items})

def menu_list(request):
    categories = Category.objects.all()
    items = FoodItem.objects.filter(is_available=True)
    category_slug = request.GET.get('category')
    if category_slug:
        items = items.filter(category__slug=category_slug)
    
    return render(request, 'menu/menu_list.html', {
        'categories': categories,
        'items': items,
        'current_category': category_slug
    })

@user_passes_test(lambda u: u.is_authenticated and u.is_restaurant_admin)
def menu_management(request):
    items = FoodItem.objects.all().order_by('-created_at')
    categories = Category.objects.all()
    return render(request, 'menu/admin_dashboard.html', {
        'items': items,
        'categories': categories
    })

@user_passes_test(lambda u: u.is_authenticated and u.is_restaurant_admin)
def add_food_item(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        category_id = request.POST.get('category')
        description = request.POST.get('description')
        price = request.POST.get('price')
        image_url = request.POST.get('image_url')
        is_veg = request.POST.get('is_veg') == 'on'
        prep_time = request.POST.get('prep_time', 30)

        category = get_object_or_404(Category, id=category_id)
        FoodItem.objects.create(
            name=name,
            category=category,
            description=description,
            price=price,
            image_url=image_url,
            is_veg=is_veg,
            prep_time=prep_time
        )
        messages.success(request, f"New supply drop '{name}' registered in the inventory.")
        return redirect('menu_management')
    return redirect('menu_management')

@user_passes_test(lambda u: u.is_authenticated and u.is_restaurant_admin)
def edit_food_item(request, item_id):
    item = get_object_or_404(FoodItem, id=item_id)
    categories = Category.objects.all()
    if request.method == 'POST':
        item.name = request.POST.get('name')
        item.category = get_object_or_404(Category, id=request.POST.get('category'))
        item.description = request.POST.get('description')
        item.price = request.POST.get('price')
        item.image_url = request.POST.get('image_url')
        item.is_available = request.POST.get('is_available') == 'on'
        item.is_veg = request.POST.get('is_veg') == 'on'
        item.prep_time = request.POST.get('prep_time', 30)
        item.save()
        messages.success(request, f"Configuration for '{item.name}' updated successfully.")
        return redirect('menu_management')
    
    return render(request, 'menu/edit_food_item.html', {
        'item': item,
        'categories': categories
    })

@user_passes_test(lambda u: u.is_authenticated and u.is_restaurant_admin)
def delete_food_item(request, item_id):
    item = get_object_or_404(FoodItem, id=item_id)
    if request.method == 'POST':
        item_name = item.name
        item.delete()
        messages.success(request, f"Unit '{item_name}' has been decommissioned from the manifest.")
        referer = request.META.get('HTTP_REFERER', '')
        if 'management' in referer:
            return redirect('menu_management')
        return redirect('menu_list')
    return redirect('menu_list')
