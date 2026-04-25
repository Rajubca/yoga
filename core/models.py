from django.db import models

class ContactInfo(models.Model):
    email = models.EmailField(max_length=255)
    whatsapp = models.CharField(max_length=20)

    class Meta:
        verbose_name = "Contact Info"
        verbose_name_plural = "Contact Infos"

    def __str__(self):
        return f"Contact Info ({self.email})"

class YogaType(models.Model):
    name = models.CharField(max_length=100)
    short_description = models.TextField(help_text="A short summary for the main page.")
    detailed_description = models.TextField(help_text="Detailed description for the modal.")
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="URL to a high-quality image.")

    class Meta:
        verbose_name = "Yoga Type"
        verbose_name_plural = "Yoga Types"

    def __str__(self):
        return self.name

class Subhashita(models.Model):
    sanskrit_text = models.TextField(help_text="The Sanskrit text of the Subhashita")
    english_meaning = models.TextField(help_text="The English translation or meaning")

    class Meta:
        verbose_name = "Subhashita"
        verbose_name_plural = "Subhashitas"

    def __str__(self):
        return self.sanskrit_text[:50] + "..."
