from django.core.management.base import BaseCommand
from menu.models import Category, FoodItem
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Seeds the database with default food items'

    def handle(self, *args, **kwargs):
        # Categories
        categories_data = [
            'Pizza', 'Burger', 'Pasta', 'South Indian', 'North Indian', 
            'Chinese', 'Desserts', 'Beverages'
        ]
        
        categories = {}
        for cat_name in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={'slug': slugify(cat_name)}
            )
            categories[cat_name] = cat
            
        # Food Items
        food_items_data = [
            # Pizza
            {'category': 'Pizza', 'name': 'Margherita Pizza', 'price': 299, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800', 'desc': 'San Marzano tomatoes, fresh mozzarella, and aromatic basil leaves.'},
            {'category': 'Pizza', 'name': 'Pepperoni Beast', 'price': 449, 'is_veg': False, 'image': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800', 'desc': 'Triple layered spicy pepperoni with an extra cheese blend.'},
            {'category': 'Pizza', 'name': 'Truffle Mushroom', 'price': 499, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', 'desc': 'Wild forest mushrooms drizzled with liquid gold truffle oil.'},
            
            # Burgers
            {'category': 'Burger', 'name': 'Wagyu Beef Burger', 'price': 599, 'is_veg': False, 'image': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', 'desc': 'Premium Wagyu patty with caramelized onions and aged cheddar.'},
            {'category': 'Burger', 'name': 'Crispy Paneer Burger', 'price': 249, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', 'desc': 'A thick slab of batter-fried paneer with chipotle mayo.'},
            
            # Pasta
            {'category': 'Pasta', 'name': 'White Sauce Penne', 'price': 349, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800', 'desc': 'Creamy alfredo sauce with garlic-brushed broccoli and bell peppers.'},
            {'category': 'Pasta', 'name': 'Spicy Arrabbiata', 'price': 329, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800', 'desc': 'Tangy tomato sauce with a kick of red chili and olives.'},
            
            # South Indian
            {'category': 'South Indian', 'name': 'Masala Dosa', 'price': 149, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800', 'desc': 'Crispy fermented crepe filled with spiced potato mash.'},
            {'category': 'South Indian', 'name': 'Ghee Roast Idli', 'price': 129, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800', 'desc': 'Soft steamed rice cakes tossed in aromatic spiced ghee.'},
            
            # North Indian
            {'category': 'North Indian', 'name': 'Paneer Butter Masala', 'price': 389, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800', 'desc': 'Velvety tomato gravy with cubes of artisan cottage cheese.'},
            {'category': 'North Indian', 'name': 'Butter Chicken', 'price': 429, 'is_veg': False, 'image': 'https://images.unsplash.com/photo-1603894584202-9332ca7ced8b?w=800', 'desc': 'Tandoori chicken simmered in a rich, buttery tomato sauce.'},
            {'category': 'North Indian', 'name': 'Dal Makhani', 'price': 299, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800', 'desc': 'Black lentils slow-cooked for 12 hours with cream and butter.'},

            # Chinese
            {'category': 'Chinese', 'name': 'Chicken Fried Rice', 'price': 279, 'is_veg': False, 'image': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800', 'desc': 'Wok-tossed rice with seasoned chicken shards and spring onions.'},
            {'category': 'Chinese', 'name': 'Veg Hakka Noodles', 'price': 249, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800', 'desc': 'Stir-fried noodles with crisp vegetables and soy glaze.'},
            
            # Desserts
            {'category': 'Desserts', 'name': 'Warm Brownie', 'price': 199, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800', 'desc': 'Fudgy dark chocolate brownie served with vanilla cream.'},
            {'category': 'Desserts', 'name': 'Gulab Jamun (2pc)', 'price': 99, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800', 'desc': 'Golden fried milk balls soaked in saffron sugar syrup.'},
            
            # Beverages
            {'category': 'Beverages', 'name': 'Cold Coffee', 'price': 159, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=800', 'desc': 'Strong blended espresso with chilled milk and foam.'},
            {'category': 'Beverages', 'name': 'Mango Lassi', 'price': 129, 'is_veg': True, 'image': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800', 'desc': 'Thick yogurt blend with Alphonso mango pulp.'},
        ]

        for item in food_items_data:
            FoodItem.objects.get_or_create(
                name=item['name'],
                defaults={
                    'category': categories[item['category']],
                    'description': item['desc'],
                    'price': item['price'],
                    'image_url': item['image'],
                    'is_veg': item['is_veg'],
                    'rating': 4.5
                }
            )
            
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(food_items_data)} items.'))
