from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.cart, name='cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('payment/verify/', views.payment_verify, name='payment_verify'),
    path('success/', views.order_success, name='order_success'),
    path('<int:order_id>/', views.order_detail, name='order_detail'),
]
