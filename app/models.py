from django.db import models

# Create your models here.


class GetInTouch(models.Model):
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.CharField(max_length=255)
    message = models.TextField()

    def __str__(self):
        return self.full_name