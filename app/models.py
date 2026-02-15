from django.db import models
from django.utils import timezone
from django.core.validators import FileExtensionValidator


class GetInTouch(models.Model):
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(max_length=255)
    message = models.TextField(blank=True)
    drivers_license = models.ImageField(
        upload_to='drivers_licenses/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'pdf'])],
        help_text='Upload driver\'s license (max 3MB, JPG/PNG/WEBP/PDF)'
    )
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = 'Driver Application'
        verbose_name_plural = 'Driver Applications'
        ordering = ['-created_at']


class ShipperRequest(models.Model):
    EQUIPMENT_CHOICES = [
        ('dry_van', 'Dry Van'),
        ('flatbed', 'Flatbed'),
        ('reefer', 'Reefer'),
        ('po', 'PO (Amazon and US mail)'),
    ]
    
    company_name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(max_length=255)
    origin_city_state = models.CharField(max_length=255)
    destination_city_state = models.CharField(max_length=255)
    frequency = models.CharField(max_length=255, help_text='Date range for frequency')
    equipment_type = models.CharField(max_length=50, choices=EQUIPMENT_CHOICES, default='dry_van')
    estimated_volume = models.CharField(max_length=255)
    additional_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.company_name} - {self.full_name}"

    class Meta:
        verbose_name = 'Shipper/Broker Request'
        verbose_name_plural = 'Shipper/Broker Requests'
        ordering = ['-created_at']