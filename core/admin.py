from django.contrib import admin
from .models import ContactInfo, YogaType, Subhashita, Inquiry

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('email', 'whatsapp')

@admin.register(YogaType)
class YogaTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Subhashita)
class SubhashitaAdmin(admin.ModelAdmin):
    list_display = ('id', 'sanskrit_text')

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
