from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('menu/', views.menu_list, name='menu_list'),
    path('management/', views.menu_management, name='menu_management'),
    path('management/add/', views.add_food_item, name='add_food_item'),
    path('management/edit/<int:item_id>/', views.edit_food_item, name='edit_food_item'),
    path('management/delete/<int:item_id>/', views.delete_food_item, name='delete_food_item'),
]
