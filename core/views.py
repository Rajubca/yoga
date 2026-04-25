from django.shortcuts import render
from .models import ContactInfo, YogaType

def home(request):
    contact_info = ContactInfo.objects.first()
    yoga_types = YogaType.objects.all()

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
    }
    return render(request, 'core/home.html', context)
