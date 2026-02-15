from django.contrib import admin

from .models import GetInTouch, ShipperRequest

# Register your models here.

@admin.register(GetInTouch)
class GetInTouchAdmin(admin.ModelAdmin):
    ...

@admin.register(ShipperRequest)
class ShipperRequestAdmin(admin.ModelAdmin):
    ...
