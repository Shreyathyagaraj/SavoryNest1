import json
import razorpay
from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Order, OrderItem
from menu.models import FoodItem

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET))

def cart(request):
    return render(request, 'orders/cart.html')

@login_required
def checkout(request):
    if request.method == 'POST':
        # Get data from frontend (hidden input or JSON)
        cart_data = request.POST.get('cart_data')
        if not cart_data:
            return redirect('cart')
        
        items = json.loads(cart_data)
        total_amount = sum(float(item['price']) * item['quantity'] for item in items)
        
        # Create Order in DB
        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            address=request.POST.get('address', request.user.address),
            phone=request.POST.get('phone', request.user.phone),
            status='pending'
        )
        
        # Create Order Items
        for item in items:
            food_item = get_object_or_404(FoodItem, id=item['id'])
            OrderItem.objects.create(
                order=order,
                food_item=food_item,
                quantity=item['quantity'],
                price=item['price']
            )
        
        # Create Razorpay Order
        razorpay_order = client.order.create({
            'amount': int(total_amount * 100),
            'currency': 'INR',
            'receipt': f'order_{order.id}',
            'payment_capture': 1
        })
        
        order.razorpay_order_id = razorpay_order['id']
        order.save()
        
        return render(request, 'orders/checkout.html', {
            'order': order,
            'razorpay_key': settings.RAZORPAY_KEY_ID,
            'razorpay_order_id': razorpay_order['id'],
            'amount': razorpay_order['amount']
        })

    return redirect('cart')

@login_required
def payment_verify(request):
    if request.method == 'POST':
        data = request.POST
        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': data.get('razorpay_order_id'),
                'razorpay_payment_id': data.get('razorpay_payment_id'),
                'razorpay_signature': data.get('razorpay_signature')
            })
            
            order = Order.objects.get(razorpay_order_id=data.get('razorpay_order_id'))
            order.is_paid = True
            order.razorpay_payment_id = data.get('razorpay_payment_id')
            order.status = 'confirmed'
            order.save()
            
            return JsonResponse({'status': 'success'})
        except:
            return JsonResponse({'status': 'failure'}, status=400)
    return redirect('home')

@login_required
def order_success(request):
    return render(request, 'orders/success.html')

@login_required
def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, 'orders/order_detail.html', {'order': order})
