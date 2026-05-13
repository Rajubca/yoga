from django.shortcuts import render
from .models import ContactInfo, YogaType, Subhashita, Inquiry
from django.contrib import messages
import random

def home(request):
    if request.method == "POST":
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')
        if name and email and message:
            Inquiry.objects.create(name=name, email=email, message=message)
            messages.success(request, "Thank you! Your message has been sent successfully.")
        else:
            messages.error(request, "Please fill out all fields.")

    contact_info = ContactInfo.objects.first()
    yoga_types = YogaType.objects.all()

    subhashitas = list(Subhashita.objects.all())
    random_subhashita = random.choice(subhashitas) if subhashitas else None

    # Pass yoga types as a dictionary for easy JS access
    yoga_data = {
        yoga.id: {
            'name': yoga.name,
            'detailed_description': yoga.detailed_description,
            'image_url': yoga.image_url if yoga.image_url else '/static/img/logo.png'
        } for yoga in yoga_types
    }

    context = {
        'contact': contact_info,
        'yoga_types': yoga_types,
        'yoga_data': yoga_data,
        'subhashita': random_subhashita,
    }
    return render(request, 'core/home.html', context)
