from django.db import models
from django.utils import timezone
# Create your models here.


class GetInTouch(models.Model):
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(max_length=255)
    message = models.TextField(blank=True)
    drivers_license = models.ImageField(upload_to='drivers_licenses/')
    created_at = models.DateTimeField(default=timezone.now)  # Changed from auto_now_add

    def __str__(self):
        return self.full_name