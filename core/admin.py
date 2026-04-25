from django.contrib import admin
from .models import ContactInfo, YogaType

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('email', 'whatsapp')

@admin.register(YogaType)
class YogaTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
